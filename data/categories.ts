export type VideoCategory = {
  name: string;
  description: string;
  thumbnail: string;
  folder: string;
};

export const categories: VideoCategory[] = [
  {
    name: 'Tech',
    description:
      'Clean, sharp, informative edits for product demos, tutorials, reviews, and educational content.',
    thumbnail: '/images/work/ai-tool-reel.svg',
    folder: 'Tech',
  },
  {
    name: 'Cinematic',
    description:
      'Moody pacing, color, sound, and dramatic cuts for edits that feel filmic and premium.',
    thumbnail: '/images/work/brand-launch.svg',
    folder: 'Cinematic',
  },
  {
    name: 'AI Videos',
    description:
      'Concept-driven edits using AI visuals, references, generation support, and human creative control.',
    thumbnail: '/images/work/ai-tool-reel.svg',
    folder: 'AI Videos',
  },
  {
    name: 'Event',
    description:
      'Event highlights, recaps, and announcement edits with strong pacing and polished delivery.',
    thumbnail: '/images/work/brand-launch.svg',
    folder: 'Event',
  },
  {
    name: 'Advertisement',
    description:
      'Sharp promotional edits for offers, campaigns, launches, and paid social placements.',
    thumbnail: '/images/work/youtube-explainer.svg',
    folder: 'Advertisement',
  },
];
