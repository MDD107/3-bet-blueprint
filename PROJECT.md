# 3-Bet Blueprint - Project Knowledge

## Purpose
This is an Android Texas Hold'em poker training app (formerly "Poker Preflop Trainer").
The goal is to help players practice pre-flop decisions,
3-betting, calling, folding, and basic poker strategy.

## Important Rules
- Texas Hold'em uses 2 hole cards.
- Players ultimately use the best 5-card hand from 7 available cards.
- Pre-flop decisions occur before the flop.
- The trainer should never give a strategically incorrect answer.
- Poker terminology should be explained clearly to newer players.

## App Behavior
- User receives a poker scenario.
- User selects an action.
- App evaluates the answer.
- App explains why the answer is correct or incorrect.
- Progress is saved locally.

## Coding Requirements
- Android app
- Keep the interface simple.
- Avoid unnecessary dependencies.
- Don't change working code unless necessary.
- Preserve existing functionality when fixing bugs.
- Test changes before considering a task complete.

## Teaching Format
When explaining a quiz answer, use this format:

Correct Answer: 3-Bet
Why: We have a strong enough range advantage to apply pressure.
Mistake to Avoid: Calling too often with this hand allows weaker ranges to realize equity cheaply.

## Known Issues
- None outstanding as of v1.8.1 (2026-10-04).

## Future Features
- Tablet / large-screen landscape support. Play Console warns that from
  Android 16 the OS ignores the portrait orientation lock on large screens
  (foldables, tablets). Currently portrait-only by design; adaptive layouts
  would be a future update, not a blocker.
- Ship the rebalanced quiz (v1.8.1 logic) to the Play closed-test track as a
  new release. The Play v1.0 (com.opie.threebetblueprint) still has the old
  fold-heavy deal.

## Important Decisions
- **Rig the deal, never the answers** (2026-10-04, shipped in v1.8.1): the quiz
  was dealing from a real deck, so FOLD was correct ~80-95% of the time and
  the drill was gameable by mashing one button. Now the drill picks the lesson
  first (open drill: 50/50 raise/fold; vs-raise drill: even 3-bet/call/fold
  split) and deals a random hand that genuinely earns that action. The 3-Bet
  Decisions drill already used a balanced 32-scenario deck (12/8/6/6) and was
  left alone.
- **Two separate apps, two certs** (2026-10-01/04): the sideloaded app
  (com.opie.preflop) is signed with the debug key and MUST keep that cert so
  new versions install over the old ones. The Play Store app
  (com.opie.threebetblueprint) uses the dedicated upload key
  (3bet-blueprint-upload-key.jks). Never cross the certs. When building a
  sideloaded release, temporarily set applicationId/version/signing in
  android/app/build.gradle, then REVERT to the Play config immediately after.
- **Every app needs a Share button** (Mike's standing rule): Facebook rejects
  raw APK attachments, so Share sends the Drive folder link as text instead:
  https://drive.google.com/drive/folders/1nrxI_mH1zDGlZcpLo6JcfAWNQuPHcjPF
  Upload each new APK to that folder so Share always serves the current version.
- **Hermes safety** (2026-09-26, v1.7 crash): data/*.js modules must not touch
  Node APIs (`process.argv`, `process.versions`, `process.env`) at import
  time — RN's `process` polyfill lacks them and the app force-closes on launch.
