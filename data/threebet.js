// 3-Bet Decisions drill — scenario-based quiz data.
// Each scenario: hero faces an open (or a 4-bet) and must pick the best line:
// 'threebet' | 'call' | 'fold' | 'allin'.
// Notation: hand = { r1, r2, suited } with r1 the higher rank (see data/ranges.js).
// Effective stacks in big blinds. Written for an experienced online player:
// explanations assume you know blockers, SPR, and range-vs-range thinking.

export const THREE_BET_SCENARIOS = [
  // ---- Value 3-bets -------------------------------------------------------
  {
    id: 'v1',
    situation: '100bb effective. CO opens to 2.5bb. You are on the BTN.',
    hand: { r1: 'Q', r2: 'Q', suited: false },
    answer: 'threebet',
    explanation: 'QQ on the button vs a CO open is a pure value 3-bet. Flatting lets the blinds in cheap and puts you in gross spots on A/K-high flops. 3-bet to ~3.5x, build the pot while you are way ahead of their continuing range.',
  },
  {
    id: 'v2',
    situation: '100bb effective. BTN opens to 2.5bb. You are in the SB.',
    hand: { r1: 'A', r2: 'K', suited: true },
    answer: 'threebet',
    explanation: 'AKs out of position is a mandatory 3-bet. You deny equity to hands like KQ/QJ that would happily see a flop, you build a pot with the best drawing hand in poker, and you take the betting lead OOP where you need it most.',
  },
  {
    id: 'v3',
    situation: '100bb effective. UTG opens to 3bb. You are in the BB.',
    hand: { r1: 'K', r2: 'K', suited: false },
    answer: 'threebet',
    explanation: 'KK vs even a tight UTG open is a value 3-bet all day. You are ahead of their entire continuing range (QQ, JJ, AK, sometimes TT/AQs). Slowplaying invites multiway disaster; 3-bet and get value from the hands that will stack off anyway.',
  },
  {
    id: 'v4',
    situation: '100bb effective. MP opens to 3bb. You are in the CO.',
    hand: { r1: 'Q', r2: 'Q', suited: false },
    answer: 'threebet',
    explanation: 'Same logic as vs the CO, tighter opener. QQ crushes an MP opening range, and 3-betting folds out the equity of hands like AT/KJ that would otherwise realize for free. Do not get fancy and flat — charge them.',
  },
  {
    id: 'v5',
    situation: '100bb effective. SB opens to 3bb. You are in the BB.',
    hand: { r1: 'A', r2: 'A', suited: false },
    answer: 'threebet',
    explanation: 'AA vs a wide SB opening range is the easiest 3-bet of your life. The small blind opens ~40%+ of hands here; 3-bet for value and let them hang themselves with dominated aces and kings. Trapping just bleeds value.',
  },
  {
    id: 'v6',
    situation: '100bb effective. BTN opens to 2.5bb. You are in the BB.',
    hand: { r1: 'A', r2: 'K', suited: false },
    answer: 'threebet',
    explanation: 'AKo in the BB vs a wide button open: 3-bet for value and initiative. The button opens so wide that AK is miles ahead of their range, and 3-betting punishes their steal attempts while keeping you in charge of the pot OOP.',
  },

  // ---- 3-bet bluffs (blockers + suitedness) --------------------------------
  {
    id: 'b1',
    situation: '100bb effective. CO opens to 2.5bb. You are on the BTN.',
    hand: { r1: 'A', r2: '5', suited: true },
    answer: 'threebet',
    explanation: 'A5s is the textbook 3-bet bluff: the ace blocks AA/AK (their strongest continuing hands), it is suited so it flops well when called, and it has a wheel draw for backup. This is exactly the hand class your 3-bet bluff range is built from.',
  },
  {
    id: 'b2',
    situation: '100bb effective. BTN opens to 2.5bb. You are in the SB.',
    hand: { r1: 'A', r2: '4', suited: true },
    answer: 'threebet',
    explanation: 'A4s in the SB vs a button steal is a standard 3-bet bluff. The ace blocker cuts their 4-bet value combos, and 3-betting avoids playing a weak ace out of position in a bloated multiway pot. Folding surrenders too much; calling is the worst option OOP.',
  },
  {
    id: 'b3',
    situation: '100bb effective. MP opens to 3bb. You are on the BTN.',
    hand: { r1: 'K', r2: 'J', suited: true },
    answer: 'threebet',
    explanation: 'KJs on the button vs MP is a great 3-bet semi-bluff. The K blocks KK/AK, it is suited with strong board coverage, and in position you can barrel scare cards profitably. Flatting is fine too, but 3-betting balances your value range here.',
  },
  {
    id: 'b4',
    situation: '100bb effective. MP opens to 3bb. You are on the BTN.',
    hand: { r1: 'A', r2: '3', suited: true },
    answer: 'threebet',
    explanation: 'A3s works for the same reason as A5s: ace blocker plus suited wheel potential. Against an MP open your bluff needs a little more respect than vs the CO, but in position with a blocker this remains a profitable 3-bet.',
  },
  {
    id: 'b5',
    situation: '100bb effective. BTN opens to 2.5bb. You are in the SB.',
    hand: { r1: 'K', r2: 'T', suited: true },
    answer: 'threebet',
    explanation: 'KTs in the SB vs the button: blocker to KK/AK/TT, suited, and 3-betting solves your positional problem before the flop. This hand is too strong to fold vs a steal and too awkward to flat OOP — 3-bet it.',
  },
  {
    id: 'b6',
    situation: '100bb effective. CO opens to 2.5bb. You are in the SB.',
    hand: { r1: 'A', r2: '2', suited: true },
    answer: 'threebet',
    explanation: 'A2s is the bottom of the suited-ace bluff class, and it still qualifies: ace blocker, nut-flush potential, wheel draw. Out of position against a late open, the 3-bet bluff is far better than calling and bleeding chips postflop.',
  },

  // ---- Flat calls (pot control, implied odds, position) ---------------------
  {
    id: 'c1',
    situation: '100bb effective. UTG opens to 3bb. You are on the BTN.',
    hand: { r1: 'J', r2: 'J', suited: false },
    answer: 'call',
    explanation: 'JJ on the button vs UTG is a flat, not a 3-bet. A UTG 4-bet range crushes you, and 3-betting folds out everything you beat while keeping QQ+/AK. Call in position, keep their dominated pairs and broadways in, and re-evaluate on safe flops.',
  },
  {
    id: 'c2',
    situation: '100bb effective. BTN opens to 2.5bb. You are in the BB.',
    hand: { r1: 'T', r2: 'T', suited: false },
    answer: 'call',
    explanation: 'TT in the BB vs a button open is a mandatory defend-call. You are getting a discount to close the action, you flop a set ~12% of the time, and TT is usually the best hand vs their wide range. 3-betting turns a profitable flat into a bloated guessing game.',
  },
  {
    id: 'c3',
    situation: '100bb effective. UTG opens to 3bb. You are on the BTN.',
    hand: { r1: 'A', r2: 'Q', suited: true },
    answer: 'call',
    explanation: 'AQs vs UTG on the button is a disciplined flat. Their 3-bet-calling range (QQ+, AK) dominates you, so 3-betting mostly isolates you against better. In position with a premium drawing hand, call and outplay them postflop.',
  },
  {
    id: 'c4',
    situation: '120bb effective. CO opens to 2.5bb. You are on the BTN.',
    hand: { r1: '9', r2: '8', suited: true },
    answer: 'call',
    explanation: '98s deep in position is a dream flat: huge implied odds when you smash a flop, and 120bb stacks make the speculative call profitable. 3-betting a suited connector this deep wastes its postflop playability — see flops in position.',
  },
  {
    id: 'c5',
    situation: '100bb effective. UTG opens to 3bb. You are in MP.',
    hand: { r1: 'K', r2: 'Q', suited: true },
    answer: 'call',
    explanation: 'KQs vs UTG is strong enough to continue but 3-betting is a mistake: you fold out KJ/QJ (hands you dominate) and get action from AK/AA/KK (hands that dominate you). Flat, keep the pot small, and use your position.',
  },
  {
    id: 'c6',
    situation: '100bb effective. SB opens to 3bb. You are in the BB.',
    hand: { r1: '2', r2: '2', suited: false },
    answer: 'call',
    explanation: '22 in the BB vs a small blind open: you are getting 3.5-to-1 to close the action with a hand that flops a set and stacks people. Set-mining math works here. Folding is burning money; 3-betting a deuce is nonsense.',
  },

  // ---- Folds vs aggression ---------------------------------------------------
  {
    id: 'f1',
    situation: '100bb effective. UTG opens to 3bb. You are in MP.',
    hand: { r1: 'A', r2: 'J', suited: false },
    answer: 'fold',
    explanation: 'AJo vs UTG in MP is a fold, full stop. You are dominated by AQ/AK far too often, and the players behind you can still wake up with a hand. Pretty-looking trouble hand — let it go and wait for a better spot.',
  },
  {
    id: 'f2',
    situation: '100bb effective. UTG opens to 3bb. You are on the BTN.',
    hand: { r1: 'K', r2: 'Q', suited: false },
    answer: 'fold',
    explanation: 'KQo looks playable on the button, but not vs UTG. Their range is pairs and big aces — you are either flipping or dominated, with reverse implied odds when a K or Q flops. Position does not fix a range disadvantage this severe.',
  },
  {
    id: 'f3',
    situation: '100bb effective. UTG opens to 3bb. You are in MP.',
    hand: { r1: '7', r2: '7', suited: false },
    answer: 'fold',
    explanation: '77 vs UTG at 100bb is a fold. Set-mining needs deep stacks AND a loose opener; here you are neither deep enough (you need ~15-20x the call behind) nor facing a wide range. Do not pay 3bb to lose a small pot or stack off to an overpair.',
  },
  {
    id: 'f4',
    situation: '100bb effective. UTG+1 opens to 3bb. You are in the CO.',
    hand: { r1: 'A', r2: 'T', suited: false },
    answer: 'fold',
    explanation: 'ATo vs an early-position open is kicker trouble. When an ace flops you lose a big pot to AK/AQ; when it does not you are check-folding. The suited version is a borderline defend — offsuit, it is a clean fold.',
  },
  {
    id: 'f5',
    situation: '100bb effective. UTG opens to 3bb. You are in the SB.',
    hand: { r1: 'J', r2: 'T', suited: true },
    answer: 'fold',
    explanation: 'JTs is a fine hand in position, but in the SB vs UTG it is a fold. You are out of position against the strongest range at the table with players still to act behind you. Save your suited broadways for late-position battles.',
  },
  {
    id: 'f6',
    situation: '60bb effective. UTG opens to 3bb. You are on the BTN.',
    hand: { r1: '4', r2: '4', suited: false },
    answer: 'fold',
    explanation: '44 on the button is usually a set-mine — but not at 60bb vs UTG. The implied odds are not there: stacks are too shallow to get paid when you hit, and UTG\'s tight range means you hit into overpairs that felt you. Fold and move on.',
  },
  {
    id: 'f7',
    situation: '30bb effective (tournament). UTG opens to 2.5bb. You are in MP.',
    hand: { r1: 'A', r2: 'Q', suited: true },
    answer: 'fold',
    explanation: 'This one hurts, but 30bb AQs vs UTG is a fold. You cannot flat (terrible SPR, no maneuverability), 3-bet jamming has no fold equity vs their range, and 3-bet/folding wastes a third of your stack. ICM pressure makes tight the right play here.',
  },

  // ---- 4-bet / 5-bet shove spots ---------------------------------------------
  {
    id: 's1',
    situation: '100bb effective. You 3-bet AKo on the BTN vs a CO open. SB cold 4-bets to 22bb.',
    hand: { r1: 'A', r2: 'K', suited: false },
    answer: 'allin',
    explanation: 'AKo facing a 4-bet at 100bb is a 5-bet shove. You are flipping against QQ+ and crushing their 4-bet bluffs (A5s etc.), and folding surrenders massive equity with the best non-pair hand in poker. At 100bb you never fold AK pre.',
  },
  {
    id: 's2',
    situation: '100bb effective. You 3-bet QQ in the SB vs a BTN open. BTN 4-bets to 22bb.',
    hand: { r1: 'Q', r2: 'Q', suited: false },
    answer: 'allin',
    explanation: 'QQ vs a button 4-bet at 100bb is a shove. The button 4-bets wide enough (AK, JJ, bluffs) that folding is a huge mistake — you are ahead of their range overall. Flatting the 4-bet OOP is the worst option; get it in.',
  },
  {
    id: 's3',
    situation: '25bb effective (tournament). CO opens to 2.2bb. You are on the BTN.',
    hand: { r1: 'A', r2: 'K', suited: true },
    answer: 'allin',
    explanation: '25bb AKs on the button is a rejam, not a 3-bet. The shove maximizes fold equity, denies them a cheap flop, and when called you usually have two live overcards or are dominating. 3-betting small leaves you pot-committed anyway — just jam.',
  },
  {
    id: 's4',
    situation: '18bb effective (tournament). BTN opens to 2bb. You are in the SB.',
    hand: { r1: 'T', r2: 'T', suited: false },
    answer: 'allin',
    explanation: '18bb TT in the SB vs a button steal is a standard resteal jam. Too strong to fold, too awkward to flat OOP with a sprung-trap SPR, and the button opens wide enough that you get folds plus great equity when called. This is a printing spot.',
  },
  {
    id: 's5',
    situation: '20bb effective (tournament). CO opens to 2.2bb. You are on the BTN.',
    hand: { r1: 'A', r2: '5', suited: true },
    answer: 'allin',
    explanation: '20bb A5s on the button is a rejam bluff. The ace blocker means they hold Ax less often when they call, the suitedness gives you live equity, and you fold out all their steal garbage plus medium pairs that would outflop you. Folding wastes a perfect jam stack.',
  },
  {
    id: 's6',
    situation: '100bb effective. You 3-bet KK on the BTN vs a CO open. CO 4-bets to 22bb.',
    hand: { r1: 'K', r2: 'K', suited: false },
    answer: 'allin',
    explanation: 'You never fold KK preflop at 100bb. Ever. Against a 4-bet range of QQ+/AK you are a huge favorite, and even against the nittiest AA-only range you still have ~18% equity with dead money in the pot. Shove and do not think twice.',
  },
  {
    id: 's7',
    situation: '100bb effective. You 3-bet JJ in the BB vs a UTG open. UTG (a known nit) 4-bets to 24bb.',
    hand: { r1: 'J', r2: 'J', suited: false },
    answer: 'fold',
    explanation: 'The disciplined fold. A nit 4-betting UTG vs your BB 3-bet has QQ+/AK almost always — JJ has ~36% equity and you are OOP in a bloated pot. This is the rare preflop fold that separates winners from action players. Let it go.',
  },
];

export const THREE_BET_LABELS = {
  threebet: '3-BET',
  call: 'CALL',
  fold: 'FOLD',
  allin: 'ALL-IN',
};

export function randomThreeBetScenario() {
  return THREE_BET_SCENARIOS[Math.floor(Math.random() * THREE_BET_SCENARIOS.length)];
}

// Shuffle a copy of the scenario list (Fisher-Yates) so a round has no repeats.
export function shuffledThreeBetScenarios() {
  const arr = THREE_BET_SCENARIOS.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
  }
  return arr;
}
