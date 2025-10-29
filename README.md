## Horcrux Hunt

A dark wizard-themed word puzzle game built on Reddit's Devvit platform where players alternate between hiding their souls in emoji puzzles and seeking to destroy others' Horcruxes. This immersive Harry Potter-inspired game combines strategic emoji selection, spatial puzzle-solving, and word deduction into a unique three-layer challenge.

### What is Horcrux Hunt?

Horcrux Hunt is an innovative social puzzle game inspired by Harry Potter's dark magic. Players create emoji-based word puzzles (hiding their soul) and solve puzzles created by others (destroying Horcruxes). The game enforces an alternating gameplay mechanic where you must balance creation and solving to progress.

Each puzzle is a multi-layered logic challenge: a secret Harry Potter-themed word is hidden behind a palette of magical emojis. Players must discover which minimal combination of emojis contains all the letters needed to spell the hidden word. The twist? For multi-emoji puzzles, you must drag and overlap the correct emojis on a Soul Chamber canvas to reveal the letters.

### What Makes This Game Unique?

- **Alternating Gameplay**: New players must destroy their first Horcrux before they can hide their soul. Experienced players must alternate between hiding and seeking, creating a balanced social ecosystem that prevents spam and encourages community engagement
- **Three-Layer Puzzle System**: First, find the minimal emoji combination (Soul Chamber turns golden when correct). Second, reveal letters by overlapping emojis. Third, deduce the hidden Harry Potter word from the revealed letters
- **Minimal Combination Challenge**: The Soul Chamber border turns golden with a magical glow when you've found the exact minimal set of emojis - not all combinations work, adding a strategic layer to the puzzle
- **Overlap Mechanics**: For multi-emoji puzzles, letters only reveal when the correct emojis overlap on the canvas. Single-emoji puzzles reveal letters immediately when the correct emoji is placed
- **Reddit Integration**: Puzzles are published as Reddit posts, creating a persistent community-driven puzzle feed where anyone can play and compete
- **Leaderboard System**: Track your progress with Horcruxes destroyed and souls hidden, and compete with other wizards in your subreddit
- **Dark Wizard Theme**: Immersive Harry Potter-inspired aesthetics with ancient fonts (Cinzel), magical animations, and golden Horcrux glows
- **60+ Magical Emojis**: Choose from wands, lockets, diadems, creatures, potions, and more to craft your puzzles
- **One-Time Solving**: Each puzzle can only be solved once per player, and you cannot solve your own puzzles, ensuring fair competition
- **Dynamic Status Updates**: Real-time feedback in the subtitle shows your current progress - whether you need to find the minimal combination, overlap symbols, or speak the final word
- **Back Button on Confirmation**: If you don't like the generated word, you can go back and select different emojis or change the word length
- **Intelligent Word Generation**: The game automatically finds valid Harry Potter-themed words from your emoji selection using a curated list of 100+ magical terms

### Technology Stack

- [Devvit](https://developers.reddit.com/): Reddit's developer platform for building immersive games
- [Vite](https://vite.dev/): For compiling the client and server bundles
- [React](https://react.dev/): For UI components and state management
- [Express](https://expressjs.com/): For backend API endpoints
- [TypeScript](https://www.typescriptlang.org/): For type safety across client, server, and shared code
- [Redis](https://redis.io/): For data persistence (via Devvit's built-in Redis integration)
- **Custom Drag-and-Drop System**: Built-in emoji dragging and positioning system for the Soul Chamber canvas

## How to Play

### For New Players (First Time)

When you first open Horcrux Hunt, you'll see the main menu with three options. As a new player, you must destroy your first Horcrux before you can hide your own soul.

1. **Click "🔍 DESTROY HORCRUX ⚡"**: This opens the Horcrux Destroyer screen where you'll solve an existing puzzle

2. **Understand the Puzzle Interface**: You'll see:

   - **⚡ HORCRUX DESTROYER ⚡** title at the top
   - A dynamic subtitle that updates based on your progress:
     - Initially: "🔮 Find the minimal combination of X magical symbol(s)."
     - After finding the combination: "✨ Soul combination found! Place the symbol to reveal runes." (for single-emoji) or "✨ Soul combination found! Overlap symbols to reveal more runes." (for multi-emoji)
     - When all letters are revealed: "⚡ All soul runes revealed! Speak the word to destroy the Horcrux!"
   - **🔮 REVEALED SOUL RUNES 🔮** section showing discovered letters in individual golden boxes
   - **🌑 SOUL CHAMBER** (the main play area on the left where you place emojis)
   - **🔮 MAGICAL SYMBOLS** list on the right with available emojis to drag
   - **⚡ Attempts** counter showing remaining guesses (starts at 5)
   - **🌀 Clear** button to remove all emojis from the chamber at once

3. **Find the Minimal Combination** (Layer 1):

   - Drag emojis from the Magical Symbols list onto the Soul Chamber
   - The Soul Chamber border turns **golden** (with a glowing effect) when you've placed the correct minimal combination
   - **For single-emoji puzzles**: Only 1 emoji can be placed - find the right one
   - **For multi-emoji puzzles**: Multiple emojis can be placed - find the exact set needed
   - Not all combinations work - you must find the specific minimal set
   - Use the "🌀 Clear" button to remove all emojis from the chamber at once

4. **Reveal the Letters** (Layer 2):

   - **Single-emoji puzzles**: Letters appear immediately when you place the correct emoji (only 1 emoji can be placed in the chamber)
   - **Multi-emoji puzzles**: Letters only appear when you **overlap** the correct emojis by dragging them on top of each other in the Soul Chamber
   - As letters reveal, they appear as glowing golden runes in individual boxes in the "Revealed Soul Runes" section at the top
   - All letters of the secret word will be revealed (including duplicates)
   - **Tip**: You can reposition emojis by dragging them within the Soul Chamber, and double-click an emoji to return it to the Magical Symbols list

5. **Guess the Word** (Layer 3):

   - Once all soul runes are revealed, the subtitle updates to "⚡ All soul runes revealed! Speak the word to destroy the Horcrux!"
   - The input field activates with the prompt "⚡ SPEAK THE WORD ⚡"
   - Type your guess (it will auto-capitalize) and click "⚡ CAST SPELL"
   - You have **5 attempts** to guess correctly (shown in the "⚡ Attempts" counter)
   - The word is always a Harry Potter-themed term (from a curated list of 100+ magical words)
   - Incorrect guesses decrease your remaining attempts

6. **Victory**: Successfully destroying a Horcrux shows a magical victory screen with:
   - "⚡ HORCRUX DESTROYED ⚡" title with golden glow effects
   - The revealed word displayed in large ancient font
   - Your updated wizard rank (e.g., "👑 Your Wizard Rank: #3 of 15 wizards")
   - "🌙 RETURN TO CHAMBER" button to go back to the main menu
   - "👑 VIEW WIZARD RANKINGS" button to see the leaderboard
   - Your stats are updated and you unlock the ability to hide your own soul (if it was your first Horcrux)

### Creating Puzzles (Hiding Your Soul)

After destroying your first Horcrux, you can create your own puzzles:

1. **Click "🌑 HIDE SOUL FRAGMENT 🔮"**: Opens the Soul Concealer screen

2. **Select Magical Symbols**:

   - Click 5-15 emojis from the 60+ available magical symbols on the right
   - Selected emojis are highlighted with a golden border and glow effect
   - Each emoji has a name (e.g., "wand", "snake", "fire") that contains letters
   - The counter shows "✨ Selected: X / 15"
   - You must select at least 5 emojis to proceed

3. **Choose Soul Rune Length**:

   - Use the "🔮 Soul Rune Length" dropdown to select 5-9 runes (letters)
   - This determines how long the hidden word will be
   - Longer words are generally more challenging

4. **Click "🌑 CONCEAL SOUL 🌑"**:

   - The system automatically finds a valid Harry Potter-themed word that can be formed from the letters in your selected emoji names
   - The algorithm determines the minimal combination of emojis needed to spell the word
   - You'll see a confirmation screen showing the word that was generated
   - If no valid word can be formed, you'll see an error message: "No valid words can be formed with the selected emojis. Please try a different combination."

5. **Review & Adjust** (Confirmation Screen):
   - Review the generated word on the confirmation screen (remember it!)
   - If you don't like the word, click "🌀 RETURN TO CONCEALMENT" to go back and select different emojis or change the word length
   - If you're happy with the word, click "✨ SEAL THE HORCRUX ✨" to proceed

6. **Publish**:
   - Your puzzle is created as a Reddit post in the subreddit
   - Other players can now find and solve your Horcrux
   - You'll see a success screen: "🌑 SOUL FRAGMENT SEALED 🌑" with the hidden word displayed
   - After 5 seconds, you'll automatically return to the main menu
   - Your "Souls Hidden" stat increases by 1
   - Your last action is updated to "hide"

### Alternating Rules

The game enforces a balanced play style to prevent spam and encourage community engagement:

- **New Players**: Must destroy at least one Horcrux before they can hide their soul

  - The "HIDE SOUL FRAGMENT" button is disabled until you complete your first puzzle
  - Error message: "🔮 New to the Dark Arts? You must first find a Horcrux to learn the forbidden magic before you can hide your own soul!"

- **Experienced Players**: Must alternate between destroying and hiding
  - After hiding your soul → you must destroy a Horcrux next
  - After destroying a Horcrux → you must hide your soul next
- **Enforcement**: Buttons are disabled with themed error messages if you try to break the alternating rule:

  - If you try to hide twice in a row: "⚡ You just hid your soul! Now you must find and destroy a Horcrux before hiding another piece of your soul."
  - If you try to destroy twice in a row: "🌑 You just found a Horcrux! Now you must hide a piece of your soul before seeking another Horcrux."

- **Progress Tracking**: Your stats at the bottom of the main menu show:
  - ⚡ Destroyed: [count] (Horcruxes you've destroyed)
  - 🌑 Hidden: [count] (Souls you've hidden)
  - Last Action: hide/find/None

### Game Mechanics

- **Minimal Combination Detection**: Each puzzle has a specific minimal set of emojis that must be used

  - The Soul Chamber border turns **golden** (with a glowing effect and radial gradient background) when you've found the correct combination
  - You can't just use any emojis - only the minimal set works
  - The subtitle updates to: "✨ Soul combination found! Place the symbol to reveal runes." (for single-emoji) or "✨ Soul combination found! Overlap symbols to reveal more runes." (for multi-emoji)

- **Letter Revelation Logic**:

  - **1-emoji puzzles**: Letters reveal immediately when you place the correct emoji (only 1 emoji can be placed in the chamber)
  - **Multi-emoji puzzles**: Letters reveal only when correct emojis **overlap** on the canvas (emojis must be close enough that their circular boundaries intersect)
  - Letters appear as glowing golden runes in individual boxes at the top with a magical entrance animation
  - All instances of each letter are revealed (including duplicates in the correct order)

- **Dragging & Positioning**:

  - Drag emojis from the Magical Symbols list to the Soul Chamber (HTML5 drag-and-drop)
  - Drag emojis within the Soul Chamber to reposition and overlap them (mouse-based dragging)
  - Double-click an emoji in the Soul Chamber to return it to the Magical Symbols list
  - Click the "🌀 Clear" button to remove all emojis from the chamber at once
  - For single-emoji puzzles, only one emoji can be placed in the chamber at a time

- **Guessing System**:

  - You get **5 attempts** to guess the word correctly (displayed in "⚡ Attempts" counter)
  - Input field only activates once all letters are revealed (subtitle changes to "⚡ All soul runes revealed! Speak the word to destroy the Horcrux!")
  - Guesses are automatically converted to uppercase
  - Incorrect guesses decrease your remaining attempts
  - After 5 failed attempts, the game ends with "💀 DARK MAGIC PREVAILS 💀" screen and reveals the word
  - The attempts counter turns red when you have 2 or fewer attempts remaining

- **Ownership Protection**: You cannot solve your own puzzles

  - Golden message: "🪄 This Soul Fragment is yours! You cannot destroy your own Horcrux. Share it with fellow wizards or create a new one!"

- **One-Time Solving**: Each puzzle can only be solved once per player

  - Golden message: "⚡ You have already destroyed this Horcrux! The dark magic has been vanquished. Seek other Soul Fragments to continue your quest!"

- **Wizard Rankings**: Click "👑 WIZARD RANKINGS" to view:
  - "👑 WIZARD RANKINGS 👑" title with golden gradient effect
  - Member statistics showing "🧙 Total Wizards" and "⚡ Horcrux Destroyers"
  - Your current stats highlighted in purple: "👑 Your Rank: #X" and "⚡ Power: X"
  - Leaderboard showing all players ranked by Horcruxes destroyed (total score)
  - 🥇🥈🥉 medals for top 3 players with golden highlighting and glow effects
  - Each player's username, rank, and total power (Horcruxes destroyed)
  - Hover effects on leaderboard entries for better interactivity
  - "✕ Close" button to return to the main menu

## How the Puzzle Algorithm Works

The game uses a sophisticated algorithm to create challenging three-layer puzzles:

1. **Emoji Selection**: Players choose 5-15 emojis, each with a name (e.g., "wand", "snake", "fire")

2. **Word Generation**: The system searches for Harry Potter-themed words that can be formed using letters from the selected emoji names
   - Filters the word list (100+ Harry Potter terms) by the chosen word length (5-9 letters)
   - Checks if each word can be formed from the combined letters of all selected emoji names
   - Randomly selects one valid word from the filtered list

3. **Minimal Combination Calculation**: The algorithm determines the smallest subset of emojis needed to spell the word
   - Uses a combination generator to test all possible subsets starting from size 1
   - Finds the minimum size `k` where at least one combination can form the word
   - Returns up to 3 different minimal combinations of that size
   - Example: If the word is "WAND" and you selected emojis with names "wand", "snake", "fire", only "wand" is needed (minimal count = 1)
   - Example: If the word is "FIRE" and you selected "wand", "ice", "forest", "eagle", you might need ["fire"] or ["ice", "forest", "eagle"] depending on letter availability

4. **Three-Layer Puzzle Solving**: Players must:
   - **Layer 1 - Combination Discovery**: Discover which emojis form the minimal combination (Soul Chamber turns golden when correct)
   - **Layer 2 - Letter Revelation**: For single-emoji puzzles, place the correct emoji to reveal all letters. For multi-emoji puzzles, overlap the correct emojis to reveal letters (overlap detection uses circular boundary intersection)
   - **Layer 3 - Word Deduction**: Guess the hidden Harry Potter word from the revealed letters within 5 attempts

This creates a multi-layered puzzle: first find the right emoji combination, then reveal the letters through overlap, then deduce the word!

## Game Features

- **Dynamic Puzzle Generation**: Automatically generates valid word puzzles from emoji combinations using a sophisticated algorithm that finds minimal emoji sets
- **Interactive Soul Chamber**: Intuitive drag-and-drop canvas for emoji placement with overlap detection using circular boundary intersection
- **Real-time Validation**: Instant feedback on emoji combinations and letter reveals with visual effects (golden glow, magical entrance animations)
- **Persistent Leaderboard**: Redis-backed scoring system tracking all players across the subreddit with rank calculations
- **Alternating Gameplay Enforcement**: Server-side validation ensures players alternate between creating and solving puzzles
- **One-Time Solving**: Each puzzle can only be solved once per player, tracked via Redis
- **Ownership Protection**: Players cannot solve their own puzzles
- **Mobile-Friendly**: Responsive design optimized for Reddit's mobile experience with touch-friendly controls
- **Dark Wizard Aesthetics**: Custom Harry Potter-inspired theme with ancient fonts (Cinzel, Uncial Antiqua), magical animations, and golden Horcrux glows
- **100+ Harry Potter Words**: Curated word list spanning magical objects, spells, creatures, and locations (5-9 letters)
- **60+ Magical Emojis**: Themed emoji palette including wands, Horcruxes, creatures, potions, and mystical symbols
- **Custom Drag System**: Built-in mouse-based dragging for repositioning emojis within the Soul Chamber
- **Visual Feedback System**: Dynamic subtitle updates, golden chamber borders, glowing runes, and color-coded attempt counters
