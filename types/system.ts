export type Brand = {
  id: string;
  name: string;
  niche: string;
  audience: string;
  tone: string;
  offers: string;
  ctaStyle: string;
  bannedPhrases: string;
  preferredPhrases: string;
  seoNotes: string;
  createdAt: string;
};

export type ContentItem = {
  id: string;
  brandId: string;
  title: string;
  targetKeyword: string;
  secondaryKeywords: string;
  contentType: 'article' | 'blog' | 'newsletter';
  searchIntent: string;
  funnelStage: string;
  status: 'idea' | 'brief' | 'outline' | 'draft' | 'qa' | 'publish-ready';
  qaScore?: number;
  finalUrl?: string;
  updatedAt: string;
};

export type GeneratedPackage = {
  brief: string;
  outline: string[];
  draft: string;
  metaTitle: string;
  metaDescription: string;
  faq: string[];
  ctaSuggestions: string[];
  internalLinkSuggestions: string[];
  qa: {
    score: number;
    notes: string[];
  };
  publishReady: string;
};
