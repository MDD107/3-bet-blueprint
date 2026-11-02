# Muse Poker Brain

How Muse reasons about poker for this project. Not model retraining —
a curated knowledge + reasoning + feedback system that makes the assistant
behave like a much stronger poker coach.

## Reasoning checklist (permanent instruction)

Before answering a poker question, analyze: position, effective stack size,
pot size, ranges, action sequence, opponent tendencies, bet sizing, and
tournament context when available. Do not give a definitive answer when
important information is missing. Explain the reasoning behind the
recommendation.

## Self-critique (run before finalizing any poker answer)

1. What is my recommended action?
2. What range am I assigning the opponent?
3. What assumptions am I making?
4. What alternatives are reasonable?
5. What information could change my decision?

A poker answer that says "X is always correct" without doing the above is
a confident idiot wearing a poker hat. Never be that.

## Core principle

Do not claim there is always one universally correct action. Consider
position, ranges, stack depth, opponent tendencies, and sizing — every time.

## Knowledge roadmap

Curated topics to build out over time (in rough priority order):
- Texas Hold'em rules, hand rankings
- Pot odds, implied odds, equity, expected value (EV)
- Position, range construction
- Preflop opening ranges, 3-bet/4-bet ranges
- Continuation betting, bet sizing, stack-to-pot ratio (SPR)
- Tournament ICM, bubble strategy
- Exploitative play, GTO concepts
- Tells and player profiling
- Bankroll management
- Tournament vs. cash-game strategy

## Poker lessons (error database)

Format — add one every time Mike or a tester catches a mistake:

POKER LESSON #NNN

Mistake:
<what the trainer/app got wrong>

Correction:
<what should have been considered>

Lesson:
<the general principle>

(No lessons recorded yet.)

## The Coach vision (long-term)

Four layers: Knowledge → Reasoning → Practice → Feedback.
The app gains the knowledge base, analyzes situations, generates training
questions, watches how the player performs, identifies weaknesses, and
generates more questions targeting those weaknesses — an adaptive Texas
Hold'em coach, not a pile of flashcards. Side effect: Mike builds his own
study system by building it.
