# 🎮 Idle Post RPG

**An addictive incremental clicker game built on Reddit's Devvit platform**

[![Reddit Devvit](https://img.shields.io/badge/Reddit-Devvit-FF4500?logo=reddit)](https://developers.reddit.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](devvit.json)

---

## 🌟 Overview

Idle Post RPG is an engaging incremental game where you farm Reddit karma through active clicking and passive income generation. Start by clicking "Reply" to earn karma, then unlock powerful upgrades, compete on global leaderboards, and prestige for permanent bonuses.

### ✨ Key Features

- **🖱️ Active Clicking**: Click "Reply" to earn karma with upgrades up to 10 levels
- **⚡ Passive Income**: Unlock Comments, Posts, and Shitposts for automatic karma generation
- **🎯 Strategic Upgrades**:
  - Gaming PC (0-5): +20% global karma per level
  - Gaming Chair (0-5): +0.5% award chance per level
  - Popular & Influencer: Infinitely scaling multipliers
- **🏆 Competitive Play**:
  - Global leaderboards showing top 25 players
  - Anonymous mode for privacy
  - Real-time rank tracking
- **⭐ Prestige System**: Reset your progress for permanent +10% bonuses
- **🎨 Unlockable Content**:
  - 7 beautiful themes (Dark Mode, Old School Reddit, Terminal, Cherry Blossom, Windows 98, Gold)
  - 3 tiers of autoclickers
  - 20+ achievements
- **🎲 Random Events**: Spam filters, bans, and trending boosts keep gameplay dynamic
- **💾 Offline Progress**: Earn karma for up to 24 hours while away
- **📱 Mobile Optimized**: Fully responsive design for all devices

---

## 🎯 How to Play

### Getting Started

1. **Click to Earn**: Tap the "Reply" button to manually earn karma
2. **Buy Upgrades**: Spend karma to unlock passive generators and multipliers
3. **Go Idle**: Let your Comments, Posts, and Shitposts generate karma automatically
4. **Collect Awards**: Rare drops from clicking unlock themes and special items
5. **Prestige**: Reset for permanent bonuses when you reach 1M lifetime karma
6. **Compete**: Climb the global leaderboards and prove you're the ultimate karma farmer

### Progression Tips

- **Early Game (0-1000 karma)**: Focus on Reply upgrades and unlock Comments
- **Mid Game (1k-100k karma)**: Balance passive generators with PC/Chair upgrades
- **Late Game (100k+ karma)**: Invest in Popular/Influencer for exponential growth
- **End Game (1M+ karma)**: Prestige for permanent bonuses and compete for #1

---

## 🛠️ Technical Details

### Built With

- **Frontend**: React + TypeScript + Vite
- **Backend**: Reddit Devvit (Redis for state management)
- **Styling**: Tailwind CSS + Custom themes
- **Platform**: Reddit Custom Posts

### Architecture

```
src/
├── client/              # React frontend (game UI)
│   ├── components/      # Game screens and modals
│   ├── hooks/           # Game state management
│   └── styles/          # Theme styling
├── server/              # Devvit backend
│   ├── index.ts         # Devvit configuration
│   └── api.ts           # Redis operations
└── shared/              # Shared types and logic
    ├── types/           # TypeScript interfaces
    ├── constants/       # Game balance and config
    └── helpers/         # Calculation utilities
```

### Game Balance

The game is balanced for **2-3 weeks of casual play** with the following progression curve:

- **Days 1-3**: Unlock basic passives, core upgrades
- **Days 4-10**: Scale passive income, first infinite upgrades
- **Days 11-21**: Prestige unlocks, expensive themes, achievement hunting

---

## 🚀 Installation & Development

### Prerequisites

- Node.js 22+
- Reddit account
- Devvit CLI installed (`npm install -g devvit`)

### Setup

```bash
# Clone the repository
git clone https://github.com/jpbranski/idle-post-rpg.git
cd idle-post-rpg

# Install dependencies
npm install

# Login to Reddit Devvit
devvit login

# Start development server
npm run dev
```

### Available Commands

```bash
npm run dev       # Start development server with live reload
npm run build     # Build for production
npm run check     # Type check, lint, and format
npm run deploy    # Deploy to test subreddit
devvit publish    # Submit for Reddit review
```

---

## 📊 Game Mechanics

### Upgrade Costs

All upgrades use exponential cost scaling:

```
Cost = BaseCost × Multiplier^Level
```

- **Reply**: Base 10, 1.5× multiplier (gentle scaling)
- **Passives**: Base 50-5000, 1.15× multiplier (always buyable)
- **PC/Chair**: Base 100-500, 2-2.5× multiplier (medium scaling)
- **Popular**: Base 10k, 1.4× multiplier (moderate exponential)
- **Influencer**: Base 100k, 1.6× multiplier (steep exponential)

### Award System

Awards are earned **only from clicking**, not passive income:

- Base chance: 0.4% (1 in 250 clicks)
- With max Gaming Chair: 3% (1 in 33 clicks)
- Used to unlock themes, autoclickers, and prestige

### Random Events

Events occur every 10-15 minutes:

| Event          | Effect               | Duration      |
| -------------- | -------------------- | ------------- |
| 🔥 Trending    | 2× karma multiplier  | 20 seconds    |
| 🚫 Banned      | 50% karma penalty    | 30 seconds    |
| ⚠️ Spam Filter | Disables one passive | 45-60 seconds |

### Prestige

- **Requirement**: 1,000,000 lifetime karma
- **Bonus**: +10% permanent karma multiplier per level
- **Keeps**: Unlocked themes, achievements, statistics
- **Resets**: All upgrades, current karma, passive levels

---

## 🎨 Themes

Unlock beautiful themes with awards:

| Theme             | Cost       | Description               |
| ----------------- | ---------- | ------------------------- |
| ☀️ Light          | Free       | Default Reddit light mode |
| 🌙 Dark           | 1 award    | Modern dark Reddit theme  |
| 📰 Old School     | 5 awards   | Classic Reddit aesthetic  |
| 💻 Terminal       | 5 awards   | Hacker green-on-black     |
| 🌸 Cherry Blossom | 10 awards  | Serene pink theme         |
| 🖥️ Windows 98     | 10 awards  | Nostalgic retro theme     |
| ✨ Gold           | 100 awards | Luxurious golden theme    |

---

## 🏆 Achievements

Complete challenges to unlock achievements (cosmetic):

**Click Milestones**

- Getting Started (100 clicks)
- Dedicated (1,000 clicks)
- Obsessed (10,000 clicks)

**Score Milestones**

- First Thousand (1k karma)
- Ten Grand (10k karma)
- Six Figures (100k karma)
- Millionaire (1M karma)

**Upgrade Milestones**

- Reply Expert (max out Reply)
- Tech God (max out PC)
- Comfortable (max out Chair)

**Hidden Achievements**

- Troublemaker (get banned)
- Spam Filter Victim (get flagged)

---

## 🎯 Roadmap

### Version 1.1 (Planned)

- [ ] Daily challenges
- [ ] More themes (community suggestions)
- [ ] Sound effects toggle
- [ ] Particle effects on clicks
- [ ] More random events

### Version 2.0 (Future)

- [ ] Guilds/Teams
- [ ] Seasonal events
- [ ] Weekly competitions
- [ ] Custom subreddit variants
- [ ] Social sharing features

---

## 📝 License

Copyright (c) 2025 jpbranski. All Rights Reserved.

This software is proprietary and confidential. See [LICENSE](LICENSE) for details.

**TL;DR**: View the code for learning, but no commercial use or copying.

---

## 🤝 Contributing

This is a closed-source project, but feedback is welcome!

- 🐛 Report bugs via Reddit comments
- 💡 Suggest features in the community
- ⭐ Share your high scores

---

## 📞 Support

- **Reddit**: u/JP_the_Pirate
- **Documentation**: [Reddit Devvit Docs](https://developers.reddit.com/)

---

## 🙏 Acknowledgments

Built with:

- [Reddit Devvit Platform](https://developers.reddit.com/)
- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- [TypeScript](https://www.typescriptlang.org/)

Special thanks to the Reddit Developer Platform team for building Devvit!

---

<div align="center">

**Made with ❤️ for the Reddit community**

</div>
