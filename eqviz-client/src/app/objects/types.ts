export type Visualizer = 'none' | 'spack' | 'ampl-time' | 'freq-time' | 'ampl-freq';
export type Settings = { [key in Visualizer]?: number };
export type AudioSource = 'mike' | 'recordings';