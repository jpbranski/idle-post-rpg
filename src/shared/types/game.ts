// src/shared/types/game.ts

export interface GameState {
  // Core resources
  karma: number;
  score: number; // lifetime karma
  awards: number;

  // Upgrades (finite)
  upgrades: {
    reply: number; // 0-10 (max level for manual click power)
    pc: number; // 0-5 (global % boost)
    chair: number; // 0-5 (award chance boost)
  };

  // Passive generators (infinite)
  passives: {
    comment: number;
    post: number;
    shitpost: number;
    repost: number;
    viralpost: number;
  };

  // Infinite multipliers
  infinite: {
    popular: number; // moderate cost, % boost
    influencer: number; // expensive, % boost
  };

  // Prestige
  prestige: {
    level: number;
    badges: string[]; // badge IDs
  };

  // Unlocks
  unlocks: {
    themes: string[]; // 'dark', 'oldschool', 'terminal', etc.
    autoclickers: string[]; // 'slow', 'medium', 'fast'
  };

  // Active effects
  activeEffects: ActiveEffect[];

  // Achievements
  achievements: string[]; // achievement IDs
  achievementsViewed: boolean;
  lastViewedAchievementCount: number; // How many achievements were viewed last time

  // Stats
  stats: {
    totalClicks: number;
    totalKarmaEarned: number;
    timePlayed: number; // seconds
    lastSave: number; // timestamp
    lastOnline: number; // timestamp
  };

  // Settings
  settings: {
    theme: string;
    anonymous: boolean;
  };
}

export interface ActiveEffect {
  id: string;
  type: 'spam' | 'ban' | 'trending' | 'autoclicker';
  target?: 'comment' | 'post' | 'shitpost'; // Optional - only for spam
  multiplier?: number; // Optional - for trending/ban
  endsAt: number; // timestamp
  clicksPerSecond?: number; // Optional - for autoclicker
}

export interface Upgrade {
  key: string;
  label: string;
  description: string;
  baseCost: number;
  costMultiplier: number;
  maxLevel?: number;
  effect: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  condition: (state: GameState) => boolean;
  hidden?: boolean;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number; // in awards
  type: 'theme' | 'autoclicker' | 'prestige' | 'badge';
  value?: string; // theme name, autoclicker speed, etc.
  duration?: number; // for autoclickers (seconds)
  clicksPerSecond?: number; // for autoclickers
}

export const DEFAULT_STATE: GameState = {
  karma: 0,
  score: 0,
  awards: 0,
  upgrades: {
    reply: 0,
    pc: 0,
    chair: 0,
  },
  passives: {
    comment: 0,
    post: 0,
    shitpost: 0,
    repost: 0,
    viralpost: 0,
  },
  infinite: {
    popular: 0,
    influencer: 0,
  },
  prestige: {
    level: 0,
    badges: [],
  },
  unlocks: {
    themes: ['light', 'dark'],
    autoclickers: [],
  },
  activeEffects: [],
  achievements: [],
  achievementsViewed: false,
  lastViewedAchievementCount: 0,
  stats: {
    totalClicks: 0,
    totalKarmaEarned: 0,
    timePlayed: 0,
    lastSave: Date.now(),
    lastOnline: Date.now(),
  },
  settings: {
    theme: 'light',
    anonymous: false,
  },
};
