import { RootStackParamList } from "@/App"
import { GameButton } from "@/components/game-button"
import { CONTROL_VALUE } from "@/constants/controls"
import { useButtonSave } from "@/hooks/use-button-save"
import { RouteProp, useRoute } from "@react-navigation/native"
import { useEffect, useRef } from "react"
import { TouchableOpacity, View } from "react-native"
import { WebView } from "react-native-webview"
import tw from "twrnc"

type GameRouteProp = RouteProp<RootStackParamList, "game">

export function GameScreen() {

  const { params } = useRoute<GameRouteProp>();

  const { buttons } = useButtonSave();

  const removeAdJS = `
    function A() {
      const div = document.querySelector(".fs-sticky-footer");
      div?.remove();

      const div2 = document.querySelector("#fs-sticky-footer");
      div2?.remove();
    }
    A();
    true;
  `
  const webviewRef = useRef<WebView>(null);

  const removeAds = () => {
    webviewRef?.current?.injectJavaScript(removeAdJS)
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
    const interval = setInterval(() => {
      removeAds();
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <View
      style={tw`flex-1 w-full`}
    >
      <WebView
        ref={webviewRef}
        source={{
          // uri: `https://tetr.io/${params?.roomCode}`,
          uri: params === undefined ? "https://tetr.io" : `https://tetr.io/${params.roomCode}`,
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