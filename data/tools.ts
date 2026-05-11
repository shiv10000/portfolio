export type CreativeTool = {
  name: string;
  category: string;
  accent?: string;
};

export const creativeTools: CreativeTool[] = [
  {name: 'Premiere Pro', category: 'Editing', accent: '#66e8ff'},
  {name: 'After Effects', category: 'Motion', accent: '#d7ff65'},
  {name: 'Photoshop', category: 'Visuals', accent: '#ff7a90'},
  {name: 'DaVinci Resolve', category: 'Color', accent: '#f7f7f2'},
  {name: 'CapCut', category: 'Short-form', accent: '#66e8ff'},
  {name: 'ChatGPT', category: 'Ideation', accent: '#d7ff65'},
  {name: 'Runway', category: 'AI video', accent: '#ff7a90'},
  {name: 'Adobe Firefly', category: 'Concepting', accent: '#f7f7f2'},
  {name: 'Photoshop Generative AI', category: 'Visual support', accent: '#66e8ff'},
];
