import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

type VideoPlayerProps = {
  uri: string;
  width?: number;
  height?: number;
  borderRadius?: number;
};

// Wraps a raw video URL (mp4/m3u8/webm) in a minimal HTML page that
// autoplays, loops, and is muted (required for autoplay on iOS/Android),
// and force-resumes playback if it's ever paused for any reason.
const buildAutoplayHtml = (uri: string) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      <style>
        html, body { margin: 0; padding: 0; background: #000; overflow: hidden; height: 100%; }
        video { width: 100%; height: 100%; object-fit: cover; }
      </style>
    </head>
    <body>
      <video
        id="player"
        src="${uri}"
        autoplay
        loop
        muted
        playsinline
        webkit-playsinline
        preload="auto"
      ></video>
      <script>
        const video = document.getElementById('player');

        function forcePlay() {
          video.muted = true;
          const p = video.play();
          if (p !== undefined) {
            p.catch(() => {
              // Autoplay blocked once — retry shortly, this resolves almost all cases
              setTimeout(forcePlay, 300);
            });
          }
        }

        video.addEventListener('loadedmetadata', forcePlay);
        video.addEventListener('canplay', forcePlay);
        // Belt-and-suspenders: if it ever pauses (buffering stall, OS interruption,
        // backgrounding/foregrounding), immediately resume.
        video.addEventListener('pause', forcePlay);
        video.addEventListener('ended', forcePlay); // loop should handle this, but just in case
        video.addEventListener('stalled', forcePlay);
        video.addEventListener('waiting', () => {
          // let it buffer, then nudge play once more
          setTimeout(forcePlay, 500);
        });

        // Safety net: poll every 2s and resume if somehow paused
        setInterval(() => {
          if (video.paused) forcePlay();
        }, 2000);

        forcePlay();
      </script>
    </body>
  </html>
`;

const VideoPlayer = ({ uri, width = 200, height = 120, borderRadius = 10 }: VideoPlayerProps) => {
  const webviewRef = useRef<WebView>(null);

  return (
    <View style={[styles.wrap, { width, height, borderRadius }]}>
      <WebView
        ref={webviewRef}
        style={styles.webview}
        originWhitelist={['*']}
        source={{ html: buildAutoplayHtml(uri) }}
        // ── Props that matter for continuous autoplay on mobile ──
        allowsInlineMediaPlayback // iOS: play inside the view, not fullscreen
        mediaPlaybackRequiresUserAction={false} // Android/iOS: don't wait for a tap
        allowsFullscreenVideo={false}
        javaScriptEnabled
        domStorageEnabled
        cacheEnabled
        // Keep it mounted/rendered even while off-screen in a ScrollView so it
        // doesn't get torn down and restarted when scrolled back into view.
        renderToHardwareTextureAndroid
        androidLayerType="hardware"
        // If the WebView process itself dies (e.g. Android low-memory), reload once.
        onContentProcessDidTerminate={() => webviewRef.current?.reload()}
        onError={() => webviewRef.current?.reload()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
    marginRight: 10,
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default VideoPlayer;