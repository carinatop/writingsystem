export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      brands: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          niche: string | null;
          target_audience: string | null;
          cta_style: string | null;
          positioning_notes: string | null;
          seo_notes: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      content_items: {
        Row: {
          id: string;
          brand_id: string;
          user_id: string;
          target_keyword: string;
          status: string;
          content_type: 'article' | 'blog' | 'newsletter' | null;
          qa_score: number | null;
          export_status: string;
          pdf_available: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      workflow_events: {
        Row: {
          id: string;
          run_id: string;
          stage_key: string;
          stage_label: string;
          state: 'pending' | 'running' | 'complete' | 'failed';
          detail: string | null;
          created_at: string;
        };
      };
    };
  };
};
