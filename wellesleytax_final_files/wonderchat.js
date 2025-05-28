console.log("loaded wonderchat.js");

const removeHttp = (url) => {
  if (url === undefined) {
    return "";
  }

  return url.replace(/^https?:\/\//, "");
};

function isCrossOriginFrame(iframe = undefined) {
  try {
    if (iframe !== undefined) {
      return !iframe?.window?.top?.location.hostname;
    }

    return !window?.top?.location.hostname;
  } catch (e) {
    return true;
  }
}

/* UTM params */
function getUTMParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    wc_utm_source: urlParams.get("utm_source"),
    wc_utm_medium: urlParams.get("utm_medium"),
    wc_utm_campaign: urlParams.get("utm_campaign"),
    wc_utm_term: urlParams.get("utm_term"),
    wc_utm_content: urlParams.get("utm_content"),
  };
}

try {
  const utmParams = getUTMParameters();

  Object.keys(utmParams).forEach((key) => {
    if (utmParams[key]) {
      sessionStorage.setItem(key, utmParams[key]);
    }
  });
} catch (err) {
  console.log("Error occurred when getting utm params");
}

const oldOverflow = document?.body?.style?.overflow ?? "";

const wonderchatScript = document.querySelector(
  "script[data-name='wonderchat']"
);

const offsetBottom = wonderchatScript?.getAttribute(
  "data-widget-offset-bottom"
);
const offsetRight = wonderchatScript?.getAttribute("data-widget-offset-right");
const offsetLeft = wonderchatScript?.getAttribute("data-widget-offset-left");
const offsetBottomMobile = wonderchatScript?.getAttribute(
  "data-widget-offset-bottom-mobile"
);
const offsetRightMobile = wonderchatScript?.getAttribute(
  "data-widget-offset-right-mobile"
);
const offsetLeftMobile = wonderchatScript?.getAttribute(
  "data-widget-offset-left-mobile"
);
const dataPreviewLiveChat = wonderchatScript?.getAttribute(
  "data-preview-live-chat"
);
const placement = wonderchatScript?.getAttribute("data-placement") || "right";
let wonderchatId = wonderchatScript?.getAttribute("data-id");

const wonderchatPassphrase = wonderchatScript?.getAttribute("data-passphrase");
const wonderchatAddress = wonderchatScript?.getAttribute("data-address");
const greeting = wonderchatScript?.getAttribute("greeting");
const dataGreeting = wonderchatScript?.getAttribute("data-greeting");
const dataIgnorePaths = wonderchatScript?.getAttribute("data-ignore-paths");
const dataShowPaths = wonderchatScript?.getAttribute("data-show-paths");
const dataHeaderHidden = wonderchatScript?.getAttribute("data-header-hidden");
const dataLanguage = wonderchatScript?.getAttribute("data-language");
const dataDefaultLanguage = wonderchatScript?.getAttribute("data-default-language");
const dataContext = wonderchatScript?.getAttribute("data-context");
const dataUserId = wonderchatScript?.getAttribute("data-user-id");
const dataUserEmail = wonderchatScript?.getAttribute("data-user-email");
const dataUserName = wonderchatScript?.getAttribute("data-user-name");
const dataCustomCss = wonderchatScript?.getAttribute("data-custom-css");
const dataWidgetMovable = wonderchatScript?.getAttribute("data-movable");
const dataIsInitiallyOpen = wonderchatScript?.getAttribute("data-initial-open");
const dataInitialOpenUrls = wonderchatScript?.getAttribute(
  "data-initial-open-urls"
);
const dataDeviceVisibility = wonderchatScript?.getAttribute(
  "data-device-visibility"
);

let widgetSize = wonderchatScript?.getAttribute("data-widget-size");
let widgetButtonSize = wonderchatScript?.getAttribute(
  "data-widget-button-size"
);

const wonderchatWrapper = document.createElement("div");
wonderchatWrapper.id = "wonderchat-wrapper";
wonderchatWrapper.style.zIndex = "-999999999999";
wonderchatWrapper.style.background = "transparent";
wonderchatWrapper.style.overflow = "hidden";
wonderchatWrapper.style.position = "fixed";
wonderchatWrapper.style.bottom = "0px";
if (placement === "left") {
  wonderchatWrapper.style.left = "0px";
} else {
  wonderchatWrapper.style.right = "0px";
}

wonderchatWrapper.style.height =
  widgetButtonSize === "extraLarge"
    ? "110px"
    : widgetButtonSize === "large"
    ? "100px"
    : "90px";
wonderchatWrapper.style.width =
  widgetButtonSize === "extraLarge"
    ? "110px"
    : widgetButtonSize === "large"
    ? "100px"
    : "90px";

// Desktop
if (window.matchMedia("(min-width: 800px)").matches) {
  if (offsetBottom) {
    wonderchatWrapper.style.marginBottom = offsetBottom;
  }
  if (offsetRight) {
    wonderchatWrapper.style.marginRight = offsetRight;
  }

  if (offsetLeft) {
    wonderchatWrapper.style.marginLeft = offsetLeft;
  }
} else {
  /* Mobile */
  if (offsetBottomMobile) {
    wonderchatWrapper.style.marginBottom = offsetBottomMobile;
  }
  if (offsetRightMobile) {
    wonderchatWrapper.style.marginRight = offsetRightMobile;
  }
  if (offsetLeftMobile) {
    wonderchatWrapper.style.marginLeft = offsetLeftMobile;
  }
}
let widgetOpen = true;

document.body.appendChild(wonderchatWrapper);

const VALID_WIDGET_SIZES = {
  small: {
    height: "680px",
    width: "384px",
  },
  normal: {
    height: "800px",
    width: "440px",
  },
  large: {
    height: "820px",
    width: "572px",
  },
};

if (!VALID_WIDGET_SIZES[widgetSize]) {
  widgetSize = "normal";
}

const iframe = document.createElement("iframe");

function changeChatbotId(newChatbotId) {
  chatbotId = newChatbotId;
  const iframe = document.getElementById("wonderchat");
  const iframeUrl = getIframeUrl(chatbotId);
  iframe.setAttribute("src", iframeUrl);
}

function getIframeUrl(chatbotId) {
  let iframeUrl = `${
    window.location.protocol === "https:" ? "https" : "http"
  }://${removeHttp(wonderchatAddress)}/widget/${chatbotId}`;
  const urlObj = new URL(iframeUrl);
  const wonderchatParams = new URLSearchParams();

  // Add current URL for embed tracking
  wonderchatParams.append("embedUrl", window.location.href);

  if (dataGreeting) {
    wonderchatParams.append("greeting", dataGreeting);
  } else if (greeting) {
    wonderchatParams.append("greeting", greeting);
  }

  if (widgetButtonSize) {
    wonderchatParams.append("widgetButtonSize", widgetButtonSize);
  }

  if (widgetSize === "large") {
    wonderchatParams.append("widgetSize", "large");
  }

  if (dataHeaderHidden) {
    wonderchatParams.append("headerHidden", true);
  }

  if (dataDefaultLanguage) {
    wonderchatParams.append("language", dataDefaultLanguage);
  } else if (dataLanguage) {
    wonderchatParams.append("language", dataLanguage);
  }

  if (dataContext) {
    wonderchatParams.append("context", dataContext);
  }

  if (dataUserId) {
    wonderchatParams.append("userId", dataUserId);
  }

  if (dataUserEmail) {
    wonderchatParams.append("userEmail", dataUserEmail);
  }

  if (dataUserName) {
    wonderchatParams.append("userName", dataUserName);
  }

  if (placement) {
    wonderchatParams.append("placement", placement);
  }

  if (dataCustomCss) {
    wonderchatParams.append("customCss", encodeURIComponent(dataCustomCss));
  }

  if (wonderchatPassphrase) {
    wonderchatParams.append(
      "passphrase",
      encodeURIComponent(wonderchatPassphrase)
    );
  }

  if (dataIsInitiallyOpen) {
    if (window.matchMedia("(min-width: 800px)").matches) {
      if (dataInitialOpenUrls) {
        const currentUrl = window.location.href;
        const urlPatterns = dataInitialOpenUrls.split(",");
        let urlMatch = false;

        for (let pattern of urlPatterns) {
          pattern = pattern.trim();
          if (pattern.endsWith("*")) {
            const trimmedPattern = pattern.slice(0, pattern.length - 1);
            if (currentUrl.startsWith(trimmedPattern)) {
              urlMatch = true;
              break;
            }
          } else {
            if (pattern.endsWith("/")) {
              pattern = pattern.slice(0, pattern.length - 1);
            }
            let url = currentUrl;
            if (url.endsWith("/")) {
              url = url.slice(0, url.length - 1);
            }

            if (pattern === url) {
              urlMatch = true;
              break;
            }
          }
        }

        if (urlMatch) {
          wonderchatParams.append("isInitiallyOpen", "true");
        }
      } else {
        wonderchatParams.append("isInitiallyOpen", "true");
      }
    }
  }

  urlObj.search = wonderchatParams.toString();

  iframeUrl = urlObj.toString();
  return iframeUrl;
}

function changeWonderchatChatbotId(chatbotId) {
  wonderchatId = chatbotId;
  const iframe = document.getElementById("wonderchat");
  const iframeUrl = getIframeUrl(chatbotId);
  iframe.setAttribute("src", iframeUrl);
}

let iframeUrl = getIframeUrl(wonderchatId);

iframe.setAttribute("src", iframeUrl);
iframe.setAttribute("frameborder", "0");
iframe.setAttribute("scrolling", "no");
iframe.setAttribute(
  "allow",
  "fullscreen; clipboard-read; clipboard-write; microphone"
);
iframe.style.width = "100%";
iframe.style.height = "100%";
iframe.style.background = "transparent";
iframe.style["min-height"] = "auto";
iframe.style["color-scheme"] = "light";
iframe.id = "wonderchat";

function shouldAppendIframe() {
  // Check if we should hide the widget based on device type
  if (dataDeviceVisibility) {
    const isMobile = window.matchMedia("(max-width: 799px)").matches;
    const isDesktop = window.matchMedia("(min-width: 800px)").matches;

    if (dataDeviceVisibility === "desktop" && isMobile) {
      return false;
    }

    if (dataDeviceVisibility === "mobile" && isDesktop) {
      return false;
    }
  }

  if (!dataIgnorePaths && !dataShowPaths) {
    if (!document.getElementById("wonderchat")) {
      wonderchatWrapper.style.zIndex = "999999999999";
      wonderchatWrapper?.appendChild(iframe);
    }
  } else {
    let paths = [];
    if (dataIgnorePaths) {
      paths = dataIgnorePaths.split(",");
    } else if (dataShowPaths) {
      paths = dataShowPaths.split(",");
    }

    let pathMatch = false;
    for (let path of paths) {
      if (path.endsWith("*")) {
        const trimmedPath = path.slice(0, path.length - 2);
        const href = window.location.href;
        if (
          dataIgnorePaths
            ? href.startsWith(trimmedPath)
            : !href.startsWith(trimmedPath)
        ) {
          const iframeToRemove = document.getElementById("wonderchat");
          if (iframeToRemove) {
            iframeToRemove.parentNode.removeChild(iframeToRemove);
            wonderchatWrapper.style.zIndex = "-999999999999";
          }
          return;
        }
      } else {
        if (path.endsWith("/")) {
          path = path.slice(0, path.length - 1);
        }
        let url = window.location.href;
        if (url.endsWith("/")) {
          url = url.slice(0, url.length - 1);
        }

        if (dataIgnorePaths && path === url) {
          const iframeToRemove = document.getElementById("wonderchat");
          if (iframeToRemove) {
            iframeToRemove.parentNode.removeChild(iframeToRemove);
            wonderchatWrapper.style.zIndex = "-999999999999";
          }
          return;
        }

        if (dataShowPaths && path === url) {
          pathMatch = true;
        }
      }
    }

    if (!pathMatch && dataShowPaths) {
      const iframeToRemove = document.getElementById("wonderchat");
      if (iframeToRemove) {
        iframeToRemove.parentNode.removeChild(iframeToRemove);
        wonderchatWrapper.style.zIndex = "-999999999999";
      }
      return;
    }

    if (!document.getElementById("wonderchat")) {
      wonderchatWrapper?.appendChild(iframe);
      wonderchatWrapper.style.zIndex = "999999999999";
    }
  }
}

shouldAppendIframe();

let oldHref = document.location.href;

// Create an observer instance to watch for URL changes
const observer = new MutationObserver(function (mutations) {
  if (oldHref !== document.location.href) {
    const newHref = document.location.href;
    oldHref = newHref;

    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage(
        JSON.stringify({
          type: "URL_CHANGE",
          payload: {
            url: newHref,
          },
        }),
        "*"
      );
    }
  }
});

// Start observing the document with the configured parameters
observer.observe(document, { subtree: true, childList: true });

// Also watch for history changes
window.addEventListener("popstate", function () {
  if (iframe?.contentWindow) {
    iframe.contentWindow.postMessage(
      JSON.stringify({
        type: "URL_CHANGE",
        payload: {
          url: this.document.location.href,
        },
      }),
      "*"
    );
  }
});

if (dataIgnorePaths || dataShowPaths) {
  window.onload = function () {
    const bodyList = document.querySelector("body");

    const observer = new MutationObserver(function (mutations) {
      if (oldHref != document.location.href) {
        oldHref = document.location.href;
        shouldAppendIframe();
        /* Changed ! your code here */
      }
    });

    const config = {
      childList: true,
      subtree: true,
    };

    observer.observe(bodyList, config);
  };
}

function waitForElm(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

function addDragger() {
  const dragger = document.createElement("div");
  dragger.style.position = "absolute";
  dragger.style.top = "20px";
  dragger.style.left = "60px";
  dragger.style.width = "220px";
  dragger.style.height = "85px";
  dragger.style.cursor = "grab";
  dragger.id = "chatbot-dragger";

  var isDragging = false;
  var startPos = { x: 0, y: 0 };
  var elementPos = { x: 0, y: 0 };

  // Mouse down event
  dragger.addEventListener("mousedown", function (e) {
    isDragging = true;
    dragger.style.top = "20px";
    dragger.style.left = "60px";
    dragger.style.width = "300px";
    dragger.style.height = "800px";

    startPos = {
      x: e.clientX,
      y: e.clientY,
    };

    // Get the element's position including margins
    var rect = wonderchatWrapper.getBoundingClientRect();

    elementPos = {
      x: placement === "left" ? rect.left : window.innerWidth - rect.right,
      y: window.innerHeight - rect.bottom,
    };
    dragger.style.cursor = "grabbing";
  });

  // Mouse move event
  document.addEventListener("mousemove", function (e) {
    if (isDragging) {
      // Calculate the new position
      var dx = startPos.x - e.clientX;
      var dy = startPos.y - e.clientY;

      // Get current margins
      var computedStyle = window.getComputedStyle(wonderchatWrapper);
      var marginLeft = parseInt(computedStyle.marginLeft) || 0;
      var marginRight = parseInt(computedStyle.marginRight) || 0;

      // Update the element's position, subtracting margins
      if (placement === "left") {
        wonderchatWrapper.style.left = elementPos.x - dx - marginLeft + "px";
      } else {
        wonderchatWrapper.style.right = elementPos.x + dx - marginRight + "px";
      }
      wonderchatWrapper.style.bottom = elementPos.y + dy + "px";
    }
  });

  // Mouse up event
  window.addEventListener("mouseup", function () {
    isDragging = false;
    dragger.style.top = "20px";
    dragger.style.left = "60px";
    dragger.style.width = "220px";
    dragger.style.height = "85px";
    dragger.style.cursor = "grab";
    // wonderchatWrapper.style.left = "0px";
  });

  wonderchatWrapper.appendChild(dragger);
}

function removeDragger() {
  wonderchatWrapper.removeChild(document.getElementById("chatbot-dragger"));
}

waitForElm("#wonderchat").then((elm) => {
  var iframe = document.getElementById("wonderchat");

  // Only add draggable if not mobile
  if (dataWidgetMovable && window.matchMedia("(min-width: 800px)").matches) {
    addDragger();
  }

  window.addEventListener(
    "message",
    function (e) {
      if (!e.origin.match(wonderchatAddress)) {
        return;
      }
      let type;
      let payload;

      try {
        const parsed = JSON.parse(e.data);
        type = parsed.type;
        payload = parsed.payload;
      } catch (err) {
        return;
      }

      switch (type) {
        case "changeWrapperMargin": {
          if (window.matchMedia("(min-width: 800px)").matches) {
            if (offsetBottom) {
              wonderchatWrapper.style.marginBottom = offsetBottom;
            }
            if (offsetRight) {
              wonderchatWrapper.style.marginRight = offsetRight;
            }
            if (offsetLeft) {
              wonderchatWrapper.style.marginLeft = offsetLeft;
            }
          } else {
            /* Mobile */
            if (offsetBottomMobile) {
              wonderchatWrapper.style.marginBottom = offsetBottomMobile;
            }
            if (offsetRightMobile) {
              wonderchatWrapper.style.marginRight = offsetRightMobile;
            }
            if (offsetLeftMobile) {
              wonderchatWrapper.style.marginLeft = offsetLeftMobile;
            }
          }
          break;
        }
        case "showChat": {
          if (payload.isOpen === true) {
            /* Non mobile, normal widget */
            if (window.matchMedia("(min-width: 800px)").matches) {
              iframe.parentNode.style.height = `min(100%, ${VALID_WIDGET_SIZES[widgetSize].height})`;
              iframe.parentNode.style.width = `min(100%, ${VALID_WIDGET_SIZES[widgetSize].width})`;
              document.body.style.overflow = oldOverflow;
            } else {
              /* Mobile, full screen widget */
              iframe.parentNode.style.height = "100%";
              iframe.parentNode.style.width = "100%";
              document.body.style.setProperty(
                "overflow",
                "hidden",
                "important"
              );
              if (offsetBottom) {
                wonderchatWrapper.style.marginBottom = "0px";
              }
              if (offsetRight) {
                wonderchatWrapper.style.marginRight = "0px";
              }
              if (offsetLeft) {
                wonderchatWrapper.style.marginLeft = "0px";
              }
            }
            widgetOpen = true;
          } else {
            iframe.parentNode.style.height =
              widgetButtonSize === "extraLarge"
                ? "110px"
                : widgetButtonSize === "large"
                ? "100px"
                : "90px";
            iframe.parentNode.style.width =
              widgetButtonSize === "extraLarge"
                ? "110px"
                : widgetButtonSize === "large"
                ? "100px"
                : "90px";
            document.body.style.overflow = oldOverflow;
            widgetOpen = false;
          }

          break;
        }
        case "chatbotLoaded":
          const chatHistory = JSON.parse(
            dataUserId
              ? this.localStorage.getItem(
                  `chatHistory_${wonderchatId}_${dataUserId}`
                )
              : localStorage.getItem(`chatHistory_${wonderchatId}`)
              ? localStorage.getItem(`chatHistory_${wonderchatId}`)
              : localStorage.getItem(`chatHistory`)
              ? localStorage.getItem(`chatHistory`)
              : "[]"
          );
          const chatlogId = dataUserId
            ? this.localStorage.getItem(
                `chatlogId_${wonderchatId}_${dataUserId}`
              )
            : localStorage.getItem(`chatlogId_${wonderchatId}`) ??
              localStorage.getItem(`chatlogId`) ??
              null;
          const userDetail = JSON.parse(
            this.localStorage.getItem(`userDetail_${wonderchatId}`) ??
              this.localStorage.getItem(`userDetail`) ??
              "{}"
          );
          const userToken = localStorage.getItem(`${chatlogId}_token`) ?? null;

          iframe.contentWindow.postMessage(
            JSON.stringify({
              type: "chatHistory",
              payload: {
                chatHistory,
                chatlogId,
                userDetail,
                userToken,
              },
            }),
            "*"
          );

          if (dataPreviewLiveChat) {
            iframe.contentWindow.postMessage(
              JSON.stringify({
                type: "previewLiveChat",
                payload: {},
              }),
              "*"
            );
          }

          iframe.contentWindow.postMessage(
            JSON.stringify({
              type: "utmParams",
              payload: {
                utm_source:
                  sessionStorage.getItem("wc_utm_source") ?? undefined,
                utm_medium:
                  sessionStorage.getItem("wc_utm_medium") ?? undefined,
                utm_campaign:
                  sessionStorage.getItem("wc_utm_campaign") ?? undefined,
                utm_term: sessionStorage.getItem("wc_utm_term") ?? undefined,
                utm_content:
                  sessionStorage.getItem("wc_utm_content") ?? undefined,
              },
            }),
            "*"
          );

          iframe.contentWindow.postMessage(
            JSON.stringify({
              type: "URL_CHANGE",
              payload: {
                url: document.location.href,
              },
            }),
            "*"
          );

          setTimeout(() => {
            // Check if we should show the greeting based on behavior
            const shouldNotGreet = (() => {
              const greetingBehavior =
                payload.greetingBehavior || "ON_PAGE_REOPEN";
              const greetingState = localStorage.getItem(
                `greeting_state_${wonderchatId}`
              );

              if (!greetingState) return false;

              const state = JSON.parse(greetingState);

              switch (greetingBehavior) {
                case "DONT_SHOW_AGAIN":
                  return state.dismissed;
                case "AFTER_ONE_DAY":
                  return (
                    state.dismissedAt &&
                    Date.now() - state.dismissedAt < 24 * 60 * 60 * 1000
                  );
                case "ON_PAGE_REOPEN":
                default:
                  return sessionStorage.getItem("shouldNotGreet") === "1";
              }
            })();

            if (
              !widgetOpen &&
              ((!shouldNotGreet && payload.shouldSpontaneouslyGreet) ||
                (dataIsInitiallyOpen &&
                  !window.matchMedia("(min-width: 800px)").matches &&
                  (!dataInitialOpenUrls ||
                    (() => {
                      const currentUrl = window.location.href;
                      const urlPatterns = dataInitialOpenUrls.split(",");
                      for (let pattern of urlPatterns) {
                        pattern = pattern.trim();
                        if (pattern.endsWith("*")) {
                          const trimmedPattern = pattern.slice(
                            0,
                            pattern.length - 1
                          );
                          if (currentUrl.startsWith(trimmedPattern)) {
                            return true;
                          }
                        } else {
                          if (pattern.endsWith("/")) {
                            pattern = pattern.slice(0, pattern.length - 1);
                          }
                          let url = currentUrl;
                          if (url.endsWith("/")) {
                            url = url.slice(0, url.length - 1);
                          }

                          if (pattern === url) {
                            return true;
                          }
                        }
                      }
                      return false;
                    })())))
            ) {
              iframe.contentWindow.postMessage(
                JSON.stringify({ type: "showGreeting" }),
                "*"
              );
              wonderchatWrapper.style.height = "185px";
              wonderchatWrapper.style.width = "min(100%, 320px)";
            }
          }, 1000);
          break;

        case "chatbotAcknowledged": {
          // Save greeting state based on behavior
          const greetingBehavior = e.greetingBehavior || "ON_PAGE_REOPEN";
          const state = {
            dismissed: true,
            dismissedAt: Date.now(),
          };

          localStorage.setItem(
            `greeting_state_${wonderchatId}`,
            JSON.stringify(state)
          );
          sessionStorage.setItem("shouldNotGreet", "1");
          break;
        }
        case "requestWidth": {
          if (window.matchMedia("(min-width: 800px)").matches) {
            iframe.contentWindow.postMessage(
              JSON.stringify({ type: `popup` }),
              "*"
            );
          } else {
            iframe.contentWindow.postMessage(
              JSON.stringify({ type: "fullscreen" }),
              "*"
            );
          }
          break;
        }
        case "chatHistory": {
          const { chatHistory, chatlogId } = payload;
          if (dataUserId) {
            this.localStorage.setItem(
              `chatHistory_${wonderchatId}_${dataUserId}`,
              JSON.stringify(chatHistory)
            );
          } else {
            this.localStorage.setItem(
              `chatHistory_${wonderchatId}`,
              JSON.stringify(chatHistory)
            );
          }

          if (chatlogId) {
            if (dataUserId) {
              this.localStorage.setItem(
                `chatlogId_${wonderchatId}_${dataUserId}`,
                chatlogId
              );
            } else {
              this.localStorage.setItem(`chatlogId_${wonderchatId}`, chatlogId);
            }
          }
          break;
        }

        case "clearChatHistory": {
          const chatlogId = this.localStorage.getItem(
            `chatlogId_${wonderchatId}`
          );
          this.localStorage.removeItem(`chatlogId`);
          this.localStorage.removeItem(`chatHistory`);
          // this.localStorage.removeItem(`userDetail`);
          this.localStorage.removeItem(`chatlogId_${wonderchatId}`);
          this.localStorage.removeItem(
            `chatlogId_${wonderchatId}_${dataUserId}`
          );
          this.localStorage.removeItem(`chatHistory_${wonderchatId}`);
          this.localStorage.removeItem(
            `chatHistory_${wonderchatId}_${dataUserId}`
          );
          // this.localStorage.removeItem(`userDetail_${wonderchatId}`);
          this.localStorage.removeItem(`${chatlogId}_token`);
          break;
        }

        /* 
          detail: 'EMAIL' | 'PHONE_NUMBER' | 'NAME'
        */

        case "userDetailCollected": {
          const { detail, value } = payload;
          const savedDetail =
            this.localStorage.getItem(`userDetail_${wonderchatId}`) ??
            this.localStorage.getItem(`userDetail`) ??
            "{}";
          try {
            const parsed = JSON.parse(savedDetail);
            const updatedDetail = { ...parsed, [detail]: value || true };
            this.localStorage.setItem(
              `userDetail_${wonderchatId}`,
              JSON.stringify(updatedDetail)
            );
          } catch (err) {
            console.log(err);
          }
          break;
        }

        case "linkClick": {
          const { href } = payload;
          window.location.href = href;
          break;
        }

        case "chatlogToken": {
          const { chatlogId, userToken } = payload;
          this.localStorage.setItem(`${chatlogId}_token`, userToken);
        }
      }
    },
    false
  );
});
