
import { GroundingChunk } from "@google/genai";

export enum ChatRole {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system',
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  sources?: GroundingChunk[];
}

export enum ChatMode {
  STANDARD = 'STANDARD',
  THINKING = 'THINKING',
  SEARCH = 'SEARCH',
}
