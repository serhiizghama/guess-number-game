# 🎯 Guess Number Game

**🌐 Live Demo:** https://guess-number-game-mvxk.onrender.com/guess/50

## 🎮 Game Description

This is a simple yet engaging number guessing game where players try to guess a secret number between 1 and 100. The game provides hints to guide players toward the correct answer:

- **"more"** - Your guess is too low, try a higher number
- **"less"** - Your guess is too high, try a lower number  
- **"win"** - Congratulations! You guessed the correct number

### 🏆 Features

- **Persistent Scoring**: Your wins are tracked using cookies, so your score persists across sessions
- **Auto-Reset**: When you win, a new secret number is automatically generated for the next round
- **Simple API**: Just make a GET request to `/guess/{number}` where number is between 1-100
- **Real-time Feedback**: Get immediate feedback on your guess

### 🎯 How to Play

1. Visit the live demo URL above
2. Try guessing a number by replacing the number in the URL (e.g., `/guess/50`)
3. The server will respond with:
   - Your guess result (`more`, `less`, or `win`)
   - Your current win count
   - If you win, the secret number is revealed and a new one is generated

### 📝 Example API Response

```json
{
  "result": "less",
  "yourGuess": 90,
  "wins": 0
}
```

## 🚀 How to Start the Project Locally

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation & Setup

1. **Clone the repository** (if not already done):
   ```bash
   git clone <your-repo-url>
   cd guess-number-game
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the TypeScript code**:
   ```bash
   npm run build
   ```

4. **Start the server**:
   ```bash
   npm start
   ```

5. **Test the game**:
   Open your browser and visit: `http://localhost:3000/guess/50`
   
   Or use curl:
   ```bash
   curl http://localhost:3000/guess/50
   ```

### Development Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start the production server
- `npm run prebuild` - Install dependencies before building

### Environment Variables

- `PORT` - Server port (defaults to 3000 if not set)

The server will automatically generate a random secret number between 1-100 when it starts, and create a new one each time a player wins.

---

**Happy Guessing! 🎲**