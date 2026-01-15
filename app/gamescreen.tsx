import { useEffect, useRef } from "react"
import { TouchableOpacity, View } from "react-native"
import { WebView } from "react-native-webview"
import tw from "twrnc"

export default function gameScreen() {

  const injectedJS = `
    function A() {
      const div = document.querySelector(".fs-sticky-footer");
      div?.remove()
      setTimeout(A, 100);
    };
    A();
    true;
  `
  const webviewRef = useRef<WebView>(null);

  const injectJS = () => {
    webviewRef?.current?.injectJavaScript(injectedJS)
  }

  const arrowKeyDown = () => {
    webviewRef.current?.injectJavaScript(`
    (function() {
      document.body.dispatchEvent(
        new KeyboardEvent('keydown', {
          bubbles: true,
          code: 'ARROWLEFT',
        })
      );
    })();
    true;
  `);
  }

  const arrowKeyUp = () => {
    webviewRef.current?.injectJavaScript(`
    (function() {
      document.body.dispatchEvent(
        new KeyboardEvent('keyup', {
          bubbles: true,
          code: 'ARROWLEFT',
        })
      );
    })();
    true;
  `);
  }

  useEffect(() => {
    injectJS();
  }, []);

  return (
    <View
      style={tw`flex-1 w-full`}
    >
      <WebView
        ref={webviewRef}
        source={{
          uri: "https://tetr.io",
        }}
        originWhitelist={[
          "https://tetr.io",
          "https://ch.tetr.io",
        ]}
        style={tw`flex-1 w-full`}
      />
      <TouchableOpacity
        onPressIn={arrowKeyDown}
        onPressOut={arrowKeyUp}
        style={tw`w-10 h-10 bg-orange-500 absolute`}
      >

      </TouchableOpacity>
    </View>
  )
}