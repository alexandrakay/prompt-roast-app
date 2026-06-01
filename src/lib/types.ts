export interface RoastResult {
  roast: string;
  charges: string[];
  fixed: string;
}

export interface RoastDocument {
  id: string;
  userId: string;
  originalPrompt: string;
  roast: string;
  charges: string[];
  fixed: string;
  createdAt: number;
}
