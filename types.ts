
export enum AppView {
  CALCULATORS = 'CALCULATORS',
  AI_MENTOR = 'AI_MENTOR',
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}
