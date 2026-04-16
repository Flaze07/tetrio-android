import { RootStackParamList } from "@/App"
import { replayDataAtom } from "@/atoms/replayData.atoms"
import { GameButton } from "@/components/game-button"
import { CONTROL_VALUE } from "@/constants/controls"
import { useButtonSave } from "@/hooks/use-button-save"
import { RouteProp, useRoute } from "@react-navigation/native"
import { useAtom } from "jotai"
import { useEffect, useRef, useState } from "react"
import { View } from "react-native"
import { WebView, WebViewMessageEvent } from "react-native-webview"
import tw from "twrnc"

type GameRouteProp = RouteProp<RootStackParamList, "game">

export function GameScreen() {

  const { params } = useRoute<GameRouteProp>();

  const { buttons } = useButtonSave();

  const [replayData] = useAtom(replayDataAtom);

  const [viewedReplay] = useState<boolean>(false);

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

  if (params?.viewReplay) {
    webviewRef.current?.injectJavaScript(`
      function simulateDrop(base64, fileName, mimeType) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'drop', base64.length, fileName, mimeType }));
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length)
          .fill()
          .map((_, i) => byteCharacters.charCodeAt(i));
        const byteArray = new Uint8Array(byteNumbers);
        const file = new File([byteArray], fileName, { type: mimeType });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        const dropEvent = new DragEvent('drop', {
          dataTransfer,
          bubbles: true
        });
        const dropZone = document.querySelector('menus');
        dropZone.dispatchEvent(dropEvent);
      }
      true;
    `);
  }

  // const handleWebViewMessage = (e: WebViewMessageEvent) => {
  //   const { event } = JSON.parse(e.nativeEvent.data);
  //   if (event === "console") {
  //     const { level, args } = JSON.parse(e.nativeEvent.data);
  //     console.log(...args);
  //   }
  //   if (event === "menuHidden") {
  //     setTimeout(() => {
  //       checkMenuVisible();
  //     }, 200);
  //   }
  //   if (event === "menuVisible") {
  //     webviewRef.current?.injectJavaScript(`
  //       simulateDrop(${replayData}, 'whatever', '*/*');
  //     `);
  //   }
  // }
  //
  const checkMenuVisible = () => {
    console.log("CHECKING");
    webviewRef.current?.injectJavaScript(`
      (() => {
        const menu = document.querySelector('#menus');
        console.log(menu);
        if (menu && menu.className === "hidden") {
          window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'menuHidden' }));
        } else if (menu && menu.className === ""){
          window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'menuVisible' }));
        } else {
          window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'menuUnknown' }));
        }
      })()
      true;
    `);
  }

  const injectReplay = () => {
    console.log("INJECTING REPLAY");
    webviewRef.current?.injectJavaScript(`
      (function() {
        const byteCharacters = atob('${replayData}');
        const byteNumbers = new Array(byteCharacters.length)
          .fill()
          .map((_, i) => byteCharacters.charCodeAt(i));
        const byteArray = new Uint8Array(byteNumbers);
        const file = new File([byteArray], "whatever.ttrm", { type: "*/*"});
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        const dropEvent = new DragEvent('drop', {
          dataTransfer,
          bubbles: true
        });
        const dropZone = document.querySelector('#menus');
        dropZone.dispatchEvent(dropEvent);
      })();
      true;
    `);
    // webviewRef.current?.injectJavaScript(`
    //   window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'drop external' }));
    //   (() => {
    //     window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'drop' }));
    //     const byteCharacters = atob(${replayData});
    //     const byteNumbers = new Array(byteCharacters.length)
    //       .fill()
    //       .map((_, i) => byteCharacters.charCodeAt(i));
    //     const byteArray = new Uint8Array(byteNumbers);
    //     const file = new File([byteArray], "whatever", { type: "*/*"});
    //     const dataTransfer = new DataTransfer();
    //     dataTransfer.items.add(file);
    //     const dropEvent = new DragEvent('drop', {
    //       dataTransfer,
    //       bubbles: true
    //     });
    //     const dropZone = document.querySelector('#menus');
    //     dropZone.dispatchEvent(dropEvent);
    //   })();
    //   true;
    // `);
  }

  const handleWebViewMessage = (e: WebViewMessageEvent) => {
    const data = e.nativeEvent.data;
    const jsonData = JSON.parse(data);
    console.log("WEBVIEW LOGS: ", jsonData.event);
    if (jsonData.event === "menuHidden" || jsonData.event === "menuUnknown") {
      setTimeout(() => {
        console.log("CALLED");
        checkMenuVisible();
      }, 500);
    } else if (jsonData.event === "menuVisible") {
      injectReplay();
    }
  }


  useEffect(() => {
    const interval = setInterval(() => {
      removeAds();
    }, 100);

    if (params?.viewReplay) {
      setTimeout(() => {
        checkMenuVisible();
      }, 300);
    }

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
          // uri: params === undefined ? "https://tetr.io" : `https://tetr.io/${params.roomCode}`,
          uri: (() => {
            if (params === undefined) {
              return "https://tetr.io"
            }

            if (params.roomCode !== "" && params.roomCode !== undefined) {
              return `https://tetr.io/${params.roomCode}`
            }

            return "https://tetr.io"
          })()
        }}
        originWhitelist={[
          "https://tetr.io",
          "https://ch.tetr.io",
        ]}
        onMessage={(e) => handleWebViewMessage(e)}
        // injectedJavaScript={`
        //   oldConsole = console.log;
        //   console = new Object();
        //   console.log = function(log) {
        //     oldConsole(log);
        //     window.ReactNativeWebView.postMessage(JSON.stringify({
        //       event: 'console',
        //       level: 'log',
        //       args: [log]
        //     }));
        //   }
        // `}
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
