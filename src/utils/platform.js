// True when running inside the Capacitor Android/iOS WebView rather than
// Electron or a desktop browser.
export const IS_MOBILE =
  typeof window !== "undefined" &&
  (!!window.Capacitor || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
