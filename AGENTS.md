# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

## React Native / Hermes gotchas (learned 2026-09-26, v1.7 crash)
- RN's `process` polyfill exists on-device but has NO `process.argv` / `process.versions`. Never gate Node-only code on `typeof process !== 'undefined'` alone — use `process.versions?.node`. A self-test guard `process.argv[1]...` in data/ranges.js threw "Cannot convert undefined value to object" at import time on the phone (v1.7 crash) while passing in Node. Fixed in v1.7.2.
- Symbolicate Hermes stack traces with the project's own source maps: the packager map + compiler map under android/app/build/{intermediates,generated}/sourcemaps/react/release/. Frames look like `anonymous (address at index.android.bundle:1:178353)` — translate via compiler.map (Hermes offset -> Metro JS) then packager.map (Metro JS -> source).
