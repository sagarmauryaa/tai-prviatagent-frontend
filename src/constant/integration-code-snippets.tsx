import { BRAND_PAGE_URL, CHATBOT_URL, V4_APIS } from "@/utils/config";

// export const IntegrationCode = (key: string) => {
//   return `
// <script>
//   document.addEventListener('DOMContentLoaded', async function () {

//   // ======= Chat Storage Functions =======

// var EXPIRY_MINUTES = 30; // auto-clear after 30 minutes

// function getStorageKey(base) {
//     var pathname = window.location.pathname;
//     var search = window.location.search;
//     return base + '_' + btoa(pathname + search);
// }

// function saveLocalChat(chatArray) {
//     var key = getStorageKey('chatbot_history');
//     localStorage.setItem(key, JSON.stringify(chatArray));
//     setExpiry();
// }

// function getLocalChat() {
//     var key = getStorageKey('chatbot_history');
//     var expiry = parseInt(localStorage.getItem(getStorageKey('chatbot_expiry')) || '0', 10);

//     if (expiry && Date.now() > expiry) {
//         clearChatStorage();
//         return [];
//     }

//     try {
//         var data = localStorage.getItem(key);
//         return data ? JSON.parse(data) : [];
//     } catch (e) {
//         return [];
//     }
// }

// function setExpiry() {
//     var key = getStorageKey('chatbot_expiry');
//     var expiryTime = Date.now() + EXPIRY_MINUTES * 60 * 1000;
//     localStorage.setItem(key, expiryTime.toString());
// }

// function clearChatStorage() {
//     localStorage.removeItem(getStorageKey('chatbot_history'));
//     localStorage.removeItem(getStorageKey('chatbot_expiry'));
// }

// // Auto-expiry check every minute
// setInterval(function () {
//     var expiry = parseInt(localStorage.getItem(getStorageKey('chatbot_expiry')) || '0', 10);
//     if (expiry && Date.now() > expiry) {
//         clearChatStorage();
//     }
// }, 60 * 1000);


//     const checkChatbotVisibilityToShow = async () => {
//       const response = await fetch('${V4_APIS}/chat-bot/check-visibility/${key}');
//   if (!response.ok) {
//     return;
//   }
//   const { data } = await response.json();
//   if (data?.chatbotVisibility === false || data?.chatbotVisibility === "false") { return; }
// };
// checkChatbotVisibilityToShow();
// const startChatButton = document.createElement('button'); startChatButton.id = 'start-chat'; startChatButton.style.position = 'fixed'; startChatButton.style.bottom = '20px'; startChatButton.style.right = '20px'; startChatButton.style.color = 'white'; startChatButton.style.border = 'none'; startChatButton.style.padding = '10px'; startChatButton.style.cursor = 'pointer'; startChatButton.style.fontSize = '16px'; startChatButton.style.zIndex = '9999'; startChatButton.style.width = '48px'; startChatButton.style.height = '48px'; startChatButton.style.transition = '.1s'; startChatButton.style.borderRadius = '8px'; startChatButton.style.backgroundColor = '#0068B1'; startChatButton.style.backgroundImage = "url('https://stage.tellofy.com/_next/static/media/chatbot-message.5c5454a6.svg')"; startChatButton.style.backgroundPosition = '50%'; startChatButton.style.backgroundRepeat = 'no-repeat'; startChatButton.style.margin = '0 2px 2px 0';

// const mediaStartStyle = document.createElement('style');
// mediaStartStyle.type = 'text/css';
// mediaStartStyle.innerText = \`
//         @media (max-width: 767px) {
//         #start-chat {
//         right: 20px !important;
//       }
//     }
//   \`;
// document.head.appendChild(mediaStartStyle);

// document.body.appendChild(startChatButton);

// const closeChatButton = document.createElement('button'); closeChatButton.id = 'close-chat'; closeChatButton.style.display = 'none'; closeChatButton.style.position = 'fixed'; closeChatButton.style.bottom = '20px'; closeChatButton.style.right = '20px'; closeChatButton.style.backgroundColor = '#0068B1'; closeChatButton.style.color = 'white'; closeChatButton.style.border = 'none'; closeChatButton.style.padding = '10px'; closeChatButton.style.borderRadius = '50%'; closeChatButton.style.cursor = 'pointer'; closeChatButton.style.fontSize = '16px'; closeChatButton.style.backgroundImage = "url('https://stage.tellofy.com/_next/static/media/chatbot-cross.2c8d718b.svg')"; closeChatButton.style.width = '48px'; closeChatButton.style.height = '48px';
// closeChatButton.style.zIndex = '9999'; closeChatButton.style.transition = '.1s'; closeChatButton.style.borderRadius = '8px'; closeChatButton.style.backgroundPosition = '50%'; closeChatButton.style.backgroundRepeat = 'no-repeat'; closeChatButton.style.margin = '0 2px 2px 0';

// const mediaCloseStyle = document.createElement('style');
// mediaCloseStyle.type = 'text/css';
// mediaCloseStyle.innerText =\`
//       @media (max-width: 767px) {
//        #close-chat {
//             right: 20px !important;
//         }
//       }
//    \`;

// document.head.appendChild(mediaCloseStyle);


// document.body.appendChild(closeChatButton);

// let chatbotIframe = null;

// const shimmerContainer = document.createElement('div');

// function AppendShimmerInBody() {
//   shimmerContainer.className = 'chatbot-container';
//   shimmerContainer.style.position = 'fixed';
//   shimmerContainer.style.bottom = '80px';
//   shimmerContainer.style.right = '100px';
//   shimmerContainer.style.width = '90vw';
//   shimmerContainer.style.maxWidth = '400px';
//   shimmerContainer.style.maxHeight = '560px';
//   shimmerContainer.style.height = '90vh';
//   shimmerContainer.style.display = 'flex';
//   shimmerContainer.style.alignItems = 'flex-end';
//   shimmerContainer.style.justifyContent = 'flex-end';
//   shimmerContainer.style.flexDirection = 'column';
//   shimmerContainer.style.zIndex = '9999';
//   shimmerContainer.style.borderRadius = '16px';
//   shimmerContainer.style.overflow = 'hidden';

//   const mediaStyle = document.createElement('style');
//   mediaStyle.type = 'text/css';
//   mediaStyle.innerText = \`
//     @media (max-width: 767px) {
//       .chatbot-container {
//         max-width: 100% !important;
//         width: 90% !important;
//         left: 0;
//         margin: 0 auto !important;
//         right: 0 !important;
//         max-height: 506px !important;
//       }
//     }
//    \`;
//   document.head.appendChild(mediaStyle);

//   const chatbotSkeleton = document.createElement('div');
//   chatbotSkeleton.className = 'chatbot-skeleton loading';
//   chatbotSkeleton.style.width = '400px';
//   chatbotSkeleton.style.height = '560px';
//   chatbotSkeleton.style.padding = '16px';
//   chatbotSkeleton.style.display = 'flex';
//   chatbotSkeleton.style.flexDirection = 'column';
//   chatbotSkeleton.style.gap = '12px';
//   chatbotSkeleton.style.background = '#fff';
//   chatbotSkeleton.style.borderRadius = '4px';
//   chatbotSkeleton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
//   chatbotSkeleton.style.position = 'absolute';
//   chatbotSkeleton.style.top = '0';
//   chatbotSkeleton.style.left = '0';
//   chatbotSkeleton.style.width = '100%';
//   chatbotSkeleton.style.height = '100%';
//   chatbotSkeleton.style.background = 'white';
//   chatbotSkeleton.style.zIndex = '1';

//   const shimmerHeader = document.createElement('div');
//   shimmerHeader.className = 'shimmer-header';
//   shimmerHeader.style.width = '100%';
//   shimmerHeader.style.height = '40px';
//   shimmerHeader.style.background = 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)';
//   shimmerHeader.style.backgroundSize = '200% 100%';
//   shimmerHeader.style.animation = 'shimmer 1.5s infinite';
//   shimmerHeader.style.borderRadius = '4px';

//   const shimmerContent = document.createElement('div');
//   shimmerContent.className = 'shimmer-content';
//   shimmerContent.style.flex = '1';
//   shimmerContent.style.width = '100%';
//   shimmerContent.style.height = '100%';
//   shimmerContent.style.background = 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)';
//   shimmerContent.style.backgroundSize = '200% 100%';
//   shimmerContent.style.animation = 'shimmer 1.5s infinite';
//   shimmerContent.style.borderRadius = '8px';

//   const shimmerInput = document.createElement('div');
//   shimmerInput.className = 'shimmer-input';
//   shimmerInput.style.width = '100%';
//   shimmerInput.style.height = '40px';
//   shimmerInput.style.background = 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)';
//   shimmerInput.style.backgroundSize = '200% 100%';
//   shimmerInput.style.animation = 'shimmer 1.5s infinite';
//   shimmerInput.style.borderRadius = '4px';

//   chatbotSkeleton.appendChild(shimmerHeader);
//   chatbotSkeleton.appendChild(shimmerContent);
//   chatbotSkeleton.appendChild(shimmerInput);

//   shimmerContainer.appendChild(chatbotSkeleton);
//   document.body.appendChild(shimmerContainer);

//   const styleSheet = document.createElement('style');
//   styleSheet.type = 'text/css';
//   styleSheet.innerText = \`
//     @keyframes shimmer {
//       0% {
//         background-position: -200% 0;
//       }
//       100% {
//         background-position: 200% 0;
//       }
//     }
//     \`;
//   document.head.appendChild(styleSheet);

//   const shimmerMediaStyle = document.createElement('style');
//   shimmerMediaStyle.type = 'text/css';
//   shimmerMediaStyle.innerText = \`
//     @media (max-width: 767px) {
//       .chatbot-skeleton{
//         max-width: 100% !important;
//         width: 100% !important;
//         left: 5px !important;
//         margin: 0 auto !important;
//         height: 90% !important;
//         right: 0 !important;
//       }
//     }
//     \`;
//   document.head.appendChild(shimmerMediaStyle);
// }

// function hideShimmer() {
//   shimmerContainer.style.display = 'none';
// }

// startChatButton.onclick = function () {
//   if (!chatbotIframe) {
//     AppendShimmerInBody();

//     const widget = document.createElement("div"); widget.className = "chatbot-container";

//     chatbotIframe = document.createElement('iframe');
//     const iframeStyle = chatbotIframe.style; iframeStyle.zIndex = 9999; iframeStyle.boxSizing = "border-box"; iframeStyle.position = "fixed"; iframeStyle.right = "20px"; iframeStyle.bottom = "80px"; iframeStyle.height = "90vh"; iframeStyle.border = 0; iframeStyle.margin = 0; iframeStyle.padding = 0; iframeStyle.width = "90vw"; iframeStyle.maxWidth = "400px"; iframeStyle.borderRadius = "16px"; iframeStyle.maxHeight = "560px";

//     const iframeMediaStyle = document.createElement('style');
//     iframeMediaStyle.type = 'text/css';
//     iframeMediaStyle.innerText = \`
//           @media (max-width: 767px) {
//           iframe{
//            max-width: 100% !important;
//                   width: 90% !important;
//                   left: 0;
//                   margin: 0 auto !important;
//                          right: 0 !important;
//           }                 
//           }
//         \`;

//     document.head.appendChild(iframeMediaStyle);

//     chatbotIframe.src = '${CHATBOT_URL}?brandId=${key}';
//     chatbotIframe.alt = "Web site is not available";
//     chatbotIframe.allow = "microphone";
//     widget.appendChild(chatbotIframe);
//     document.body.appendChild(chatbotIframe);

//     chatbotIframe.onload = function () {
//       shimmerContainer.style.display = 'none';
//     };

//     closeChatButton.style.display = 'inline';
//     startChatButton.style.display = 'none';
//   }
// };

// closeChatButton.onclick = function () {
//   if (chatbotIframe) {
//     chatbotIframe.style.display = 'none';
//     AppendShimmerInBody();
//     closeChatButton.disabled = true;
//     const message = { type: 'endChat' };

//     chatbotIframe.contentWindow.postMessage(message, '${CHATBOT_URL}');

//     const handleMessage = (event) => {
//       const { type } = event.data;

//       if (type === 'chatHistorySaved') {
//         shimmerContainer.style.display = "none";
//         chatbotIframe.remove();
//         closeChatButton.disabled = false;
//         chatbotIframe = null;

//         closeChatButton.style.display = 'none';
//         startChatButton.style.display = 'inline';

//         window.removeEventListener('message', handleMessage);
//       }
//     };

//     window.addEventListener('message', handleMessage);
//   }
// };
//   });
//   </script>
//   `;
// }

export const IntegrationCode = (key: string) => {
  return `document.addEventListener('DOMContentLoaded', async function () {

  // ======= Chat Storage Functions =======

  var EXPIRY_MINUTES = 30; // auto-clear after 30 minutes


function getStorageKey(base) {
  var host = window.location.host; 
  return base + '_' + btoa(host).replace(/=/g, '');
}

 
  function saveLocalChat(chatId, chatArray) {
     const key = getStorageKey('chatbot_history');
 
     try {
         const raw = localStorage.getItem(key);
         const store = raw ? JSON.parse(raw) : {};
 
         store[chatId] = {
             messages: chatArray
         };
 
         localStorage.setItem(key, JSON.stringify(store));
         setExpiry();
     } catch (e) {
         clearChatStorage();
     }
 }
 
 
 function getLocalChat(chatId) {
     const key = getStorageKey('chatbot_history');
 
     const expiry = parseInt(
         localStorage.getItem(getStorageKey('chatbot_expiry')) || '0',
         10
     );
 
     if (expiry && Date.now() > expiry) {
         clearChatStorage();
         return [];
     }
 
     try {
         const raw = localStorage.getItem(key);
         if (!raw) return [];
 
         const store = JSON.parse(raw);
 
         if (!store[chatId]) return [];
 
         return Array.isArray(store[chatId].messages)
             ? store[chatId].messages
             : [];
     } catch (e) {
         return [];
     }
 }

  function setExpiry() {
    var key = getStorageKey('chatbot_expiry');
    var expiryTime = Date.now() + EXPIRY_MINUTES * 60 * 1000;
    localStorage.setItem(key, expiryTime.toString());
  }

  function clearChatStorage() {
    localStorage.removeItem(getStorageKey('chatbot_history'));
    localStorage.removeItem(getStorageKey('chatbot_expiry'));
  }

  // Auto-expiry check every minute
  setInterval(function () {
    var expiry = parseInt(localStorage.getItem(getStorageKey('chatbot_expiry')) || '0', 10);
    if (expiry && Date.now() > expiry) {
      clearChatStorage();
    }
  }, 60 * 1000);


  const checkChatbotVisibilityToShow = async () => {
    const response = await fetch('${V4_APIS}/chat-bot/check-visibility/${key}');
    if (!response.ok) {
      return;
    }
    const { data } = await response.json();
    if (data?.chatbotVisibility === false || data?.chatbotVisibility === "false") { return; }
  };
  checkChatbotVisibilityToShow();
  const startChatButton = document.createElement('button'); startChatButton.id = 'start-chat'; startChatButton.style.position = 'fixed'; startChatButton.style.bottom = '20px'; startChatButton.style.right = '20px'; startChatButton.style.color = 'white'; startChatButton.style.border = 'none'; startChatButton.style.padding = '10px'; startChatButton.style.cursor = 'pointer'; startChatButton.style.fontSize = '16px'; startChatButton.style.zIndex = '9999'; startChatButton.style.width = '48px'; startChatButton.style.height = '48px'; startChatButton.style.transition = '.1s'; startChatButton.style.borderRadius = '8px'; startChatButton.style.backgroundColor = '#0068B1'; startChatButton.style.backgroundImage = "url('https://stage.tellofy.com/_next/static/media/chatbot-message.5c5454a6.svg')"; startChatButton.style.backgroundPosition = '50%'; startChatButton.style.backgroundRepeat = 'no-repeat'; startChatButton.style.margin = '0 2px 2px 0';

  const mediaStartStyle = document.createElement('style');
  mediaStartStyle.type = 'text/css';
  mediaStartStyle.innerText = \`
        @media (max-width: 767px) {
        #start-chat {
        right: 20px !important;
      }
    }
  \`;
document.head.appendChild(mediaStartStyle);

document.body.appendChild(startChatButton);

const closeChatButton = document.createElement('button'); closeChatButton.id = 'close-chat'; closeChatButton.style.display = 'none'; closeChatButton.style.position = 'fixed'; closeChatButton.style.bottom = '575px'; closeChatButton.style.right = '20px'; closeChatButton.style.backgroundColor = '#0068B1'; closeChatButton.style.color = 'white'; closeChatButton.style.border = 'none'; closeChatButton.style.padding = '10px'; closeChatButton.style.borderRadius = '50%'; closeChatButton.style.cursor = 'pointer'; closeChatButton.style.fontSize = '16px'; closeChatButton.style.backgroundImage = \`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M10.1884 0.166687L6.00008 4.35502L1.81175 0.166687L0.166748 1.81169L4.35508 6.00002L0.166748 10.1884L1.81175 11.8334L6.00008 7.64502L10.1884 11.8334L11.8334 10.1884L7.64508 6.00002L11.8334 1.81169L10.1884 0.166687Z' fill='%23fff'/%3E%3C/svg%3E")\`; closeChatButton.style.width = '48px'; closeChatButton.style.height = '48px';
closeChatButton.style.zIndex = '9999'; closeChatButton.style.transition = '.1s'; closeChatButton.style.borderRadius = '8px'; closeChatButton.style.backgroundPosition = '50%'; closeChatButton.style.backgroundRepeat = 'no-repeat'; closeChatButton.style.margin = '0 2px 2px 0';

const mediaCloseStyle = document.createElement('style');
mediaCloseStyle.type = 'text/css';
mediaCloseStyle.innerText =\`
      @media (max-width: 767px) {
       #close-chat {
            right: 20px !important;
        }
      }
   \`;

document.head.appendChild(mediaCloseStyle);


document.body.appendChild(closeChatButton);

let chatbotIframe = null;

const shimmerContainer = document.createElement('div');

function AppendShimmerInBody() {
  shimmerContainer.className = 'chatbot-container';
  shimmerContainer.style.position = 'fixed';
  shimmerContainer.style.bottom = '10px';
  shimmerContainer.style.right = '20px';
  shimmerContainer.style.width = '90vw';
  shimmerContainer.style.maxWidth = '400px';
  shimmerContainer.style.maxHeight = '560px';
  shimmerContainer.style.height = '90vh';
  shimmerContainer.style.display = 'flex';
  shimmerContainer.style.alignItems = 'flex-end';
  shimmerContainer.style.justifyContent = 'flex-end';
  shimmerContainer.style.flexDirection = 'column';
  shimmerContainer.style.zIndex = '9999';
  shimmerContainer.style.borderRadius = '16px';
  shimmerContainer.style.overflow = 'hidden';

  const mediaStyle = document.createElement('style');
  mediaStyle.type = 'text/css';
  mediaStyle.innerText = \`
    @media (max-width: 767px) {
      .chatbot-container {
        max-width: 100% !important;
        width: 90% !important;
        left: 0;
        margin: 0 auto !important;
        right: 0 !important;
        max-height: 506px !important;
      }
    }
   \`;
  document.head.appendChild(mediaStyle);

  const chatbotSkeleton = document.createElement('div');
  chatbotSkeleton.className = 'chatbot-skeleton loading';
  chatbotSkeleton.style.width = '400px';
  chatbotSkeleton.style.height = '560px';
  chatbotSkeleton.style.padding = '16px';
  chatbotSkeleton.style.display = 'flex';
  chatbotSkeleton.style.flexDirection = 'column';
  chatbotSkeleton.style.gap = '12px';
  chatbotSkeleton.style.background = '#fff';
  chatbotSkeleton.style.borderRadius = '4px';
  chatbotSkeleton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  chatbotSkeleton.style.position = 'absolute';
  chatbotSkeleton.style.top = '0';
  chatbotSkeleton.style.left = '0';
  chatbotSkeleton.style.width = '100%';
  chatbotSkeleton.style.height = '100%';
  chatbotSkeleton.style.background = 'white';
  chatbotSkeleton.style.zIndex = '1';

  const shimmerHeader = document.createElement('div');
  shimmerHeader.className = 'shimmer-header';
  shimmerHeader.style.width = '100%';
  shimmerHeader.style.height = '40px';
  shimmerHeader.style.background = 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)';
  shimmerHeader.style.backgroundSize = '200% 100%';
  shimmerHeader.style.animation = 'shimmer 1.5s infinite';
  shimmerHeader.style.borderRadius = '4px';

  const shimmerContent = document.createElement('div');
  shimmerContent.className = 'shimmer-content';
  shimmerContent.style.flex = '1';
  shimmerContent.style.width = '100%';
  shimmerContent.style.height = '100%';
  shimmerContent.style.background = 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)';
  shimmerContent.style.backgroundSize = '200% 100%';
  shimmerContent.style.animation = 'shimmer 1.5s infinite';
  shimmerContent.style.borderRadius = '8px';

  const shimmerInput = document.createElement('div');
  shimmerInput.className = 'shimmer-input';
  shimmerInput.style.width = '100%';
  shimmerInput.style.height = '40px';
  shimmerInput.style.background = 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)';
  shimmerInput.style.backgroundSize = '200% 100%';
  shimmerInput.style.animation = 'shimmer 1.5s infinite';
  shimmerInput.style.borderRadius = '4px';

  chatbotSkeleton.appendChild(shimmerHeader);
  chatbotSkeleton.appendChild(shimmerContent);
  chatbotSkeleton.appendChild(shimmerInput);

  shimmerContainer.appendChild(chatbotSkeleton);
  document.body.appendChild(shimmerContainer);

  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = \`
    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }
    \`;
  document.head.appendChild(styleSheet);

  const shimmerMediaStyle = document.createElement('style');
  shimmerMediaStyle.type = 'text/css';
  shimmerMediaStyle.innerText = \`
    @media (max-width: 767px) {
      .chatbot-skeleton{
        max-width: 100% !important;
        width: 100% !important;
        left: 5px !important;
        margin: 0 auto !important;
        height: 90% !important;
        right: 0 !important;
      }
    }
    \`;
  document.head.appendChild(shimmerMediaStyle);
}

function hideShimmer() {
  shimmerContainer.style.display = 'none';
}

startChatButton.onclick = function () {
  if (!chatbotIframe) {
    AppendShimmerInBody();

    const widget = document.createElement("div"); widget.className = "chatbot-container";

    chatbotIframe = document.createElement('iframe');
    const iframeStyle = chatbotIframe.style; iframeStyle.zIndex = 9999; iframeStyle.boxSizing = "border-box"; iframeStyle.position = "fixed"; iframeStyle.right = "20px"; iframeStyle.bottom = "10px"; iframeStyle.height = "90vh"; iframeStyle.border = 0; iframeStyle.margin = 0; iframeStyle.padding = 0; iframeStyle.width = "90vw"; iframeStyle.maxWidth = "400px"; iframeStyle.borderRadius = "16px"; iframeStyle.maxHeight = "560px";

    const iframeMediaStyle = document.createElement('style');
    iframeMediaStyle.type = 'text/css';
    iframeMediaStyle.innerText = \`
          @media (max-width: 767px) {
          iframe{
           max-width: 100% !important;
                  width: 90% !important;
                  left: 0;
                  margin: 0 auto !important;
                         right: 0 !important;
          }                 
          }
        \`;

    document.head.appendChild(iframeMediaStyle);

    chatbotIframe.src = '${CHATBOT_URL}?brandId=${key}';
    chatbotIframe.alt = "Web site is not available";
    chatbotIframe.allow = "microphone";
    widget.appendChild(chatbotIframe);
    document.body.appendChild(chatbotIframe);

    chatbotIframe.onload = function () {
      shimmerContainer.style.display = 'none';
    };

    closeChatButton.style.display = 'inline';
    startChatButton.style.display = 'none';
  }
      else {
                const chatId = '${key}';
                const chat = getLocalChat(chatId);

                if (chatbotIframe?.contentWindow) {
                    chatbotIframe.contentWindow.postMessage(
                        { type: "CHAT_RESPONSE", chatId, payload: chat },
                        "*"
                    );
                    return;
                }
            }
};

function handleMessage(event) {
  var data = event.data;
  var type = data.type;
  var chatId = data.chatId;
  var payload = data.payload;

  var iframe = chatbotIframe;
  if (!iframe) return;
  if (event.source !== iframe.contentWindow) return;

  switch (type) {
    case "SAVE_CHAT":
      if (!chatId || !Array.isArray(payload)) return;
      saveLocalChat(chatId, payload);
      iframe.contentWindow.postMessage(
        { type: "SAVE_CHAT_SUCCESS", chatId: chatId },
        "*"
      );
      break;

    case "GET_CHAT":
      if (!chatId) return;
      var chat = getLocalChat(chatId);
      iframe.contentWindow.postMessage(
        { type: "CHAT_RESPONSE", chatId: chatId, payload: chat },
        "*"
      );
      break;

    case "CLEAR_CHAT":
      clearChatStorage();
      break;

    default:
      console.warn("Unknown message type:", type);
  }
}

        window.addEventListener('message', handleMessage);
 
         closeChatButton.onclick = function () {
            if (!chatbotIframe?.contentWindow) return;

            closeChatButton.disabled = true;
 
            chatbotIframe.contentWindow.postMessage(
                { type: "END_CHAT" },
               '${CHATBOT_URL}'
            );
 
            AppendShimmerInBody();
 
            setTimeout(() => {
                chatbotIframe.remove();
                chatbotIframe = null;

                shimmerContainer.style.display = "none";

                closeChatButton.style.display = "none";
                startChatButton.style.display = "inline";
                closeChatButton.disabled = false;
            }, 150); 
        };

    });`;
}

export const reviewCodeScript = (id: string, apikey: string, url: string) => {
  return `<div>
      <script
        language="JavaScript"
        id="widget6"
        src="https://stagechat.tellofy.com/widgets/widget6/widget6.js"
        apiKey="${apikey}"
        brandId="${id}"
        brandUrl="${BRAND_PAGE_URL}/brand/${url}"
        apiUrl="${V4_APIS}/brand/rating-reviews-stats"
        async=true
        type="text/javascript"
      ></script>
    </div> `
}