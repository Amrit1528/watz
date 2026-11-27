import { useEffect, useRef } from "react";
import Hls from "hls.js";

// Native HTML5 video player used on Android/iOS for direct MP4/HLS streams.
// Restores the saved position on load and reports progress so the app can
// persist it across restarts.
export default function MobileVideoPlayer({
  src,
  startTime = 0,
  poster,
  onProgress,
}) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    const isHls = /\.m3u8?(\?|$)/i.test(src) || src.includes("m3u8");
    let hls = null;

    if (isHls && video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    } else if (isHls && Hls.isSupported()) {
      hls = new Hls({ enableWorker: true });
      hls.loadSource(src);
      hls.attachMedia(video);
      hlsRef.current = hls;
    } else {
      video.src = src;
    }

    const restore = () => {
      if (startTime > 0 && isFinite(video.duration)) {
        try { video.currentTime = Math.min(startTime, video.duration - 1); } catch {}
      }
    };
    video.addEventListener("loadedmetadata", restore);

    const report = () => {
      if (!isFinite(video.duration) || video.duration <= 0) return;
      onProgress?.(Math.floor(video.currentTime), Math.floor(video.duration));
    };
    video.addEventListener("timeupdate", report);
    video.addEventListener("pause", report);

    video.play().catch(() => {});

    return () => {
      video.removeEventListener("loadedmetadata", restore);
      video.removeEventListener("timeupdate", report);
      video.removeEventListener("pause", report);
      if (hls) hls.destroy();
      hlsRef.current = null;
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [src, startTime, onProgress]);

  return (
    <video
      ref={videoRef}
      poster={poster}
      controls
      playsInline
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        background: "#000",
      }}
    />
  );
}
