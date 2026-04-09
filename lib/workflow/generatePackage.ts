import type { Brand, ContentItem, GeneratedPackage } from '@/types/system';

function cleanPhraseList(value: string): string[] {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function generatePackage(brand: Brand, content: ContentItem): GeneratedPackage {
  const preferred = cleanPhraseList(brand.preferredPhrases);
  const banned = cleanPhraseList(brand.bannedPhrases);
  const secondary = cleanPhraseList(content.secondaryKeywords);

  const brief = `Write a ${content.contentType} for ${brand.audience} in the ${brand.niche} niche.\nPrimary keyword: ${content.targetKeyword}.\nSearch intent: ${content.searchIntent}. Funnel stage: ${content.funnelStage}.\nTone: ${brand.tone}. CTA style: ${brand.ctaStyle}.`;

  const outline = [
    `Introduction: Why ${content.targetKeyword} matters now`,
    `Core strategies for ${content.targetKeyword}`,
    `Common mistakes and how to avoid them`,
    `Action plan using ${brand.offers || 'your offer stack'}`,
    'Conclusion + next step CTA'
  ];

  const draft = `# ${content.title || content.targetKeyword}\n\n${brand.audience} need practical guidance on ${content.targetKeyword}. This ${content.contentType} focuses on clear actions and measurable outcomes.\n\n## Why this matters\n${content.targetKeyword} influences discovery, conversion, and long-term growth.\n\n## Key strategies\n1. Build topical authority with cluster-driven content.\n2. Match intent before optimizing structure.\n3. Create reusable assets for newsletter and blog distribution.\n\n## Brand-specific angle\nPositioning: ${brand.seoNotes || 'No additional SEO notes provided.'}\n\n## CTA\n${brand.ctaStyle || 'Invite the reader to book a strategy call.'}`;

  const metaTitle = `${content.targetKeyword} Guide for ${brand.name} (${new Date().getFullYear()})`;
  const metaDescription = `Learn how ${brand.name} approaches ${content.targetKeyword} with a ${brand.tone} style, practical steps, and a publish-ready framework.`;

  const faq = [
    `What is the best way to start with ${content.targetKeyword}?`,
    `How long does it take to see results from ${content.targetKeyword}?`,
    `How can ${brand.name} help with ${content.targetKeyword}?`
  ];

  const ctaSuggestions = [
    `Book a strategy session with ${brand.name}`,
    `Download the ${content.targetKeyword} checklist`,
    `Request a tailored ${content.contentType} plan`
  ];

  const internalLinkSuggestions = [
    '/services/content-strategy',
    '/case-studies',
    '/contact'
  ];

  const qaNotes: string[] = [];
  let score = 88;

  if (!brand.tone) {
    score -= 8;
    qaNotes.push('Tone of voice is missing from Brand Brain settings.');
  }
  if (preferred.length === 0) {
    score -= 4;
    qaNotes.push('No preferred phrases provided; brand flavor can be improved.');
  }
  if (banned.length === 0) {
    score -= 2;
    qaNotes.push('No banned phrases defined; add style guardrails.');
  }
  if (secondary.length === 0) {
    score -= 4;
    qaNotes.push('Add secondary keywords for stronger topical depth.');
  }

  const publishReady = `${draft}\n\n---\n\n## Editor QA Summary\nScore: ${score}/100\n${qaNotes.length ? qaNotes.map((n) => `- ${n}`).join('\n') : '- Passed QA with no critical issues.'}`;

  return {
    brief,
    outline,
    draft,
    metaTitle,
    metaDescription,
    faq,
    ctaSuggestions,
    internalLinkSuggestions,
    qa: {
      score,
      notes: qaNotes.length ? qaNotes : ['Strong alignment with brand and SEO intent.']
    },
    publishReady
  };
}
