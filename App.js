import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  randomHand, handDisplay, handName,
  correctOpenAction, correctVsRaiseAction,
  explainOpen, explainVsRaise,
  randomHandWithOpenAction, randomHandWithVsRaiseAction,
} from './data/ranges';
import { shuffledThreeBetScenarios, THREE_BET_LABELS } from './data/threebet';
import Fireworks from './Fireworks';
import { shareAppLink } from './shareLink';

const QUESTIONS_PER_ROUND = 10;
const POSITIONS = ['UTG', 'MP', 'CO', 'BTN', 'SB'];

const GREEN = '#0b3d2e';
const FELT = '#0e5c3f';
const GOLD = '#f5c542';
const CREAM = '#fdf6e3';
const RED = '#d64545';

export default function App() {
  const [screen, setScreen] = useState('home'); // home | quiz | result
  const [mode, setMode] = useState(null);       // 'open' | 'vsraise' | 'threebet'
  const [question, setQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0); // highest streak reached this round
  const [hand, setHand] = useState(null);
  const [cards, setCards] = useState(null);
  const [position, setPosition] = useState(null);
  const [scenario, setScenario] = useState(null); // 3-bet drill scenario
  const [deck, setDeck] = useState([]);           // shuffled 3-bet scenarios for this round
  const [feedback, setFeedback] = useState(null); // { correct, explanation }
  const [best, setBest] = useState({ open: 0, vsraise: 0, threebet: 0 });
  const [bestStreak, setBestStreak] = useState({ open: 0, vsraise: 0, threebet: 0 });
  const [roundFlags, setRoundFlags] = useState({ newBestScore: false, newBestStreak: false });
  const [wrongCount, setWrongCount] = useState(0);   // misses this round; 3 = knocked out
  const [knockedOut, setKnockedOut] = useState(false);
  const fireworksRef = useRef(null);

  useEffect(() => { loadBest(); }, []);

  async function loadBest() {
    try {
      const raw = await AsyncStorage.getItem('preflop_best_v1');
      if (raw) {
        const b = JSON.parse(raw);
        setBest({ open: b.open || 0, vsraise: b.vsraise || 0, threebet: b.threebet || 0 });
        setBestStreak({ open: b.openStreak || 0, vsraise: b.vsraiseStreak || 0, threebet: b.threebetStreak || 0 });
      }
    } catch (e) { /* ignore */ }
  }

  async function saveBest(modeKey, finalScore, finalMaxStreak) {
    const next = {
      open: modeKey === 'open' ? Math.max(best.open, finalScore) : best.open,
      vsraise: modeKey === 'vsraise' ? Math.max(best.vsraise, finalScore) : best.vsraise,
      threebet: modeKey === 'threebet' ? Math.max(best.threebet, finalScore) : best.threebet,
      openStreak: modeKey === 'open' ? Math.max(bestStreak.open, finalMaxStreak) : bestStreak.open,
      vsraiseStreak: modeKey === 'vsraise' ? Math.max(bestStreak.vsraise, finalMaxStreak) : bestStreak.vsraise,
      threebetStreak: modeKey === 'threebet' ? Math.max(bestStreak.threebet, finalMaxStreak) : bestStreak.threebet,
    };
    setBest({ open: next.open, vsraise: next.vsraise, threebet: next.threebet });
    setBestStreak({ open: next.openStreak, vsraise: next.vsraiseStreak, threebet: next.threebetStreak });
    try { await AsyncStorage.setItem('preflop_best_v1', JSON.stringify(next)); } catch (e) { /* ignore */ }
  }

  function startQuiz(modeKey) {
    setMode(modeKey);
    setQuestion(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setWrongCount(0);
    setKnockedOut(false);
    setRoundFlags({ newBestScore: false, newBestStreak: false });
    setFeedback(null);
    deal(modeKey, 0, modeKey === 'threebet' ? shuffledThreeBetScenarios() : null);
    setScreen('quiz');
  }

  function deal(modeKey, qIndex, threeBetDeck) {
    if (modeKey === 'threebet') {
      const d = threeBetDeck || deck;
      if (threeBetDeck) setDeck(threeBetDeck);
      const s = d[qIndex % d.length];
      setScenario(s);
      setHand(s.hand);
      setCards(handDisplay(s.hand));
      setPosition(null);
      setFeedback(null);
      return;
    }
    const position = POSITIONS[Math.floor(Math.random() * POSITIONS.length)];
    // Balanced dealing: pick the lesson first, then deal a hand that deserves
    // it. 'open' is 50/50 raise/fold; 'vsraise' is an even 3-bet/call/fold
    // split. (The 3-bet drill above already uses a balanced 32-scenario deck.)
    let h;
    if (modeKey === 'open') {
      const target = Math.random() < 0.5 ? 'raise' : 'fold';
      h = randomHandWithOpenAction(position, target);
    } else {
      const targets = ['threebet', 'call', 'fold'];
      h = randomHandWithVsRaiseAction(targets[Math.floor(Math.random() * targets.length)]);
    }
    setHand(h);
    setCards(handDisplay(h));
    setPosition(position);
    setFeedback(null);
  }

  function answer(choice) {
    if (feedback) return; // already answered
    let correctAction, explanation;
    if (mode === 'open') {
      correctAction = correctOpenAction(position, hand);
      explanation = explainOpen(position, hand, correctAction);
    } else if (mode === 'threebet') {
      correctAction = scenario.answer;
      explanation = scenario.explanation;
    } else {
      correctAction = correctVsRaiseAction(hand);
      explanation = explainVsRaise(hand, correctAction);
    }
    const isCorrect = choice === correctAction;
    const newScore = score + (isCorrect ? 1 : 0);
    const newStreak = isCorrect ? streak + 1 : 0;
    const newWrong = isCorrect ? wrongCount : wrongCount + 1;
    setScore(newScore);
    setStreak(newStreak);
    setWrongCount(newWrong);
    setMaxStreak(Math.max(maxStreak, newStreak)); // remember the peak, not just the ending streak
    if (isCorrect) {
      // Fireworks behind the quiz: a burst for every right answer,
      // and a full barrage when the streak hits 10.
      if (newStreak > 0 && newStreak % 10 === 0) fireworksRef.current?.barrage();
      else fireworksRef.current?.burst();
    }
    setFeedback({ correct: isCorrect, explanation });
  }

  function next() {
    if (wrongCount >= 3) {
      endRound(true); // knocked out — Babu time
      return;
    }
    if (question + 1 >= QUESTIONS_PER_ROUND) {
      endRound(false);
    } else {
      setQuestion(question + 1);
      deal(mode, question + 1);
    }
  }

  function endRound(knockedOutFlag) {
    // Round over — decide "new best" BEFORE saving, then persist score and peak streak.
    setRoundFlags({
      newBestScore: score > best[mode] && score > 0,
      newBestStreak: maxStreak > bestStreak[mode] && maxStreak > 0,
    });
    saveBest(mode, score, maxStreak);
    setKnockedOut(knockedOutFlag);
    setScreen('result');
  }

  function onShare() {
    // Share a download link as text — Facebook and chat apps accept text,
    // but reject raw APK files.
    shareAppLink().catch(() =>
      Alert.alert('Share', 'Could not open the share sheet on this device.')
    );
  }

  // --- Screens ---------------------------------------------------------------

  if (screen === 'home') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Preflop Trainer</Text>
        <Text style={styles.subtitle}>Learn winning poker hands, one quiz at a time.</Text>

        <TouchableOpacity style={styles.bigButton} onPress={() => startQuiz('open')}>
          <Text style={styles.bigButtonText}>Open: Raise or Fold?</Text>
        </TouchableOpacity>
        <Text style={styles.bestLine}>
          Best: {best.open}/{QUESTIONS_PER_ROUND} · Best streak: {bestStreak.open}
        </Text>

        <TouchableOpacity style={styles.bigButton} onPress={() => startQuiz('vsraise')}>
          <Text style={styles.bigButtonText}>Facing a Raise</Text>
        </TouchableOpacity>
        <Text style={styles.bestLine}>
          Best: {best.vsraise}/{QUESTIONS_PER_ROUND} · Best streak: {bestStreak.vsraise}
        </Text>

        <TouchableOpacity style={styles.bigButton} onPress={() => startQuiz('threebet')}>
          <Text style={styles.bigButtonText}>3-Bet Decisions</Text>
        </TouchableOpacity>
        <Text style={styles.bestLine}>
          Best: {best.threebet}/{QUESTIONS_PER_ROUND} · Best streak: {bestStreak.threebet}
        </Text>

        <View style={styles.spacer} />

        <TouchableOpacity style={styles.shareButton} onPress={onShare}>
          <Text style={styles.shareButtonText}>Share this app</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (screen === 'result') {
    const { newBestScore, newBestStreak } = roundFlags;
    if (knockedOut) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>KNOCKED OUT!</Text>
          <Image source={require('./assets/babu-wag.jpg')} style={styles.koImage} />
          <Text style={styles.subtitle}>Three wrong answers. Babu says: very bad man!</Text>
          <Text style={styles.bestLine}>Score: {score} · Best streak: {maxStreak}</Text>
          {newBestScore && <Text style={styles.newBest}>New best score!</Text>}
          {newBestStreak && <Text style={styles.newBest}>New best streak!</Text>}
          <TouchableOpacity style={styles.bigButton} onPress={() => startQuiz(mode)}>
            <Text style={styles.bigButtonText}>Run it back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ghostButton} onPress={() => setScreen('home')}>
            <Text style={styles.ghostButtonText}>Home</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Round over!</Text>
        <Text style={styles.scoreBig}>{score} / {QUESTIONS_PER_ROUND}</Text>
        <Text style={styles.subtitle}>
          {score === QUESTIONS_PER_ROUND ? 'Perfect! You beast.' :
           score >= 8 ? 'Great job — almost perfect!' :
           score >= 6 ? 'Solid. Keep grinding.' :
           'Keep practicing — you\'ll get there.'}
        </Text>
        <Text style={styles.bestLine}>Best streak this round: {maxStreak}</Text>
        {newBestScore && <Text style={styles.newBest}>New best score!</Text>}
        {newBestStreak && <Text style={styles.newBest}>New best streak!</Text>}
        <TouchableOpacity style={styles.bigButton} onPress={() => startQuiz(mode)}>
          <Text style={styles.bigButtonText}>Play again</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ghostButton} onPress={() => setScreen('home')}>
          <Text style={styles.ghostButtonText}>Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Quiz screen
  const prompt = mode === 'open'
    ? `You're ${position}. Raise or fold?`
    : mode === 'threebet'
    ? (scenario ? scenario.situation : 'Loading…')
    : 'UTG raised. You\'re on the button — 3-bet, call, or fold?';
  const buttons = mode === 'open'
    ? [{ key: 'raise', label: 'RAISE' }, { key: 'fold', label: 'FOLD' }]
    : mode === 'threebet'
    ? Object.entries(THREE_BET_LABELS).map(([key, label]) => ({ key, label }))
    : [
        { key: 'threebet', label: '3-BET' },
        { key: 'call', label: 'CALL' },
        { key: 'fold', label: 'FOLD' },
      ];

  return (
    <View style={styles.quizWrap}>
      <Fireworks ref={fireworksRef} />
      <ScrollView contentContainerStyle={[styles.container, styles.quizTransparent]}>
      <Text style={styles.progress}>
        Question {question + 1} of {QUESTIONS_PER_ROUND} · Score: {score} · Streak: {streak} · Misses: {wrongCount}/3
      </Text>
      <Text style={styles.prompt}>{prompt}</Text>

      <View style={styles.cardsRow}>
        {cards && cards.map((c, i) => (
          <View key={i} style={styles.card}>
            <Text style={[styles.cardRank, c.red && styles.cardRed]}>{c.rank}</Text>
            <Text style={[styles.cardSuit, c.red && styles.cardRed]}>{c.suit}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.handName}>{hand && handName(hand)}</Text>

      {!feedback ? (
        buttons.map(b => (
          <TouchableOpacity key={b.key} style={styles.bigButton} onPress={() => answer(b.key)}>
            <Text style={styles.bigButtonText}>{b.label}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.feedbackBox}>
          <Text style={[styles.feedbackTitle, styles.feedbackTitleCenter, feedback.correct ? styles.good : styles.bad]}>
            {feedback.correct ? 'Correct!' : 'Ah, ah, ah! You didn\'t say the magic word!'}
          </Text>
          <Text style={styles.feedbackText}>{feedback.explanation}</Text>
          <TouchableOpacity style={styles.bigButton} onPress={next}>
            <Text style={styles.bigButtonText}>
              {wrongCount >= 3 ? 'Face Babu 💀' : question + 1 >= QUESTIONS_PER_ROUND ? 'See results' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, backgroundColor: GREEN,
    alignItems: 'center', justifyContent: 'center', padding: 24,
  },
  title: { fontSize: 34, fontWeight: 'bold', color: GOLD, marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, color: CREAM, opacity: 0.85, marginBottom: 24, textAlign: 'center' },
  scoreBig: { fontSize: 64, fontWeight: 'bold', color: CREAM, marginVertical: 12 },
  newBest: { fontSize: 18, color: GOLD, fontWeight: 'bold', marginBottom: 16 },
  bigButton: {
    backgroundColor: FELT, borderWidth: 2, borderColor: GOLD,
    borderRadius: 14, paddingVertical: 16, paddingHorizontal: 24,
    marginVertical: 8, minWidth: 260, alignItems: 'center',
  },
  bigButtonText: { color: CREAM, fontSize: 20, fontWeight: 'bold' },
  ghostButton: { marginTop: 12, padding: 12 },
  ghostButtonText: { color: CREAM, fontSize: 16, opacity: 0.8 },
  bestLine: { color: CREAM, opacity: 0.75, fontSize: 14, marginBottom: 12 },
  spacer: { height: 24 },
  shareButton: {
    backgroundColor: GOLD, borderRadius: 14,
    paddingVertical: 14, paddingHorizontal: 24, minWidth: 260, alignItems: 'center',
  },
  shareButtonText: { color: GREEN, fontSize: 18, fontWeight: 'bold' },
  progress: { color: CREAM, opacity: 0.8, fontSize: 14, marginBottom: 12, textAlign: 'center' },
  prompt: { color: CREAM, fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  cardsRow: { flexDirection: 'row', marginBottom: 8 },
  card: {
    backgroundColor: '#fff', borderRadius: 12, width: 84, height: 116,
    marginHorizontal: 8, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 4, elevation: 4,
  },
  cardRank: { fontSize: 36, fontWeight: 'bold', color: '#222' },
  cardSuit: { fontSize: 32, color: '#222' },
  cardRed: { color: RED },
  handName: { color: CREAM, opacity: 0.7, fontSize: 14, marginBottom: 20 },
  feedbackBox: { alignItems: 'center', marginTop: 8 },
  feedbackTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  feedbackTitleCenter: { textAlign: 'center' },
  quizWrap: { flex: 1, backgroundColor: GREEN },
  quizTransparent: { backgroundColor: 'transparent' },
  koImage: { width: 300, height: 225, borderRadius: 14, marginVertical: 16 },
  good: { color: '#7bed9f' },
  bad: { color: '#ff6b6b' },
  feedbackText: { color: CREAM, fontSize: 16, textAlign: 'center', marginBottom: 16, lineHeight: 24 },
});
