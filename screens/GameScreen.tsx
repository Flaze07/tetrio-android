import { GameButton } from "@/components/game-button"
import { CONTROL_VALUE } from "@/constants/controls"
import { useButtonSave } from "@/hooks/use-button-save"
import { useEffect, useRef } from "react"
import { TouchableOpacity, View } from "react-native"
import { WebView } from "react-native-webview"
import tw from "twrnc"

export function GameScreen() {

  const { buttons } = useButtonSave();

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

  const onPressIn = (code: CONTROL_VALUE) => {
    webviewRef.current?.injectJavaScript(`
    (function() {
      document.body.dispatchEvent(
        new KeyboardEvent('keydown', {
          bubbles: true,
          code: '${code}',
        })
      );
    })();
    true;
  `);
  }

  const onPressOut = (code: CONTROL_VALUE) => {
    webviewRef.current?.injectJavaScript(`
    (function() {
      document.body.dispatchEvent(
        new KeyboardEvent('keyup', {
          bubbles: true,
          code: '${code}',
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
      {
        buttons?.map(button => (
          <GameButton
            key={button.id}
            button={button}
            onPressIn={() => onPressIn(button.keycode)}
            onPressOut={() => onPressOut(button.keycode)}
          />
        ))
      }
    </View>
  )
}