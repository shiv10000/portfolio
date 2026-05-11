export type PortfolioFilter =
  | 'All'
  | 'Reels'
  | 'Tech'
  | 'Entertainment'
  | 'Motion Graphics'
  | 'Brand Videos'
  | 'YouTube';

export type PortfolioItem = {
  title: string;
  category: string;
  filterCategory: Exclude<PortfolioFilter, 'All'>;
  thumbnail: string;
  videoUrl: string;
  description: string;
  tools: string[];
  result?: string;
};

export const portfolioFilters: PortfolioFilter[] = [
  'All',
  'Reels',
  'Tech',
  'Entertainment',
  'Motion Graphics',
  'Brand Videos',
  'YouTube',
];

export const portfolioItems: PortfolioItem[] = [
  {
    title: 'AI Tool Reel',
    category: 'Tech Reel',
    filterCategory: 'Tech',
    thumbnail: '/images/work/ai-tool-reel.svg',
    videoUrl: '#contact',
    description:
      'Fast-paced tech reel with hook-first structure, captions, clean transitions, and motion accents.',
    tools: ['Premiere Pro', 'After Effects', 'ChatGPT'],
    result: 'Built for stronger retention in the first 3 seconds.',
  },
  {
    title: 'Creator Shorts Pack',
    category: 'Reels & Shorts',
    filterCategory: 'Reels',
    thumbnail: '/images/work/creator-shorts.svg',
    videoUrl: '#contact',
    description:
      'Short-form edits shaped for quick scroll-stops, punchy captions, and social-first rhythm.',
    tools: ['Premiere Pro', 'CapCut', 'Photoshop'],
  },
  {
    title: 'Entertainment Edit',
    category: 'Entertainment',
    filterCategory: 'Entertainment',
    thumbnail: '/images/work/entertainment-edit.svg',
    videoUrl: '#contact',
    description:
      'Energetic pacing, reaction timing, sound hits, and meme-style visual layers for a sharper watch.',
    tools: ['Premiere Pro', 'After Effects'],
  },
  {
    title: 'Motion Title Sequence',
    category: 'Motion Graphics',
    filterCategory: 'Motion Graphics',
    thumbnail: '/images/work/motion-title.svg',
    videoUrl: '#contact',
    description:
      'Animated typography and transitions designed to give a launch video a premium opening.',
    tools: ['After Effects', 'Premiere Pro'],
    result: 'Made the intro feel more branded and memorable.',
  },
  {
    title: 'Brand Launch Cut',
    category: 'Brand Video',
    filterCategory: 'Brand Videos',
    thumbnail: '/images/work/brand-launch.svg',
    videoUrl: '#contact',
    description:
      'Clean brand edit with product-focused pacing, music timing, and high-quality final polish.',
    tools: ['Premiere Pro', 'DaVinci Resolve', 'Photoshop'],
  },
  {
    title: 'YouTube Explainer Edit',
    category: 'YouTube',
    filterCategory: 'YouTube',
    thumbnail: '/images/work/youtube-explainer.svg',
    videoUrl: '#contact',
    description:
      'Structured long-form edit with retention cuts, visual examples, captions, and sound cleanup.',
    tools: ['Premiere Pro', 'After Effects', 'ChatGPT'],
  },
];
