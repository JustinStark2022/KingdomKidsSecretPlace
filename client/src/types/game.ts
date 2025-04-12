export interface GameMonitoring {
  id: number;
  gameName: string;
  screenTime: number; // in minutes
  contentRating?: string;
  approved: boolean | null;
  lastPlayed?: string;
  redFlags: { type: string; description: string }[];
}
