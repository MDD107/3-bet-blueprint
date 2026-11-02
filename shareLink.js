import { Share } from 'react-native';

// Permanent download link for the app. This is a Google Drive folder link
// ("Anyone with the link") so it stays valid across versions — each new APK
// just gets uploaded into the same folder. Set by the build; ask Mike for the
// current link if this ever needs updating.
export const APP_DOWNLOAD_URL = 'https://drive.google.com/drive/folders/1nrxI_mH1zDGlZcpLo6JcfAWNQuPHcjPF';

const SHARE_MESSAGE =
  '🃏 I built a free poker quiz app — Poker Preflop Trainer! ' +
  'Practice preflop spots and 3-bet decisions. Download it for Android here: ' +
  APP_DOWNLOAD_URL;

export function shareAppLink() {
  return Share.share({ message: SHARE_MESSAGE });
}
