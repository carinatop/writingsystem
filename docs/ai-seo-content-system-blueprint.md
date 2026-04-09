# AI SEO Content System Blueprint (Netlify + Next.js + Supabase + Anthropic)

## Product Vision
Build a multi-brand SEO writing operating system where one user can manage strategy, references, pipeline, and AI-assisted production across many brands from one dashboard, while preserving strict brand separation. The app should produce publish-ready outputs (not just drafts) and support real editorial workflows (brief → outline → draft → QA → final → export).

**Primary outcomes**
- Produce brand-aligned, SEO-aligned long-form and newsletter content faster.
- Maintain consistent brand voice by storing and reusing brand references and writing rules.
- Track content lifecycle with clear statuses and QA score before publishing.
- Generate PDF-ready article deliverables and CMS-ready final content.

**MVP success criteria (first 30 days)**
- 3+ brands configured with unique Brand Brain settings.
- 20+ content items processed through pipeline with stored status.
- AI-generated briefs/outlines/drafts/finals available for each item.
- QA score generated and visible for each draft.
- PDF export working for final content.

## MVP Scope

### In Scope (Build First)
1. Authentication + user workspace.
2. Multi-brand management and Brand Brain configuration.
3. Content item creation and workflow status tracking.
4. AI generation pipeline:
   - brief
   - outline
   - draft
   - metadata (title/meta/FAQ/CTA/internal links)
   - QA scoring + improvement suggestions
   - publish-ready rewrite
5. Upload reference files per brand + per content item.
6. Progress/status UI during generation.
7. PDF export for final publish-ready output.

### Not in MVP (Build Later)
- Team roles beyond owner/editor.
- External SEO API integrations (Ahrefs/SEMrush) live sync.
- Automatic CMS publishing integration.
- Advanced vector search/chunk ranking.
- Multi-language localization workflows.

### Feature Prioritization
- **P0:** Auth, Brands, Brand Brain, Content Pipeline, AI generation, QA, Publish-ready output, status feedback.
- **P1:** Refresh queue, internal link opportunity board, richer calendar views.
- **P2:** Automation rules, collaboration comments, CMS direct publish.

## Core Modules
1. **Auth/User Layer**
   - Supabase Auth, workspace ownership, RLS.
2. **Dashboard Module**
   - Overview metrics, queue counts, due-date visibility.
3. **Brand Brain Module**
   - Brand profile, voice rules, offers, SEO notes, references.
4. **SEO Brain Module**
   - Keyword intent, SERP assumptions, structure guidance, metadata rules.
5. **Workflow Engine**
   - Stage transitions, run orchestration, status events.
6. **Output Engine**
   - Generates briefs, outlines, drafts, newsletter, metadata, final version.
7. **QA Engine**
   - Scores voice, SEO, readability, factual consistency; recommends revisions.
8. **File Upload/Reference Module**
   - Upload/reference retrieval with brand scoping.
9. **Export/PDF Module**
   - Render final article to printable HTML and PDF.
10. **Status/Progress Feedback Module**
    - Run timeline and real-time status updates.

## End-to-End Workflow
1. User creates/selects Brand.
2. User fills Brand Brain settings.
3. User uploads brand references (voice samples, past articles, docs).
4. User creates content item (keyword, type, due date, funnel stage).
5. User triggers “Generate Content Package”.
6. System creates a `workflow_run` and emits status steps:
   - Generating brief
   - Building outline
   - Drafting article
   - Generating SEO metadata + FAQ + CTA + links
   - Running QA
   - Preparing publish-ready version
7. User reviews generated assets in tabs.
8. User accepts revision suggestions or triggers “Revise with QA fixes”.
9. Final publish-ready version stored as canonical output.
10. User exports PDF and copies CMS-ready HTML/Markdown.
11. Content status set to Published (with URL), later moved to Refresh Queue.

## Dashboard/Page Structure

### Route List (App Router)
- `/login`
- `/dashboard` (overview)
- `/dashboard/brands`
- `/dashboard/brands/[brandId]`
- `/dashboard/brands/[brandId]/brain`
- `/dashboard/brands/[brandId]/references`
- `/dashboard/topic-clusters`
- `/dashboard/calendar`
- `/dashboard/briefs`
- `/dashboard/drafts`
- `/dashboard/qa-queue`
- `/dashboard/published`
- `/dashboard/refresh-queue`
- `/dashboard/internal-links`
- `/dashboard/content/[contentId]`

### Page Responsibilities
- **Overview:** KPIs, upcoming due dates, run failures, QA average.
- **Brands:** create/manage brands.
- **Brand Brain Settings:** all voice/offer/SEO policies.
- **References:** upload + list + tag files.
- **Briefs/Drafts/QA Queue:** filtered views by status.
- **Content Detail:** full generation workspace (tabs for brief/outline/draft/QA/final/export).

## Database Schema

### Core Tables
- `profiles`
- `brands`
- `brand_brain`
- `brand_internal_links`
- `brand_references`
- `content_items`
- `content_versions`
- `content_assets`
- `workflow_runs`
- `workflow_events`
- `qa_reports`
- `refresh_recommendations`

### Key Modeling Decisions
- Keep `content_items` as canonical record with status and SEO fields.
- Store each generation artifact in `content_assets` (brief/outline/draft/meta/faq/etc).
- Store editable long-form outputs in `content_versions` (draft/revised/final).
- Store run timeline in `workflow_events` for progress UI.
- Store references in Supabase Storage + metadata in `brand_references`.

## API/Serverless Route Map
Use Next.js Route Handlers (`app/api/.../route.ts`) compatible with Netlify Next adapter.

### Auth/Brand
- `POST /api/brands` create brand
- `GET /api/brands` list brands
- `PATCH /api/brands/:id` update brand
- `GET /api/brands/:id/brain` get brain
- `PUT /api/brands/:id/brain` upsert brain

### Content Pipeline
- `POST /api/content-items` create content item
- `GET /api/content-items` query/filter list
- `GET /api/content-items/:id` get detail
- `PATCH /api/content-items/:id` update metadata/status

### Generation
- `POST /api/generate/package` run full pipeline
- `POST /api/generate/brief`
- `POST /api/generate/outline`
- `POST /api/generate/draft`
- `POST /api/generate/meta`
- `POST /api/generate/qa`
- `POST /api/generate/publish-ready`
- `POST /api/generate/refresh-recommendation`

### Uploads/References
- `POST /api/uploads/sign` create signed upload URL
- `POST /api/references` register uploaded reference metadata
- `GET /api/references?brandId=...` list references

### Workflow Status
- `GET /api/workflow-runs/:id` get run + events
- `GET /api/workflow-runs/:id/events` poll events (MVP polling)

### Export
- `POST /api/export/pdf` generate/store PDF
- `GET /api/export/pdf/:contentId` get PDF signed URL

## Prompt Architecture

### Prompt System Layers
1. **Global System Prompt**: universal writing quality rules.
2. **Brand Brain Context Block**: tone, banned words, preferred terms, offers, CTA style.
3. **SEO Brain Context Block**: keyword targets, intent, structure constraints.
4. **Task Prompt**: specific output type (brief/outline/etc).
5. **Output Contract**: strict JSON schema or markdown template.

### Prompt Steps
1. **Brief Prompt**
   - Input: brand brain + keyword + intent + audience + references summary.
   - Output: problem statement, target reader, angle, suggested H2 set, CTA intent.
2. **Outline Prompt**
   - Input: brief + SEO constraints.
   - Output: H1/H2/H3 hierarchy with section goals and word count hints.
3. **Draft Prompt**
   - Input: outline + references excerpts + banned/preferred phrases.
   - Output: full markdown draft.
4. **Metadata Prompt**
   - Output: 10 title options, meta title, meta description, FAQs, CTA options, internal links suggestions.
5. **QA Prompt**
   - Input: draft + brand/SEO rules.
   - Output: scorecard JSON + required fixes.
6. **Publish-Ready Prompt**
   - Input: draft + QA issues.
   - Output: revised final article + editor notes.
7. **Refresh Prompt**
   - Input: existing published article + updated notes.
   - Output: update plan and change recommendations.

## QA Scorecard
Weighted 100-point framework:
- Brand Voice Alignment (25)
- SEO Alignment (25)
- Structure & Readability (15)
- Factual/Logical Coherence (15)
- Conversion/CTA Effectiveness (10)
- Originality/Specificity (10)

### Pass/Fail Rules
- `>= 85` = publish-ready candidate
- `70-84` = needs revision
- `< 70` = regenerate key sections

### QA Output JSON
```json
{
  "total_score": 82,
  "category_scores": {
    "brand_voice": 20,
    "seo_alignment": 19,
    "readability": 13,
    "coherence": 12,
    "cta": 9,
    "originality": 9
  },
  "must_fix": ["Keyword not present in first 120 words"],
  "should_improve": ["Add one concrete example in section 3"],
  "passed": false
}
```

## Upload + Reference File Logic

### Storage Strategy
- Supabase Storage bucket: `brand-references` (private).
- Path convention: `userId/brandId/{timestamp}-{filename}`.

### Supported MVP file types
- `.pdf`, `.docx`, `.txt`, `.md`.

### Processing Flow
1. Client requests signed URL.
2. Client uploads file directly to Supabase Storage.
3. API stores metadata row in `brand_references`.
4. Background parsing step extracts text (MVP synchronous for small files).
5. Extracted summary + key excerpts stored for prompt context.

### Reference Use During Generation
- Retrieve top N references by brand + tags + recency.
- Build compact context block:
  - voice examples
  - approved phrases
  - competitor context
  - factual snippets

## PDF Export Logic

### MVP approach (Netlify friendly)
- Generate print-safe HTML from final markdown.
- Convert HTML to PDF using `@react-pdf/renderer` or server-side `pdf-lib` template.
- Store PDF in Supabase Storage bucket `content-exports`.
- Save `pdf_file_path` and signed URL access endpoint.

### Export states
- `not_started`
- `queued`
- `processing`
- `ready`
- `failed`

## Status/Progress UI Logic

### UX Pattern
- Right-side “Generation Progress” panel + blocking modal during active run.
- Each stage displayed with state: pending / running / complete / failed.

### Event Model
- On run start create `workflow_run`.
- Insert event row for each stage transition.
- UI polls `/api/workflow-runs/:id/events` every 2–3 seconds (MVP).
- On completion, modal switches to success with quick links to generated tabs.

### Standard Stage Keys
- `brief_generating`
- `outline_building`
- `draft_writing`
- `metadata_generating`
- `qa_running`
- `publish_ready_preparing`
- `pdf_exporting`

## Folder Structure
```txt
writingsystem/
  app/
    (auth)/login/page.tsx
    dashboard/layout.tsx
    dashboard/page.tsx
    dashboard/brands/page.tsx
    dashboard/brands/[brandId]/page.tsx
    dashboard/brands/[brandId]/brain/page.tsx
    dashboard/brands/[brandId]/references/page.tsx
    dashboard/content/[contentId]/page.tsx
    api/
      brands/route.ts
      brands/[id]/route.ts
      brands/[id]/brain/route.ts
      content-items/route.ts
      content-items/[id]/route.ts
      generate/package/route.ts
      generate/brief/route.ts
      generate/outline/route.ts
      generate/draft/route.ts
      generate/meta/route.ts
      generate/qa/route.ts
      generate/publish-ready/route.ts
      uploads/sign/route.ts
      references/route.ts
      workflow-runs/[id]/route.ts
      workflow-runs/[id]/events/route.ts
      export/pdf/route.ts
      export/pdf/[contentId]/route.ts
  components/
    dashboard/
    brands/
    content/
    qa/
    workflow/
    export/
    ui/
  lib/
    supabase/
      client.ts
      server.ts
      middleware.ts
    anthropic/
      client.ts
      prompts/
        brief.ts
        outline.ts
        draft.ts
        meta.ts
        qa.ts
        publishReady.ts
        refresh.ts
    workflow/
      orchestrator.ts
      events.ts
    pdf/
      renderArticlePdf.ts
    uploads/
      parseReference.ts
      referenceContext.ts
  types/
    database.ts
    content.ts
    workflow.ts
  supabase/
    migrations/
      001_initial_schema.sql
  docs/
    ai-seo-content-system-blueprint.md
```

## Supabase SQL Schema
```sql
-- 001_initial_schema.sql
create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz default now()
);

create table if not exists brands (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  niche text,
  target_audience text,
  cta_style text,
  positioning_notes text,
  seo_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists brand_brain (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid unique not null references brands(id) on delete cascade,
  tone_of_voice text,
  banned_phrases text[] default '{}',
  preferred_phrases text[] default '{}',
  offers jsonb default '[]'::jsonb,
  content_categories text[] default '{}',
  competitors text[] default '{}',
  approved_examples jsonb default '[]'::jsonb,
  writing_rules text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists brand_internal_links (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete cascade,
  url text not null,
  anchor_hint text,
  priority int default 3,
  created_at timestamptz default now()
);

create table if not exists brand_references (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  file_name text not null,
  file_path text not null,
  mime_type text,
  file_size bigint,
  ref_type text check (ref_type in ('voice_sample','reference_article','attachment','past_article')),
  tags text[] default '{}',
  extracted_text text,
  summary text,
  created_at timestamptz default now()
);

create table if not exists content_items (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  target_keyword text not null,
  secondary_keywords text[] default '{}',
  topic_cluster text,
  search_intent text,
  funnel_stage text,
  content_type text check (content_type in ('article','blog','newsletter')),
  status text default 'idea',
  due_date date,
  cta text,
  notes text,
  final_url text,
  refresh_status text default 'none',
  qa_score numeric(5,2),
  revision_count int default 0,
  export_status text default 'not_started',
  pdf_available boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists content_versions (
  id uuid primary key default gen_random_uuid(),
  content_item_id uuid not null references content_items(id) on delete cascade,
  version_no int not null,
  version_type text check (version_type in ('draft','revised','final')),
  markdown text not null,
  created_by text default 'ai',
  created_at timestamptz default now(),
  unique(content_item_id, version_no)
);

create table if not exists content_assets (
  id uuid primary key default gen_random_uuid(),
  content_item_id uuid not null references content_items(id) on delete cascade,
  asset_type text check (asset_type in ('brief','outline','meta','faq','cta_options','internal_links','refresh_plan')),
  content jsonb not null,
  created_at timestamptz default now()
);

create table if not exists workflow_runs (
  id uuid primary key default gen_random_uuid(),
  content_item_id uuid not null references content_items(id) on delete cascade,
  brand_id uuid not null references brands(id) on delete cascade,
  status text default 'running',
  started_at timestamptz default now(),
  completed_at timestamptz,
  error_message text
);

create table if not exists workflow_events (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references workflow_runs(id) on delete cascade,
  stage_key text not null,
  stage_label text not null,
  state text not null,
  detail text,
  created_at timestamptz default now()
);

create table if not exists qa_reports (
  id uuid primary key default gen_random_uuid(),
  content_item_id uuid not null references content_items(id) on delete cascade,
  total_score numeric(5,2) not null,
  score_breakdown jsonb not null,
  must_fix jsonb default '[]'::jsonb,
  should_improve jsonb default '[]'::jsonb,
  passed boolean default false,
  created_at timestamptz default now()
);

create table if not exists refresh_recommendations (
  id uuid primary key default gen_random_uuid(),
  content_item_id uuid not null references content_items(id) on delete cascade,
  recommendation jsonb not null,
  priority text,
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_brands_user_id on brands(user_id);
create index if not exists idx_content_brand_id on content_items(brand_id);
create index if not exists idx_content_status on content_items(status);
create index if not exists idx_events_run_id on workflow_events(run_id);

-- RLS (sample baseline)
alter table brands enable row level security;
alter table brand_brain enable row level security;
alter table brand_references enable row level security;
alter table content_items enable row level security;

create policy "users_own_brands" on brands for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "users_access_brand_refs" on brand_references for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "users_access_content" on content_items for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

## Component List

### Layout + Navigation
- `AppShell`
- `SidebarNav`
- `TopBar`
- `BrandSwitcher`

### Brand Brain
- `BrandForm`
- `BrandBrainForm`
- `InternalLinksTable`
- `ReferenceUploadPanel`
- `ReferenceListTable`

### Content Workspace
- `ContentItemForm`
- `ContentTable`
- `GenerationActions`
- `AssetTabs` (Brief, Outline, Draft, Meta, QA, Final)
- `EditorMarkdownPane`

### Workflow + Status
- `GenerationProgressModal`
- `WorkflowTimeline`
- `RunStatusBadge`

### QA + Publish
- `QAScoreCard`
- `QAIssuesList`
- `PublishReadyCompareView`

### Export
- `ExportPdfButton`
- `ExportStatusBadge`

## Step-by-step Build Plan

### Step 1: Foundation (Day 1-2)
- Create Next.js app with App Router and Netlify plugin.
- Configure Supabase project and env vars.
- Add auth (Supabase email magic link).

### Step 2: Data Layer (Day 2-3)
- Apply SQL migration.
- Generate TypeScript DB types.
- Implement `lib/supabase/server.ts` and `client.ts`.

### Step 3: Brand Management (Day 3-4)
- Build brands list/create/edit pages.
- Build Brand Brain settings form.
- Add internal links CRUD.

### Step 4: Reference Uploads (Day 4-5)
- Add signed upload endpoint.
- Build upload UI with file metadata registration.
- List/filter references by tag/type.

### Step 5: Content Pipeline CRUD (Day 5-6)
- Create content item form + list tables.
- Add statuses and filtered pages (Briefs/Drafts/QA/etc).

### Step 6: Workflow Engine + Progress (Day 6-7)
- Build `workflow_runs` + `workflow_events` service.
- Add progress modal and polling.

### Step 7: AI Generation Endpoints (Day 7-9)
- Add Anthropic client + prompt templates.
- Implement `/api/generate/*` routes.
- Store outputs in `content_assets` and `content_versions`.

### Step 8: QA + Publish-ready (Day 9-10)
- Implement QA scoring endpoint and UI.
- Implement publish-ready rewrite endpoint.

### Step 9: PDF Export (Day 10-11)
- Add export route, generate PDF, store file.
- Add export status indicators and download action.

### Step 10: Finalize Dashboard + QA (Day 11-14)
- Add overview KPIs, queue pages, refresh queue placeholder.
- End-to-end tests for create→generate→QA→final→PDF.
- Deploy to Netlify and validate environment variables.

## Starter code scaffold recommendations

### 1) Anthropic Client Utility
```ts
// lib/anthropic/client.ts
import Anthropic from '@anthropic-ai/sdk';

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function runClaudeJson<T>(system: string, prompt: string): Promise<T> {
  const res = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 4000,
    system,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = res.content
    .filter((c: any) => c.type === 'text')
    .map((c: any) => c.text)
    .join('\n');

  return JSON.parse(text) as T;
}
```

### 2) Workflow Event Helper
```ts
// lib/workflow/events.ts
import { createServerClient } from '@/lib/supabase/server';

export async function pushWorkflowEvent(input: {
  runId: string;
  stageKey: string;
  stageLabel: string;
  state: 'pending' | 'running' | 'complete' | 'failed';
  detail?: string;
}) {
  const supabase = await createServerClient();
  await supabase.from('workflow_events').insert({
    run_id: input.runId,
    stage_key: input.stageKey,
    stage_label: input.stageLabel,
    state: input.state,
    detail: input.detail ?? null,
  });
}
```

### 3) Package Generation Orchestrator (skeleton)
```ts
// lib/workflow/orchestrator.ts
export async function runGenerationPackage(contentItemId: string) {
  // 1) create workflow_run
  // 2) emit stage events
  // 3) call generate brief/outline/draft/meta/qa/publish-ready services
  // 4) persist outputs
  // 5) mark workflow_run complete
}
```

### 4) Signed Upload Endpoint
```ts
// app/api/uploads/sign/route.ts
import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  const { brandId, fileName } = await req.json();
  const supabase = await createServerClient();

  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const path = `${userId}/${brandId}/${Date.now()}-${fileName}`;
  const { data, error } = await supabase.storage
    .from('brand-references')
    .createSignedUploadUrl(path);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ path, token: data.token });
}
```

### 5) Generation Progress Modal Props
```ts
// components/workflow/GenerationProgressModal.tsx
export type WorkflowStage = {
  key: string;
  label: string;
  state: 'pending' | 'running' | 'complete' | 'failed';
  detail?: string;
};

export function GenerationProgressModal({
  open,
  stages,
}: {
  open: boolean;
  stages: WorkflowStage[];
}) {
  // render timeline and current stage
  return null;
}
```

---

## MVP feature checklist
- [ ] Supabase Auth with protected dashboard
- [ ] Multi-brand CRUD
- [ ] Brand Brain settings (tone/rules/offers/competitors/internal links)
- [ ] Brand reference upload + storage + listing
- [ ] Content item CRUD with full SEO metadata fields
- [ ] Generation package endpoint (brief → outline → draft → meta → QA → final)
- [ ] Progress modal with run stages and live updates
- [ ] QA scorecard UI and revision actions
- [ ] Publish-ready final version storage
- [ ] PDF export generation + download
- [ ] Queue pages: briefs/drafts/qa/published/refresh

## Final folder tree
```txt
app/
  (auth)/login/page.tsx
  dashboard/page.tsx
  dashboard/brands/page.tsx
  dashboard/brands/[brandId]/brain/page.tsx
  dashboard/brands/[brandId]/references/page.tsx
  dashboard/content/[contentId]/page.tsx
  api/...
components/
  brands/
  content/
  workflow/
  qa/
  export/
lib/
  supabase/
  anthropic/
  workflow/
  uploads/
  pdf/
supabase/migrations/001_initial_schema.sql
types/database.ts
docs/ai-seo-content-system-blueprint.md
```

## Final Supabase table list
- `profiles`
- `brands`
- `brand_brain`
- `brand_internal_links`
- `brand_references`
- `content_items`
- `content_versions`
- `content_assets`
- `workflow_runs`
- `workflow_events`
- `qa_reports`
- `refresh_recommendations`

## Final API route list
- `POST /api/brands`
- `GET /api/brands`
- `PATCH /api/brands/:id`
- `GET /api/brands/:id/brain`
- `PUT /api/brands/:id/brain`
- `POST /api/content-items`
- `GET /api/content-items`
- `GET /api/content-items/:id`
- `PATCH /api/content-items/:id`
- `POST /api/generate/package`
- `POST /api/generate/brief`
- `POST /api/generate/outline`
- `POST /api/generate/draft`
- `POST /api/generate/meta`
- `POST /api/generate/qa`
- `POST /api/generate/publish-ready`
- `POST /api/generate/refresh-recommendation`
- `POST /api/uploads/sign`
- `POST /api/references`
- `GET /api/references`
- `GET /api/workflow-runs/:id`
- `GET /api/workflow-runs/:id/events`
- `POST /api/export/pdf`
- `GET /api/export/pdf/:contentId`

## Final prompt flow
1. Build context bundle (brand brain + SEO brain + top references)
2. Generate brief JSON
3. Generate outline JSON
4. Generate draft markdown
5. Generate metadata package JSON
6. Run QA scorecard JSON
7. Generate publish-ready revision markdown
8. Optional refresh recommendations JSON
9. Persist artifacts + versions + qa report + workflow events

## First 14-day build plan
- **Day 1:** Repo setup, Next.js + Netlify + Supabase auth.
- **Day 2:** SQL migration + RLS + DB types.
- **Day 3:** Brands list/create/edit + brand switcher.
- **Day 4:** Brand Brain form + internal links.
- **Day 5:** Reference upload + listing + tagging.
- **Day 6:** Content item CRUD + status views.
- **Day 7:** Workflow run/event tables + polling UI.
- **Day 8:** Anthropic client + brief/outline endpoints.
- **Day 9:** Draft/meta endpoints + assets persistence.
- **Day 10:** QA endpoint + scorecard UI.
- **Day 11:** Publish-ready endpoint + version compare view.
- **Day 12:** PDF export endpoint + storage + download UI.
- **Day 13:** Overview metrics + queue polish + error handling.
- **Day 14:** E2E smoke tests + Netlify deployment + bug fixes.
