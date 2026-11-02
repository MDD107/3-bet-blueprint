// Bridge to the native Android share module (ShareModule.kt).
// Shares this app's own APK file through Android's share sheet.
import { NativeModules, Platform } from 'react-native';

const { ShareApk } = NativeModules;

export async function shareApk() {
  if (Platform.OS !== 'android' || !ShareApk) {
    throw new Error('APK sharing is only available on Android.');
  }
  return ShareApk.shareApk();
}
