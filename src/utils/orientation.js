import { ScreenOrientation } from "@capacitor/screen-orientation";
import { IS_MOBILE } from "./platform";

// Mobile builds lock to landscape for the whole time a video is playing and
// unlock on stop so the rest of the app follows the device again.
export async function lockPlayerOrientation() {
  if (!IS_MOBILE) return;
  try {
    await ScreenOrientation.lock({ orientation: "landscape" });
  } catch {}
}

export async function unlockPlayerOrientation() {
  if (!IS_MOBILE) return;
  try {
    await ScreenOrientation.unlock();
  } catch {}
}
