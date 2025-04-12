export interface ChatLog {
    id: number;
    childId: number;
    childName: string;
    platform: string;
    content: string;
    flagged: boolean;
    flagReason?: string;
    timestamp: string;
    participants: string[];
  }