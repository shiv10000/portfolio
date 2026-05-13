export type PortfolioFilter =
  | 'All'
  | 'Tech'
  | 'Cinematic'
  | 'AI Videos'
  | 'Brand Videos'
  | 'Advertisement';

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
  'Tech',
  'Cinematic',
  'AI Videos',
  'Brand Videos',
  'Advertisement',
];

export const portfolioItems: PortfolioItem[] = [
  {
    title: 'AI Tool Reel',
    category: 'Tech',
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
    category: 'Advertisement',
    filterCategory: 'Advertisement',
    thumbnail: '/images/work/creator-shorts.svg',
    videoUrl: '#contact',
    description:
      'Short-form edits shaped for quick scroll-stops, punchy captions, and social-first rhythm.',
    tools: ['Premiere Pro', 'CapCut', 'Photoshop'],
  },
  {
    title: 'Entertainment Edit',
    category: 'Cinematic',
    filterCategory: 'Cinematic',
    thumbnail: '/images/work/entertainment-edit.svg',
    videoUrl: '#contact',
    description:
      'Energetic pacing, reaction timing, sound hits, and meme-style visual layers for a sharper watch.',
    tools: ['Premiere Pro', 'After Effects'],
  },
  {
    title: 'Motion Title Sequence',
    category: 'AI Videos',
    filterCategory: 'AI Videos',
    thumbnail: '/images/work/motion-title.svg',
    videoUrl: '#contact',
    description:
      'Animated typography and transitions designed to give a launch video a premium opening.',
    tools: ['After Effects', 'Premiere Pro'],
    result: 'Made the intro feel more branded and memorable.',
  },
  {
    title: 'Brand Launch Cut',
    category: 'Brand Videos',
    filterCategory: 'Brand Videos',
    thumbnail: '/images/work/brand-launch.svg',
    videoUrl: '#contact',
    description:
      'Clean brand edit with product-focused pacing, music timing, and high-quality final polish.',
    tools: ['Premiere Pro', 'DaVinci Resolve', 'Photoshop'],
  },
  {
    title: 'YouTube Explainer Edit',
    category: 'Tech',
    filterCategory: 'Tech',
    thumbnail: '/images/work/youtube-explainer.svg',
    videoUrl: '#contact',
    description:
      'Structured long-form edit with retention cuts, visual examples, captions, and sound cleanup.',
    tools: ['Premiere Pro', 'After Effects', 'ChatGPT'],
  },
];
