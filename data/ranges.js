// Preflop opening ranges — beginner-friendly, centralized here.
// Notation: "AKs" = Ace-King suited, "AQo" = Ace-Queen offsuit,
// "QQ" = pocket Queens, "+" means that hand and everything stronger.
// Pairs: "77+" = 77, 88, 99, TT, JJ, QQ, KK, AA.
// Suited: "AJs+" = AJs, AQs, AKs. Offsuit: "AQo+" = AQo, AKo.

export const OPEN_RANGES = {
  UTG: ['77+', 'AJs+', 'KQs', 'AQo+'],
  MP: ['66+', 'ATs+', 'KJs+', 'QJs', 'AJo+', 'KQo'],
  CO: ['55+', 'A2s+', 'KTs+', 'QJs', 'JTs', 'ATo+', 'KQo'],
  BTN: ['44+', 'A2s+', 'K9s+', 'Q9s+', 'J9s+', 'T8s+', '98s', '87s', '76s', 'A9o+', 'KTo+', 'QJo'],
  SB: ['44+', 'A2s+', 'K9s+', 'Q9s+', 'J9s+', 'T8s+', '98s', 'A8o+', 'KTo+', 'QJo'],
};

// Facing an UTG open, sitting on the button.
export const VS_UTG = {
  threeBet: ['QQ+', 'AKs', 'AKo', 'A5s', 'A4s'],
  call: ['JJ', 'TT', 'AQs', 'AJs', 'KQs', 'QJs'],
  // Everything else is a fold.
};

export const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
const RANK_VALUE = { A: 14, K: 13, Q: 12, J: 11, T: 10, 9: 9, 8: 8, 7: 7, 6: 6, 5: 5, 4: 4, 3: 3, 2: 2 };

// --- Hand helpers -----------------------------------------------------------

// A "hand" here is { r1, r2, suited } with r1 the higher rank.
// Example: { r1: 'A', r2: 'K', suited: true } = AKs.

export function randomHand() {
  // Deal two distinct cards from a 52-card deck, so pocket pairs show up
  // at their real frequency (~5.9%) instead of never, and suited hands
  // land at ~23.5%. Card id = rankIndex * 4 + suitIndex.
  const c1 = Math.floor(Math.random() * 52);
  let c2 = Math.floor(Math.random() * 51);
  if (c2 >= c1) c2 += 1; // c2 != c1, uniform over remaining 51 cards
  const i1 = Math.floor(c1 / 4), i2 = Math.floor(c2 / 4);
  const hi = Math.min(i1, i2), lo = Math.max(i1, i2); // lower index = higher rank
  return { r1: RANKS[hi], r2: RANKS[lo], suited: (c1 % 4) === (c2 % 4) };
}

// Expand a notation like "AJs+" into a Set of "r1r2s"/"r1r2o" keys.
function expandNotation(note) {
  const out = new Set();
  const plus = note.endsWith('+');
  const base = plus ? note.slice(0, -1) : note;
  if (base.length === 2 && base[0] === base[1]) {
    // Pocket pair, e.g. "77"
    const start = RANKS.indexOf(base[0]);
    const end = plus ? 0 : start; // "+" walks up to AA (index 0)
    for (let i = start; i >= end; i--) out.add(RANKS[i] + RANKS[i]);
    return out;
  }
  const suited = base.endsWith('s');
  const r1 = base[0], r2 = base[1];
  const i1 = RANKS.indexOf(r1), i2 = RANKS.indexOf(r2);
  if (!plus) {
    out.add(r1 + r2 + (suited ? 's' : 'o'));
    return out;
  }
  // "AJs+" -> AJs, AQs, AKs (raise the kicker up to the top below r1)
  for (let k = i2; k > i1; k--) out.add(r1 + RANKS[k] + (suited ? 's' : 'o'));
  return out;
}

function buildRangeSet(list) {
  const set = new Set();
  for (const note of list) for (const h of expandNotation(note)) set.add(h);
  return set;
}

const OPEN_SETS = Object.fromEntries(
  Object.entries(OPEN_RANGES).map(([pos, list]) => [pos, buildRangeSet(list)])
);
const THREE_BET_SET = buildRangeSet(VS_UTG.threeBet);
const CALL_SET = buildRangeSet(VS_UTG.call);

function handKey(hand) {
  return hand.r1 + hand.r2 + (hand.suited ? 's' : 'o');
}

function pairKey(hand) {
  return hand.r1 === hand.r2 ? hand.r1 + hand.r2 : null;
}

// --- Quiz logic -------------------------------------------------------------

export function correctOpenAction(position, hand) {
  const key = pairKey(hand) || handKey(hand);
  return OPEN_SETS[position].has(key) ? 'raise' : 'fold';
}

export function correctVsRaiseAction(hand) {
  const key = pairKey(hand) || handKey(hand);
  if (THREE_BET_SET.has(key)) return 'threebet';
  if (CALL_SET.has(key)) return 'call';
  return 'fold';
}

// --- Balanced dealing --------------------------------------------------------
// The quiz deals from a real 52-card deck, so FOLD is the correct answer
// ~80-95% of the time and the drill is gameable by mashing one button.
// These helpers rig the DEAL, never the answers: the drill picks the lesson
// first (e.g. "this one should be a raise"), then deals a random hand that
// genuinely deserves that action. Every correct answer stays exactly as
// honest as before — you just can't beat the quiz without thinking anymore.
export function randomHandWithOpenAction(position, action) {
  for (let i = 0; i < 500; i++) {
    const h = randomHand();
    if (correctOpenAction(position, h) === action) return h;
  }
  return randomHand(); // unreachable in practice; keeps the type contract
}

export function randomHandWithVsRaiseAction(action) {
  for (let i = 0; i < 500; i++) {
    const h = randomHand();
    if (correctVsRaiseAction(h) === action) return h;
  }
  return randomHand(); // unreachable in practice; keeps the type contract
}

// Pretty display with real suit symbols, e.g. "A♠ K♦".
const SUITS = ['♠', '♥', '♦', '♣'];
const RED = new Set(['♥', '♦']);

export function handDisplay(hand) {
  const s1 = SUITS[Math.floor(Math.random() * 4)];
  let s2;
  if (hand.r1 === hand.r2) {
    do { s2 = SUITS[Math.floor(Math.random() * 4)]; } while (s2 === s1);
  } else if (hand.suited) {
    s2 = s1;
  } else {
    do { s2 = SUITS[Math.floor(Math.random() * 4)]; } while (s2 === s1);
  }
  return [
    { rank: hand.r1, suit: s1, red: RED.has(s1) },
    { rank: hand.r2, suit: s2, red: RED.has(s2) },
  ];
}

export function handName(hand) {
  const sf = hand.r1 === hand.r2 ? '' : hand.suited ? 's' : 'o';
  return hand.r1 + hand.r2 + sf;
}

// Short plain-English explanation for feedback.
export function explainOpen(position, hand, action) {
  const name = handName(hand);
  const range = OPEN_RANGES[position].join(', ');
  if (action === 'raise')
    return `${name} is inside the ${position} opening range (${range}), so raising is correct.`;
  return `${name} is NOT in the ${position} opening range (${range}), so folding is correct.`;
}

export function explainVsRaise(hand, action) {
  const name = handName(hand);
  if (action === 'threebet')
    return `${name} is a value 3-bet (QQ+, AK, A5s, A4s as bluffs) against the UTG open.`;
  if (action === 'call')
    return `${name} is a standard call (JJ, TT, AQs, AJs, KQs, QJs) against the UTG open.`;
  return `${name} is too weak to continue against a tight UTG open — fold.`;
}

// Quick self-test: node data/ranges.js
// NOTE: `process` exists on-device too (React Native polyfill) but WITHOUT
// process.argv, so the guard must check process.versions.node — otherwise
// this line throws at import time on the phone and kills the app.
if (typeof process !== 'undefined' && process.versions && process.versions.node && process.argv[1] && process.argv[1].endsWith('ranges.js')) {
  const assert = (c, msg) => { if (!c) { console.error('FAIL:', msg); process.exitCode = 1; } };
  const H = (r1, r2, suited) => ({ r1, r2, suited });
  assert(correctOpenAction('UTG', H('A', 'K', true)) === 'raise', 'UTG AKs raise');
  assert(correctOpenAction('UTG', H('A', 'K', false)) === 'raise', 'UTG AKo raise');
  assert(correctOpenAction('UTG', H('7', '2', false)) === 'fold', 'UTG 72o fold');
  assert(correctOpenAction('BTN', H('9', '8', true)) === 'raise', 'BTN 98s raise');
  assert(correctOpenAction('BTN', H('A', '9', false)) === 'raise', 'BTN A9o raise');
  assert(correctOpenAction('SB', H('7', '6', true)) === 'fold', 'SB 76s fold');
  assert(correctVsRaiseAction(H('Q', 'Q', false)) === 'threebet', 'QQ 3bet');
  assert(correctVsRaiseAction(H('A', 'K', false)) === 'threebet', 'AKo 3bet');
  assert(correctVsRaiseAction(H('A', '5', true)) === 'threebet', 'A5s 3bet');
  assert(correctVsRaiseAction(H('J', 'J', false)) === 'call', 'JJ call');
  assert(correctVsRaiseAction(H('A', 'Q', true)) === 'call', 'AQs call');
  assert(correctVsRaiseAction(H('9', '9', false)) === 'fold', '99 fold');
  // Pairs must actually be dealt (old code never produced them).
  let pairs = 0, suited = 0;
  const N = 20000;
  for (let n = 0; n < N; n++) {
    const h = randomHand();
    if (h.r1 === h.r2) {
      pairs++;
      assert(!h.suited, 'a pocket pair is never "suited"');
    }
    if (h.suited) suited++;
  }
  assert(pairs > N * 0.03 && pairs < N * 0.10, `pair frequency sane (got ${pairs}/${N})`);
  assert(suited > N * 0.18 && suited < N * 0.29, `suited frequency sane (got ${suited}/${N})`);
  console.log('ranges.js self-test done');
}
