import { RootStackParamList } from "@/App"
import { replayDataAtom } from "@/atoms/replayData.atoms"
import { GameButton } from "@/components/game-button"
import { ImmediateGameButton } from "@/components/immediate-game-button"
import { CONTROL_VALUE } from "@/constants/controls"
import { useButtonSave } from "@/hooks/use-button-save"
import { RouteProp, useRoute } from "@react-navigation/native"
import { useAtom } from "jotai"
import { useEffect, useRef, useState } from "react"
import { Dimensions, Modal, Text, TouchableOpacity, View } from "react-native"
import { WebView, WebViewMessageEvent } from "react-native-webview"
import tw from "twrnc"
import Slider from "@react-native-community/slider"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { SafeAreaView } from "react-native-safe-area-context"
import { useConfig } from "@/hooks/use-config"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import { ButtonConfig } from "@/types"

type GameRouteProp = RouteProp<RootStackParamList, "game">

export function GameScreen() {

  const { params } = useRoute<GameRouteProp>();

  const { buttons } = useButtonSave();
  const { buttonOpacity, buttonShape } = useConfig();

  const screenWidth = Dimensions.get("window").width;

  const [replayData] = useAtom(replayDataAtom);

  const [hideButtons, setHideButtons] = useState<boolean>(false);
  const [immediatePressedIds, setImmediatePressedIds] = useState<Set<string>>(new Set());
  const [optionsModalVisible, setOptionsModalVisible] = useState<boolean>(false);
  const [webviewZoom, setWebviewZoom] = useState<number>(1);

  const applyZoom = (zoomLevel: number) => {
    webviewRef.current?.injectJavaScript(`
      (function() {
        document.documentElement.style.zoom = '${zoomLevel}';
        document.body.style.zoom = '${zoomLevel}';
        window.dispatchEvent(new Event('resize'));
      })();
      true;
    `);
  };

  const makeDebounce = (f: (newValue: number) => any) => {
    let timeout: any;
    return (newValue: number) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => f(newValue), 100);
    };
  };

  const debouncedSaveZoom = makeDebounce(async (val: number) => {
    try {
      await AsyncStorage.setItem("webviewZoom", val.toString());
    } catch (e) {
      console.log(e);
    }
  });

  useEffect(() => {
    AsyncStorage.getItem("webviewZoom").then((saved) => {
      if (saved) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed) && parsed >= 0.5 && parsed <= 2.0) {
          setWebviewZoom(parsed);
          applyZoom(parsed);
        }
      }
    });
  }, []);

  const buttonsRef = useRef(buttons);
  useEffect(() => {
    buttonsRef.current = buttons;
  }, [buttons]);

  const hideButtonsRef = useRef(hideButtons);
  useEffect(() => {
    hideButtonsRef.current = hideButtons;
  }, [hideButtons]);

  const pressedByTouchRef = useRef<Map<number, Set<string>>>(new Map());
  const currentUnionRef = useRef<Set<string>>(new Set());

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

  const isPointInButton = (px: number, py: number, button: ButtonConfig): boolean => {
    const shape = button.shape ?? buttonShape ?? "SQUARE";
    if (shape === "SQUARE") {
      return (
        px >= button.position.x &&
        px <= button.position.x + button.size.x &&
        py >= button.position.y &&
        py <= button.position.y + button.size.y
      );
    } else {
      const cx = button.position.x + button.size.x / 2;
      const cy = button.position.y + button.size.y / 2;
      const dx = px - cx;
      const dy = py - cy;
      const rotX = (dx - dy) * Math.SQRT1_2;
      const rotY = (dx + dy) * Math.SQRT1_2;
      return (
        Math.abs(rotX) <= button.size.x / 2 &&
        Math.abs(rotY) <= button.size.y / 2
      );
    }
  };

  const getHitButtonIds = (px: number, py: number): string[] => {
    if (hideButtonsRef.current) return [];
    const currentButtons = buttonsRef.current ?? [];
    const hit: string[] = [];
    for (const b of currentButtons) {
      if (b.mode === "IMMEDIATE" && isPointInButton(px, py, b)) {
        hit.push(b.id);
      }
    }
    return hit;
  };

  const syncTouches = (allTouches: ReadonlyArray<{ id: number; x?: number; y?: number; absoluteX?: number; absoluteY?: number }>) => {
    const currentButtons = buttonsRef.current ?? [];
    const buttonMap = new Map<string, ButtonConfig>();
    for (const b of currentButtons) {
      buttonMap.set(b.id, b);
    }

    for (const touch of allTouches) {
      const px = touch.x ?? touch.absoluteX ?? 0;
      const py = touch.y ?? touch.absoluteY ?? 0;
      const hits = getHitButtonIds(px, py);
      pressedByTouchRef.current.set(touch.id, new Set(hits));
    }

    const newUnion = new Set<string>();
    for (const set of pressedByTouchRef.current.values()) {
      for (const id of set) {
        newUnion.add(id);
      }
    }

    const oldUnion = currentUnionRef.current;

    for (const id of newUnion) {
      if (!oldUnion.has(id)) {
        const b = buttonMap.get(id);
        if (b) {
          onPressIn(b.keycode);
        }
      }
    }

    for (const id of oldUnion) {
      if (!newUnion.has(id)) {
        const b = buttonMap.get(id);
        if (b) {
          onPressOut(b.keycode);
        }
      }
    }

    currentUnionRef.current = newUnion;
    setImmediatePressedIds(new Set(newUnion));
  };

  const removeTouches = (
    changedTouches: ReadonlyArray<{ id: number }>,
    allTouches: ReadonlyArray<{ id: number; x?: number; y?: number; absoluteX?: number; absoluteY?: number }>
  ) => {
    for (const touch of changedTouches) {
      pressedByTouchRef.current.delete(touch.id);
    }

    const remaining = allTouches.filter(
      (t) => !changedTouches.some((ct) => ct.id === t.id)
    );
    syncTouches(remaining);
  };

  const clearAllTouches = () => {
    const currentButtons = buttonsRef.current ?? [];
    const buttonMap = new Map<string, ButtonConfig>();
    for (const b of currentButtons) {
      buttonMap.set(b.id, b);
    }

    for (const id of currentUnionRef.current) {
      const b = buttonMap.get(id);
      if (b) {
        onPressOut(b.keycode);
      }
    }

    pressedByTouchRef.current.clear();
    currentUnionRef.current = new Set();
    setImmediatePressedIds(new Set());
  };

  useEffect(() => {
    return () => {
      clearAllTouches();
    };
  }, []);

  useEffect(() => {
    clearAllTouches();
  }, [buttons]);

  const onHide = () => {
    setHideButtons(prev => {
      if (!prev) {
        clearAllTouches();
      }
      return !prev;
    });
  }

  const hasImmediateButtons = buttons?.some(b => b.mode === "IMMEDIATE") ?? false;

  const immediateGesture = Gesture.Manual()
    .runOnJS(true)
    .enabled(hasImmediateButtons)
    .onTouchesDown((event) => {
      syncTouches(event.allTouches);
    })
    .onTouchesMove((event) => {
      syncTouches(event.allTouches);
    })
    .onTouchesUp((event) => {
      removeTouches(event.changedTouches, event.allTouches);
    })
    .onTouchesCancelled(() => {
      clearAllTouches();
    });

  const onSendChat = () => {
    webviewRef.current?.injectJavaScript(`
      (function() {
        [ "chat_input", "league_chat_input", "ingame_chat_input", "social_dm_input"].forEach(function(id) {
          const input = document.getElementById(id);
          input.dispatchEvent(new KeyboardEvent('keydown', {
            'code': 'Enter'
          }))
        });
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
    <GestureDetector gesture={immediateGesture}>
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
          onLoadEnd={() => {
            applyZoom(webviewZoom);
          }}
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
        <GameButton
          button={{
            id: "hide",
            keycode: "HIDE",
            size: {
              x: 50,
              y: 50,
            },
            position: {
              x: 10,
              y: 10,
            },
            color: "stone",
            shape: "SQUARE",
            opacity: 0.7,
          }}
          onPressIn={() => onHide()}
        />

        <GameButton
          button={{
            id: "options",
            keycode: "OPTIONS",
            size: {
              x: 50,
              y: 50,
            },
            position: {
              x: screenWidth / 2 - 25,
              y: 10,
            },
            color: "stone",
            shape: "SQUARE",
            opacity: 0.7,
          }}
          onPressIn={() => setOptionsModalVisible(true)}
        />

        <GameButton
          button={{
            id: "sendchat",
            keycode: "SENDCHAT",
            size: {
              x: 50,
              y: 50,
            },
            position: {
              x: screenWidth - 10,
              y: 10,
            },
            color: "stone",
            shape: "SQUARE",
            opacity: 0.7,
          }}
          onPressIn={() => onSendChat()}
        />

        {
          !hideButtons && (
            buttons?.map(button => {
              const resolvedButton = {
                ...button, 
                opacity: buttonOpacity,
                shape: buttonShape,
              };

              if (button.mode === "IMMEDIATE") {
                return (
                  <ImmediateGameButton
                    key={button.id}
                    button={resolvedButton}
                    isPressed={immediatePressedIds.has(button.id)}
                  />
                );
              }

              return (
                <GameButton
                  key={button.id}
                  button={resolvedButton}
                  onPressIn={() => onPressIn(button.keycode)}
                  onPressOut={() => onPressOut(button.keycode)}
                />
              );
            })
          )
        }

        <Modal
          visible={optionsModalVisible}
          transparent
          animationType="fade"
          statusBarTranslucent
          navigationBarTranslucent
          onRequestClose={() => setOptionsModalVisible(false)}
        >
          <SafeAreaView
            onTouchStart={() => setOptionsModalVisible(false)}
            style={tw`flex-1 w-full bg-black/60 items-center pt-8`}
          >
            <View
              onTouchStart={(e) => e.stopPropagation()}
              style={tw`w-96 bg-slate-900 rounded-2xl p-5 shadow-2xl border border-slate-700`}
            >
              <View style={tw`flex-row items-center justify-between mb-3`}>
                <Text style={tw`text-white text-xl font-bold`}>
                  WebView Zoom
                </Text>
                <Text style={tw`text-emerald-400 text-lg font-bold`}>
                  {Math.round(webviewZoom * 100)}%
                </Text>
              </View>

              <Slider
                minimumValue={0.5}
                maximumValue={2.0}
                step={0.05}
                minimumTrackTintColor="#10b981"
                maximumTrackTintColor="#334155"
                thumbTintColor="#ffffff"
                value={webviewZoom}
                onValueChange={(newValue) => {
                  const rounded = Math.round(newValue * 100) / 100;
                  setWebviewZoom(rounded);
                  applyZoom(rounded);
                  debouncedSaveZoom(rounded);
                }}
              />

              <View style={tw`flex-row justify-between items-center mt-4`}>
                <TouchableOpacity
                  style={tw`px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700`}
                  onPress={() => {
                    setWebviewZoom(1);
                    applyZoom(1);
                    debouncedSaveZoom(1);
                  }}
                >
                  <Text style={tw`text-slate-300 text-xs font-semibold`}>
                    Reset (100%)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={tw`px-5 py-1.5 bg-emerald-500 rounded-lg`}
                  onPress={() => setOptionsModalVisible(false)}
                >
                  <Text style={tw`text-white text-xs font-bold`}>
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </Modal>
      </View>
    </GestureDetector>
  )
}
