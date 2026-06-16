export type ToolCategory = 'all' | 'media' | 'calculations' | 'utility' | 'developer';

export interface Tool {
  id: string;
  title: string;
  description: string;
  category: ToolCategory;
  icon: string; // lucide icon name
  popularity?: number; // for sorting/trending
}
