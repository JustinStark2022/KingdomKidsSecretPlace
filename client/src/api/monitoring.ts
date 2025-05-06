export interface FlaggedContent {
    id: number;
    name: string;
    platform: string;
    contentType: string;
    flagReason: string;
  }
  
  export async function getFlaggedContent(): Promise<FlaggedContent[]> {
    const res = await fetch("/api/alerts/recent", {
      credentials: "include",
    });
  
    if (!res.ok) {
      throw new Error("Failed to fetch flagged content");
    }
  
    return res.json();
  }