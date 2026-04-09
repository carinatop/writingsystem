'use client';

import { useMemo, useState } from 'react';
import type { Brand, ContentItem, GeneratedPackage } from '@/types/system';

type ProgressState = {
  open: boolean;
  stageIndex: number;
  stages: string[];
  runningContentId?: string;
};

const STAGES = [
  'Generating brief',
  'Building outline',
  'Drafting article',
  'Running QA',
  'Preparing publish-ready version',
  'Exporting PDF-ready assets'
];

function uid(prefix: string) {
  return `${prefix}_${crypto.randomUUID()}`;
}

export default function DashboardPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [packages, setPackages] = useState<Record<string, GeneratedPackage>>({});

  const [brandForm, setBrandForm] = useState({
    name: '',
    niche: '',
    audience: '',
    tone: '',
    offers: '',
    ctaStyle: '',
    bannedPhrases: '',
    preferredPhrases: '',
    seoNotes: ''
  });

  const [contentForm, setContentForm] = useState({
    brandId: '',
    title: '',
    targetKeyword: '',
    secondaryKeywords: '',
    contentType: 'article' as ContentItem['contentType'],
    searchIntent: '',
    funnelStage: ''
  });

  const [progress, setProgress] = useState<ProgressState>({
    open: false,
    stageIndex: 0,
    stages: STAGES
  });
  const [activePackageId, setActivePackageId] = useState<string | null>(null);

  const canCreateContent = brands.length > 0;

  const stats = useMemo(
    () => ({
      brands: brands.length,
      briefs: contentItems.filter((c) => c.status === 'brief').length,
      drafts: contentItems.filter((c) => c.status === 'draft').length,
      qa: contentItems.filter((c) => c.status === 'qa').length,
      final: contentItems.filter((c) => c.status === 'publish-ready').length
    }),
    [brands, contentItems]
  );

  const addBrand = () => {
    if (!brandForm.name.trim()) return;
    const next: Brand = {
      id: uid('brand'),
      ...brandForm,
      createdAt: new Date().toISOString()
    };
    setBrands((prev) => [next, ...prev]);
    setBrandForm({
      name: '',
      niche: '',
      audience: '',
      tone: '',
      offers: '',
      ctaStyle: '',
      bannedPhrases: '',
      preferredPhrases: '',
      seoNotes: ''
    });
    if (!contentForm.brandId) {
      setContentForm((prev) => ({ ...prev, brandId: next.id }));
    }
  };

  const addContent = () => {
    if (!contentForm.brandId || !contentForm.targetKeyword.trim()) return;
    const next: ContentItem = {
      id: uid('content'),
      brandId: contentForm.brandId,
      title: contentForm.title,
      targetKeyword: contentForm.targetKeyword,
      secondaryKeywords: contentForm.secondaryKeywords,
      contentType: contentForm.contentType,
      searchIntent: contentForm.searchIntent,
      funnelStage: contentForm.funnelStage,
      status: 'idea',
      updatedAt: new Date().toISOString()
    };
    setContentItems((prev) => [next, ...prev]);
    setContentForm((prev) => ({ ...prev, title: '', targetKeyword: '', secondaryKeywords: '' }));
  };

  const runGeneration = async (item: ContentItem) => {
    const brand = brands.find((b) => b.id === item.brandId);
    if (!brand) return;

    setProgress({ open: true, stageIndex: 0, stages: STAGES, runningContentId: item.id });

    for (let i = 0; i < STAGES.length - 1; i += 1) {
      await new Promise((r) => setTimeout(r, 450));
      setProgress((prev) => ({ ...prev, stageIndex: i + 1 }));
      setContentItems((prev) =>
        prev.map((c) =>
          c.id === item.id
            ? {
                ...c,
                status:
                  i < 1
                    ? 'brief'
                    : i < 2
                      ? 'outline'
                      : i < 3
                        ? 'draft'
                        : i < 4
                          ? 'qa'
                          : 'publish-ready',
                updatedAt: new Date().toISOString()
              }
            : c
        )
      );
    }

    const response = await fetch('/api/generate/package', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brand, content: item })
    });

    if (!response.ok) {
      setProgress((prev) => ({ ...prev, open: false }));
      alert('Generation failed.');
      return;
    }

    const generated = (await response.json()) as GeneratedPackage;
    setPackages((prev) => ({ ...prev, [item.id]: generated }));
    setActivePackageId(item.id);

    setContentItems((prev) =>
      prev.map((c) =>
        c.id === item.id
          ? {
              ...c,
              status: 'publish-ready',
              qaScore: generated.qa.score,
              updatedAt: new Date().toISOString()
            }
          : c
      )
    );

    setTimeout(() => setProgress((prev) => ({ ...prev, open: false })), 350);
  };

  const exportAsPdf = (itemId: string) => {
    const pkg = packages[itemId];
    if (!pkg) return;

    const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=900,height=700');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
      <head><title>Publish-ready article</title></head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; padding: 24px;">
      <h1>Publish-ready Output</h1>
      <pre style="white-space: pre-wrap;">${pkg.publishReady.replace(/</g, '&lt;')}</pre>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <main className="container">
      <h1>AI SEO Content System</h1>
      <p className="muted">Manage brands, generate content packages, review QA, export PDF-ready output.</p>

      <section className="grid grid-3" style={{ marginTop: 16 }}>
        <article className="card"><div className="muted">Brands</div><div className="kpi">{stats.brands}</div></article>
        <article className="card"><div className="muted">Drafts</div><div className="kpi">{stats.drafts}</div></article>
        <article className="card"><div className="muted">Publish-ready</div><div className="kpi">{stats.final}</div></article>
      </section>

      <section className="card" style={{ marginTop: 16 }}>
        <h2>1) Brand Brain</h2>
        <div className="grid grid-3">
          {Object.entries(brandForm).map(([key, value]) => (
            <label key={key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span className="muted">{key}</span>
              <input
                value={value}
                onChange={(e) => setBrandForm((prev) => ({ ...prev, [key]: e.target.value }))}
                style={{ padding: 10, border: '1px solid #d1d5db', borderRadius: 8 }}
              />
            </label>
          ))}
        </div>
        <button onClick={addBrand} style={{ marginTop: 12, padding: '10px 14px' }}>Save Brand</button>
        {brands.length > 0 && (
          <ul>
            {brands.map((brand) => (
              <li key={brand.id}><strong>{brand.name}</strong> — {brand.niche} — {brand.tone}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="card" style={{ marginTop: 16 }}>
        <h2>2) Content Item</h2>
        {!canCreateContent && <p className="muted">Create at least one brand first.</p>}
        <div className="grid grid-3">
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span className="muted">brand</span>
            <select
              value={contentForm.brandId}
              onChange={(e) => setContentForm((prev) => ({ ...prev, brandId: e.target.value }))}
              style={{ padding: 10, border: '1px solid #d1d5db', borderRadius: 8 }}
            >
              <option value="">Select brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span className="muted">target keyword</span>
            <input
              value={contentForm.targetKeyword}
              onChange={(e) => setContentForm((prev) => ({ ...prev, targetKeyword: e.target.value }))}
              style={{ padding: 10, border: '1px solid #d1d5db', borderRadius: 8 }}
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span className="muted">title</span>
            <input
              value={contentForm.title}
              onChange={(e) => setContentForm((prev) => ({ ...prev, title: e.target.value }))}
              style={{ padding: 10, border: '1px solid #d1d5db', borderRadius: 8 }}
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span className="muted">secondary keywords (comma separated)</span>
            <input
              value={contentForm.secondaryKeywords}
              onChange={(e) => setContentForm((prev) => ({ ...prev, secondaryKeywords: e.target.value }))}
              style={{ padding: 10, border: '1px solid #d1d5db', borderRadius: 8 }}
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span className="muted">search intent</span>
            <input
              value={contentForm.searchIntent}
              onChange={(e) => setContentForm((prev) => ({ ...prev, searchIntent: e.target.value }))}
              style={{ padding: 10, border: '1px solid #d1d5db', borderRadius: 8 }}
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span className="muted">funnel stage</span>
            <input
              value={contentForm.funnelStage}
              onChange={(e) => setContentForm((prev) => ({ ...prev, funnelStage: e.target.value }))}
              style={{ padding: 10, border: '1px solid #d1d5db', borderRadius: 8 }}
            />
          </label>
        </div>
        <button onClick={addContent} style={{ marginTop: 12, padding: '10px 14px' }}>Add Content Item</button>
      </section>

      <section className="card" style={{ marginTop: 16 }}>
        <h2>3) Pipeline</h2>
        {contentItems.length === 0 ? (
          <p className="muted">No content items yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th align="left">Keyword</th>
                <th align="left">Type</th>
                <th align="left">Status</th>
                <th align="left">QA</th>
                <th align="left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contentItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.targetKeyword}</td>
                  <td>{item.contentType}</td>
                  <td>{item.status}</td>
                  <td>{item.qaScore ?? '-'}</td>
                  <td style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => runGeneration(item)}>Generate package</button>
                    <button onClick={() => { setActivePackageId(item.id); }} disabled={!packages[item.id]}>
                      View output
                    </button>
                    <button onClick={() => exportAsPdf(item.id)} disabled={!packages[item.id]}>
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {activePackageId && packages[activePackageId] && (
        <section className="card" style={{ marginTop: 16 }}>
          <h2>4) Generated Output</h2>
          <p><strong>Brief:</strong> {packages[activePackageId].brief}</p>
          <p><strong>Outline:</strong></p>
          <ul>{packages[activePackageId].outline.map((item) => <li key={item}>{item}</li>)}</ul>
          <p><strong>Meta title:</strong> {packages[activePackageId].metaTitle}</p>
          <p><strong>Meta description:</strong> {packages[activePackageId].metaDescription}</p>
          <p><strong>FAQs:</strong></p>
          <ul>{packages[activePackageId].faq.map((item) => <li key={item}>{item}</li>)}</ul>
          <p><strong>CTA suggestions:</strong></p>
          <ul>{packages[activePackageId].ctaSuggestions.map((item) => <li key={item}>{item}</li>)}</ul>
          <p><strong>Internal link suggestions:</strong></p>
          <ul>{packages[activePackageId].internalLinkSuggestions.map((item) => <li key={item}>{item}</li>)}</ul>
          <p><strong>QA score:</strong> {packages[activePackageId].qa.score}/100</p>
          <p><strong>Publish-ready article:</strong></p>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{packages[activePackageId].publishReady}</pre>
        </section>
      )}

      {progress.open && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(17,24,39,0.35)',
            display: 'grid',
            placeItems: 'center'
          }}
        >
          <div className="card" style={{ width: 520 }}>
            <h3>Generation Progress</h3>
            <ul>
              {progress.stages.map((stage, idx) => (
                <li key={stage}>
                  {idx < progress.stageIndex ? '✅' : idx === progress.stageIndex ? '⏳' : '⬜'} {stage}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </main>
  );
}
