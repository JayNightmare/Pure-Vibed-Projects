export type Mood = "FOCUSED" | "CHILL" | "BURNT" | "HYPED";

export interface Session {
  id: string;
  activity: string;
  mood: Mood;
  soundtrack: string;
  startedAt: string;  // ISO string
  endedAt: string;    // ISO string
  durationMs: number;
}
