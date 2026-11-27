// True when running inside the Capacitor Android/iOS WebView rather than
// Electron or a desktop browser.
export const IS_MOBILE =
  typeof window !== "undefined" &&
  (!!window.Capacitor || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent));

const viteEnv = typeof import.meta !== "undefined" ? import.meta.env : undefined;

// The Android APK hides Settings/Downloads/external links and provisions a TMDB
// key automatically. Windows builds made with VITE_APK_FEATURES=1 mirror that
// same feature set while still using the Electron player.
export const IS_APK_MODE = IS_MOBILE || viteEnv?.VITE_APK_FEATURES === "1";
