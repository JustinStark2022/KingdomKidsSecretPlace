import { Request, Response } from "express";

export const getScreenTimeData = async (_req: Request, res: Response) => {
  res.json({
    usedTimeMinutes: 45,
    allowedTimeMinutes: 120,
    additionalRewardMinutes: 15,
    dailyLimits: {
      total: 120,
      gaming: 60,
      social: 30,
      educational: 30
    },
    usageToday: {
      total: 45,
      gaming: 20,
      social: 15,
      educational: 10
    },
    timeRewards: {
      fromScripture: 10,
      fromLessons: 5,
      fromChores: 0
    },
    schedule: [],
    blockedApps: []
  });
};

