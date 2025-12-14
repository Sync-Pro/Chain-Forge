export type View = 'home' | 'source' | 'playground' | 'docs';

export interface Message {
  role: 'user' | 'model' | 'system';
  content: string;
  type?: 'text' | 'code' | 'log';
}

export interface SimulationState {
  isThinking: boolean;
  logs: string[];
}
