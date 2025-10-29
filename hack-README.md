# ⚡ Horcrux Hunt - Reddit Devvit Game ⚡

🎥 **[Watch Demo Video](https://youtu.be/dDiBU7yZmeA)**

## 1. Introduction

**Horcrux Hunt** is an interactive puzzle game built on Reddit's Devvit platform, inspired by the dark magic of the Harry Potter universe. Players take on the role of wizards who must hide their soul fragments in magical symbols and seek out others' Horcruxes to destroy them.

The game combines emoji-based puzzle creation with word-guessing mechanics, creating a unique social gaming experience where players alternate between being puzzle creators (hiding souls) and puzzle solvers (destroying Horcruxes). Built with React, TypeScript, and Devvit's web framework, it runs entirely within Reddit posts, making it accessible to millions of Reddit users.

### Key Features:

- 🌑 **Hide Soul Fragments**: Create puzzles by selecting magical emoji symbols that spell out secret words
- ⚡ **Destroy Horcruxes**: Solve other players' puzzles by placing emojis and revealing hidden letters
- 👑 **Wizard Rankings**: Compete on the leaderboard to become the most powerful wizard
- 🎮 **Alternating Gameplay**: Players must alternate between hiding and seeking to maintain balance
- 📱 **Mobile-First Design**: Fully responsive interface optimized for both desktop and mobile devices

---

## 2. What This Game Does

### Core Gameplay Loop

#### Phase 1: Soul Concealment (Puzzle Creation)

1. **Select Magical Symbols**: Choose 5-15 emojis from a collection of 124+ Harry Potter-themed symbols
2. **Choose Word Length**: Pick a word length (5-9 letters)
3. **Generate Puzzle**: The system finds a valid word that can be spelled using letters from your selected emojis
4. **Publish to Reddit**: Your puzzle is posted as a Reddit post for others to solve

#### Phase 2: Horcrux Destruction (Puzzle Solving)

1. **View the Challenge**: See the available emoji symbols and empty letter slots
2. **Place Emojis**: Drag and drop emojis onto the "Soul Chamber" canvas
3. **Reveal Letters**: When emojis overlap correctly, letters from the secret word are revealed
4. **Guess the Word**: Once all letters are revealed, type the word to destroy the Horcrux
5. **Limited Attempts**: You have 5 attempts to guess correctly, with a 5-minute cooldown on failed attempts

### Social Features

- **First Solver Recognition**: The first player to destroy a Horcrux gets a special comment announcement
- **Leaderboard System**: Track your progress with:
  - Total Horcruxes destroyed
  - Total souls hidden
  - Wizard rank among all players
- **Alternating Mechanics**: Players must alternate between hiding and seeking, creating a balanced ecosystem
- **Ownership Protection**: You cannot solve your own puzzles or re-solve already completed ones

### Technical Implementation

- **Client-Side**: React + TypeScript with custom emoji placement and overlap detection
- **Server-Side**: Express API with Redis for data persistence
- **Reddit Integration**: Devvit SDK for post creation, comments, and user authentication
- **Real-Time Updates**: Automatic leaderboard updates and player progress tracking

---

## 3. Achievements Made

### 🎨 User Interface & Experience

- ✅ **Dark Magic Theme**: Cohesive Harry Potter-inspired design with purple/gold gradients and magical effects
- ✅ **Responsive Design**: Fully mobile-optimized layouts for all screens (375px to 1000px+)
- ✅ **Smooth Animations**: Magical entrance effects, glowing borders, and particle animations
- ✅ **Custom Fonts**: Ancient and magical typography (Cinzel, custom magical fonts)
- ✅ **Intuitive Controls**: Drag-and-drop emoji placement with visual feedback

### 🎮 Game Mechanics

- ✅ **Emoji-Word Matching Algorithm**: Intelligent system that finds valid words from emoji letter combinations
- ✅ **Overlap Detection**: Precise collision detection for emoji placement and letter revelation
- ✅ **Minimal Combination Logic**: Calculates the minimum number of emojis needed to spell each word
- ✅ **Alternating Gameplay**: Enforced turn-based mechanics to balance creation and solving
- ✅ **Cooldown System**: 5-minute penalty for failed attempts to prevent spam

### 🏆 Social & Competitive Features

- ✅ **First Solver Comments**: Automatic Reddit comment when someone is first to solve a puzzle
- ✅ **Leaderboard Table**: Clean, sortable rankings with rank icons (🥇🥈🥉)
- ✅ **Player Statistics**: Track individual progress (puzzles created, solved, rank)
- ✅ **Ownership Validation**: Prevent self-solving and duplicate solving

### 💾 Data & Performance

- ✅ **Redis Integration**: Efficient data storage for puzzles, scores, and player progress
- ✅ **Optimized Queries**: Fast leaderboard retrieval and puzzle validation
- ✅ **Error Handling**: Graceful fallbacks for network issues and edge cases
- ✅ **Loading States**: User-friendly loaders during async operations

---

## 4. Struggles & Challenges

### 🎨 UI/UX Maintenance

Keeping the interface consistent across different game states while maintaining mobile responsiveness was challenging. Managing 100+ emoji options with drag-and-drop on small screens required multiple iterations to get right.

### 🎮 Game Balance

Being new to game development, finding the right difficulty balance took time. The alternating hide/seek mechanic was added mid-way to prevent players from only solving puzzles.

### 🧮 Minimal Combination Algorithm

The trickiest part was building an algorithm that finds valid words from selected emojis and calculates the minimum emojis needed. Initial version took 2-3 seconds, but optimizing with hash maps brought it down to under 100ms. Sometimes "good enough" beats "perfect."

---

## 5. Future Plans

### Content Expansion

- Add 50+ new Harry Potter emojis (Patronuses, spells, locations)
- Expand word dictionary to 50,000+ words including HP terms
- Introduce difficulty tiers with point multipliers

### Enhanced Progression

- Wizard Houses assignment based on play style
- Achievement badges and special titles
- Spell collection system for power-ups (hints, extra attempts)

### Algorithm Improvements

- Better puzzle difficulty prediction
- Dynamic difficulty adjustment per player
- Multi-word puzzle support
- Hint system for struggling players

### Community Features

- Custom emoji sets and word lists per subreddit
- Weekly tournaments with prizes
- Team-based collaborative puzzles
- Cross-subreddit puzzle sharing

---

_"After all this time? Always."_ ⚡
