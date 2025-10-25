import { randomBytes } from 'node:crypto';
import { createServer, IncomingMessage, ServerResponse } from 'node:http';

let secretNumber: number | null = null;
const wins = new Map<string, number>();

enum GameResult {
  More = 'more',
  Less = 'less',
  Win = 'win'
}

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function ensureSecret() {
  if (secretNumber === null) {
    secretNumber = getRandomNumber(1, 100);
    console.log('[GAME] Secret number:', secretNumber);
  }
}

function parseCookies(req: IncomingMessage) {
  const header = req.headers.cookie;
  if (!header) return {};

  return Object.fromEntries(
    header.split(';').map(p => p.trim().split('='))
  );
}

function getOrSetupPlayerId(req: IncomingMessage, res: ServerResponse): string {
  const cookies = parseCookies(req);
  if (cookies.playerId) return cookies.playerId;

  const id = randomBytes(6).toString('hex');
  res.setHeader('Set-Cookie', `playerId=${id}; HttpOnly; Path=/; SameSite=Lax`);
  return id;
}

function sendResponse(res: ServerResponse, data: any) {
  const json = JSON.stringify(data, null, 2);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(json);
}

const server = createServer((req, res) => {
  const url = new URL(req.url!, `http://${req.headers.host}`);
  
  // Check if path is /guess
  if (url.pathname !== '/guess') {
    sendResponse(res, { error: 'Use /guess?num=<number> (1-100)' });
    return;
  }

  // Get num parameter from query string
  const numParam = url.searchParams.get('num');
  if (!numParam) {
    sendResponse(res, { error: 'Missing num parameter. Use /guess?num=<number> (1-100)' });
    return;
  }

  const guess = Number(numParam);
  
  // Validate the number
  if (isNaN(guess) || guess < 1 || guess > 100 || !Number.isInteger(guess)) {
    sendResponse(res, { error: 'Number must be an integer between 1-100' });
    return;
  }

  const playerId = getOrSetupPlayerId(req, res);

  let result: GameResult;
  if (guess === secretNumber) result = GameResult.Win;
  else if (guess < secretNumber!) result = GameResult.More;
  else result = GameResult.Less;

  if (result === GameResult.Win) {
    const playerWins = wins.get(playerId) || 0;
    wins.set(playerId, playerWins + 1);

    const old = secretNumber!;
    secretNumber = getRandomNumber(1, 100);
    console.log(`[WIN] ${playerId} guessed ${old}. New number: ${secretNumber}`);
    sendResponse(res, { result, secretNumber: old, wins: playerWins + 1, message: 'You guessed it!' });
  } else {
    sendResponse(res, { result, yourGuess: guess, wins: wins.get(playerId) || 0 });
  }
});

ensureSecret();
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running: http://localhost:${PORT}/guess?num=<number>`));
