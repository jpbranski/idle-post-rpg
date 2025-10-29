import type { Upgrade, Achievement, ShopItem } from '../types/game';

// === CLICK VALUES ===
export const REPLY_BASE = 1;
export const REPLY_PER_LEVEL = 1; // each level adds +1 to click

// === PASSIVE VALUES (per second) ===
export const COMMENT_BASE = 3;
export const POST_BASE = 15;
export const SHITPOST_BASE = 75;
export const REPOST_BASE = 300;
export const VIRAL_POST_BASE = 1500;

// === UPGRADE DEFINITIONS ===
export const UPGRADES: Upgrade[] = [
  {
    key: 'reply',
    label: 'Better Replies',
    description: 'Increase karma per click',
    baseCost: 10,
    costMultiplier: 1.5,
    maxLevel: 10,
    effect: '+1 karma per click',
  },
  {
    key: 'pc',
    label: 'Gaming PC',
    description: 'Boost all karma generation',
    baseCost: 100,
    costMultiplier: 2,
    maxLevel: 5,
    effect: '+20% global karma per level',
  },
  {
    key: 'chair',
    label: 'Gaming Chair',
    description: 'Increase award drop chance',
    baseCost: 500,
    costMultiplier: 2.5,
    maxLevel: 5,
    effect: '+0.5% award chance per level',
  },
];

export const PASSIVE_UPGRADES: Upgrade[] = [
  {
    key: 'comment',
    label: 'Comments',
    description: 'Passive karma generation',
    baseCost: 50,
    costMultiplier: 1.15,
    effect: '+3 karma/sec per level',
  },
  {
    key: 'post',
    label: 'Posts',
    description: 'Better passive karma generation',
    baseCost: 500,
    costMultiplier: 1.15,
    effect: '+15 karma/sec per level',
  },
  {
    key: 'shitpost',
    label: 'Shitposts',
    description: 'Great passive karma generation',
    baseCost: 5000,
    costMultiplier: 1.15,
    effect: '+75 karma/sec per level',
  },
  {
    key: 'repost',
    label: 'Reposts',
    description: 'Excellent passive karma generation',
    baseCost: 50000,
    costMultiplier: 1.15,
    effect: '+300 karma/sec per level',
  },
  {
    key: 'viralpost',
    label: 'Viral Posts',
    description: 'Maximum passive karma generation',
    baseCost: 500000,
    costMultiplier: 1.15,
    effect: '+1500 karma/sec per level',
  },
];

export const INFINITE_UPGRADES: Upgrade[] = [
  {
    key: 'popular',
    label: 'Popular',
    description: 'Moderate global boost',
    baseCost: 10000,
    costMultiplier: 1.4,
    effect: '+5% global karma per level',
  },
  {
    key: 'influencer',
    label: 'Influencer',
    description: 'Expensive global boost',
    baseCost: 100000,
    costMultiplier: 1.6,
    effect: '+10% global karma per level',
  },
];

// === AWARD CHANCE ===
export const BASE_AWARD_CHANCE = 0.004; // 0.4% base (1 in 250)
export const CHAIR_BONUS_PER_LEVEL = 0.005; // +0.5% per chair level

// === SHOP ITEMS ===
export const SHOP_ITEMS: ShopItem[] = [
  // Themes
  {
    id: 'dark',
    name: 'Dark Mode',
    description: 'Modern dark Reddit theme',
    cost: 0,
    type: 'theme',
    value: 'dark',
  }, // FREE
  {
    id: 'oldschool',
    name: 'Old School',
    description: 'Classic Reddit look',
    cost: 1,
    type: 'theme',
    value: 'oldschool',
  }, // MOVED TO 1
  {
    id: 'terminal',
    name: 'Terminal',
    description: 'Hacker aesthetic',
    cost: 5,
    type: 'theme',
    value: 'terminal',
  },
  {
    id: 'win98',
    name: 'Windows 98',
    description: 'Nostalgic vibes',
    cost: 10,
    type: 'theme',
    value: 'win98',
  },
  {
    id: 'cherry',
    name: 'Cherry Blossom',
    description: 'Serene pink theme',
    cost: 10,
    type: 'theme',
    value: 'cherry',
  },
  {
    id: 'gold',
    name: 'Gold',
    description: 'Luxurious golden theme',
    cost: 100,
    type: 'theme',
    value: 'gold',
  },

  // Autoclickers
  {
    id: 'auto_slow',
    name: 'Slow Autoclicker',
    description: '1 click/sec for 60s',
    cost: 3,
    type: 'autoclicker',
    value: 'slow',
    duration: 60,
    clicksPerSecond: 1,
  },
  {
    id: 'auto_medium',
    name: 'Medium Autoclicker',
    description: '3 clicks/sec for 45s',
    cost: 8,
    type: 'autoclicker',
    value: 'medium',
    duration: 45,
    clicksPerSecond: 3,
  },
  {
    id: 'auto_fast',
    name: 'Fast Autoclicker',
    description: '10 clicks/sec for 30s',
    cost: 20,
    type: 'autoclicker',
    value: 'fast',
    duration: 30,
    clicksPerSecond: 10,
  },

  // Prestige
  {
    id: 'prestige',
    name: 'Prestige',
    description: 'Reset for permanent +10% boost',
    cost: 50,
    type: 'prestige',
  },
];

// === ACHIEVEMENTS ===
export const ACHIEVEMENTS: Achievement[] = [
  // Click milestones
  {
    id: 'click_100',
    name: 'Getting Started',
    description: 'Click 100 times',
    condition: (s) => s.stats.totalClicks >= 100,
  },
  {
    id: 'click_1000',
    name: 'Dedicated',
    description: 'Click 1,000 times',
    condition: (s) => s.stats.totalClicks >= 1000,
  },
  {
    id: 'click_10000',
    name: 'Obsessed',
    description: 'Click 10,000 times',
    condition: (s) => s.stats.totalClicks >= 10000,
  },

  // Score milestones
  {
    id: 'score_1k',
    name: 'First Thousand',
    description: 'Earn 1,000 total karma',
    condition: (s) => s.score >= 1000,
  },
  {
    id: 'score_10k',
    name: 'Ten Grand',
    description: 'Earn 10,000 total karma',
    condition: (s) => s.score >= 10000,
  },
  {
    id: 'score_100k',
    name: 'Six Figures',
    description: 'Earn 100,000 total karma',
    condition: (s) => s.score >= 100000,
  },
  {
    id: 'score_1m',
    name: 'Millionaire',
    description: 'Earn 1,000,000 total karma',
    condition: (s) => s.score >= 1000000,
  },

  // Karma at once
  {
    id: 'karma_1k',
    name: 'Loaded',
    description: 'Have 1,000 karma at once',
    condition: (s) => s.karma >= 1000,
  },
  {
    id: 'karma_10k',
    name: 'Wealthy',
    description: 'Have 10,000 karma at once',
    condition: (s) => s.karma >= 10000,
  },
  {
    id: 'karma_100k',
    name: 'Rich',
    description: 'Have 100,000 karma at once',
    condition: (s) => s.karma >= 100000,
  },

  // Upgrade milestones
  {
    id: 'max_reply',
    name: 'Reply Expert',
    description: 'Max out Reply upgrades',
    condition: (s) => s.upgrades.reply >= 10,
  },
  {
    id: 'max_pc',
    name: 'Tech God',
    description: 'Max out Gaming PC',
    condition: (s) => s.upgrades.pc >= 5,
  },
  {
    id: 'max_chair',
    name: 'Comfortable',
    description: 'Max out Gaming Chair',
    condition: (s) => s.upgrades.chair >= 5,
  },
  {
    id: 'comment_10',
    name: 'Commenter',
    description: 'Buy 10 Comment upgrades',
    condition: (s) => s.passives.comment >= 10,
  },
  {
    id: 'post_10',
    name: 'Poster',
    description: 'Buy 10 Post upgrades',
    condition: (s) => s.passives.post >= 10,
  },
  {
    id: 'shitpost_10',
    name: 'Shitposter',
    description: 'Buy 10 Shitpost upgrades',
    condition: (s) => s.passives.shitpost >= 10,
  },
  {
    id: 'repost_10',
    name: 'Reposter',
    description: 'Buy 10 Repost upgrades',
    condition: (s) => s.passives.repost >= 10,
  },
  {
    id: 'viral_10',
    name: 'Viral Creator',
    description: 'Buy 10 Viral Post upgrades',
    condition: (s) => s.passives.viralpost >= 10,
  },

  // Award milestones
  {
    id: 'award_10',
    name: 'Awarded',
    description: 'Earn 10 awards',
    condition: (s) => s.stats.totalKarmaEarned >= 10,
  },
  {
    id: 'award_50',
    name: 'Award Collector',
    description: 'Earn 50 awards',
    condition: (s) => s.stats.totalKarmaEarned >= 50,
  },

  // Prestige
  {
    id: 'prestige_1',
    name: 'Second Wind',
    description: 'Prestige once',
    condition: (s) => s.prestige.level >= 1,
  },
  {
    id: 'prestige_5',
    name: 'Veteran',
    description: 'Prestige 5 times',
    condition: (s) => s.prestige.level >= 5,
  },
  {
    id: 'prestige_10',
    name: 'Legend',
    description: 'Prestige 10 times',
    condition: (s) => s.prestige.level >= 10,
  },

  // Hidden achievements
  {
    id: 'banned',
    name: 'Troublemaker',
    description: 'Get banned by a random event',
    condition: () => false,
    hidden: true,
  },
  {
    id: 'spam',
    name: 'Spam Filter Victim',
    description: 'Get flagged for spam',
    condition: () => false,
    hidden: true,
  },
];

// === RANDOM EVENTS ===
export const EVENT_INTERVAL_MIN = 10 * 60 * 1000; // 10 minutes
export const EVENT_INTERVAL_MAX = 15 * 60 * 1000; // 15 minutes

export interface RandomEvent {
  id: string;
  name: string;
  description: string;
  weight: number; // probability weight
  duration: number; // seconds
  effect: 'spam' | 'ban' | 'trending';
  multiplier?: number;
}

export const RANDOM_EVENTS: RandomEvent[] = [
  {
    id: 'spam_comment',
    name: 'Flagged for Spam',
    description: 'Comments disabled temporarily',
    weight: 3,
    duration: 45,
    effect: 'spam',
  },
  {
    id: 'spam_post',
    name: 'Flagged for Spam',
    description: 'Posts disabled temporarily',
    weight: 2,
    duration: 60,
    effect: 'spam',
  },
  {
    id: 'banned',
    name: 'Temporarily Banned',
    description: 'All bonuses disabled',
    weight: 1,
    duration: 30,
    effect: 'ban',
    multiplier: 0.5,
  },
  {
    id: 'trending',
    name: 'Trending!',
    description: 'All karma doubled',
    weight: 2,
    duration: 20,
    effect: 'trending',
    multiplier: 2,
  },
  {
    id: 'pandas_bad',
    name: '🐼 Keyboard Pandas!',
    description: 'Pandas are messing with your keyboard!',
    weight: 1,
    duration: 30,
    effect: 'trending',
    multiplier: 0.9,
  },
  {
    id: 'pandas_good',
    name: '🐼 Helper Pandas!',
    description: 'Pandas are boosting your karma!',
    weight: 1,
    duration: 25,
    effect: 'trending',
    multiplier: 1.5,
  },
];

// === OFFLINE PROGRESS ===
export const MAX_OFFLINE_HOURS = 24;

// === PRESTIGE ===
export const PRESTIGE_BONUS_PER_LEVEL = 0.1; // 10% per prestige
