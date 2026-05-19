'use client';
import { BRAND_PAGE_URL, CHATBOT_URL, SUPPORT_CHATBOT, BACKEND_ENDPOINT } from '@/utils/config';
import { useEffect } from 'react'
import { clearChatStorage, saveLocalChat } from './chat-storage';

const ChatBot = () => {
    async function initChatBot(id: string) {
        console.log('Initializing ChatBot with ID:', id);
        const checkChatbotVisibilityToShow = async () => {
            const response = await fetch(`${BACKEND_ENDPOINT}/chat-bot/check-visibility/${id}`);
            if (!response.ok) {
                return;
            }
            const { data } = await response.json();
            if (data?.chatbotVisibility === false || data?.chatbotVisibility === "false") { return; }
        };
        checkChatbotVisibilityToShow();
        const startChatButton = document.createElement('button');
        if (!startChatButton) return;
        startChatButton.id = 'start-chat';
        startChatButton.style.position = 'fixed';
        startChatButton.style.top = '24px';
        startChatButton.style.right = '120px';
        startChatButton.style.color = 'white';
        startChatButton.style.border = 'none';
        startChatButton.style.padding = '10px';
        startChatButton.style.cursor = 'pointer';
        startChatButton.style.fontSize = '16px';
        startChatButton.style.zIndex = '9';
        startChatButton.style.width = '36px';
        startChatButton.style.height = '36px';
        startChatButton.style.border = '2px solid #0068B1';
        startChatButton.style.borderRadius = '100px';
        startChatButton.style.transition = '.1s';
        startChatButton.style.color = '#0068B1';
        startChatButton.style.fontSize = '18px';
        startChatButton.style.fontWeight = '700';
        startChatButton.style.backgroundColor = '#fff';
        // startChatButton.style.backgroundColor = '#0068B1';
        // startChatButton.style.backgroundImage = `url('${BRAND_PAGE_URL}/_next/static/media/chatbot-message.5c5454a6.svg')`;
        // startChatButton.style.backgroundPosition = '50%';
        startChatButton.style.backgroundRepeat = 'no-repeat'; startChatButton.style.margin = '0 2px 2px 0';
        startChatButton.innerText = '?';
        startChatButton.title = 'Support';

        const mediaStartStyle = document.createElement('style');
        mediaStartStyle.type = 'text/css';
        mediaStartStyle.innerText = `
        #start-chat{
        display:flex;
        justify-content:center;
        align-items:center;
        }
            @media (max-width: 767px) {
                #start-chat {
                       top: 14px !important;
        right: 114px !important;
                }
                }
            `;
        document.head.appendChild(mediaStartStyle);

        document.body.appendChild(startChatButton);

        const closeChatButton = document.createElement('button');
        closeChatButton.id = 'close-chat';
        closeChatButton.style.display = 'none';
        closeChatButton.style.position = 'fixed';
        closeChatButton.style.bottom = '575px';
        closeChatButton.style.right = '20px';
        closeChatButton.style.backgroundColor = '#0068B1';
        closeChatButton.style.color = 'white';
        closeChatButton.style.border = 'none';
        closeChatButton.style.padding = '10px';
        closeChatButton.style.borderRadius = '50%';
        closeChatButton.style.cursor = 'pointer';
        closeChatButton.style.fontSize = '16px';
        closeChatButton.style.backgroundImage = `url('data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M10.1884 0.166687L6.00008 4.35502L1.81175 0.166687L0.166748 1.81169L4.35508 6.00002L0.166748 10.1884L1.81175 11.8334L6.00008 7.64502L10.1884 11.8334L11.8334 10.1884L7.64508 6.00002L11.8334 1.81169L10.1884 0.166687Z' fill='%23fff'/%3E%3C/svg%3E')`;
        closeChatButton.style.width = '48px';
        closeChatButton.style.height = '48px';

        closeChatButton.style.zIndex = '9999';
        closeChatButton.style.transition = '.1s';
        closeChatButton.style.borderRadius = '8px';
        closeChatButton.style.backgroundPosition = '50%';
        closeChatButton.style.backgroundRepeat = 'no-repeat';
        closeChatButton.style.margin = '0 2px 2px 0';

        const mediaCloseStyle = document.createElement('style');
        mediaCloseStyle.type = 'text/css';
        mediaCloseStyle.innerText = `
            @media (max-width: 767px) {
                #close - chat {
                right: 20px !important;
        }
      }
            `;

        document.head.appendChild(mediaCloseStyle);


        document.body.appendChild(closeChatButton);

        let chatbotIframe: HTMLIFrameElement | null = null;

        const shimmerContainer = document.createElement('div');

        function AppendShimmerInBody() {
            shimmerContainer.className = 'chatbot-container';
            shimmerContainer.style.position = 'fixed';
            shimmerContainer.style.bottom = '10px';
            shimmerContainer.style.right = '100px';
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
            mediaStyle.innerText = `
            @media (max-width: 767px) {
      .chatbot - container {
                max - width: 100% !important;
            width: 90% !important;
            left: 0;
            margin: 0 auto !important;
            right: 0 !important;
            max-height: 506px !important;
      }
    }
            `;
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
            chatbotSkeleton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'; ""
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
            styleSheet.innerText = `
            @keyframes shimmer {
                0 % {
                    background- position: -200% 0;
      }
            100% {
                background - position: 200% 0;
      }
    }
            `;
            document.head.appendChild(styleSheet);

            const shimmerMediaStyle = document.createElement('style');
            shimmerMediaStyle.type = 'text/css';
            shimmerMediaStyle.innerText = `
            @media (max-width: 767px) {
      .chatbot - skeleton{
                max - width: 100% !important;
            width: 100% !important;
            left: 5px !important;
            margin: 0 auto !important;
            height: 90% !important;
            right: 0 !important;
      }
    }
            `;
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
                const iframeStyle = chatbotIframe.style;
                iframeStyle.zIndex = "9999";
                iframeStyle.boxSizing = "border-box";
                iframeStyle.position = "fixed";
                iframeStyle.right = "20px";
                iframeStyle.bottom = "10px";
                iframeStyle.height = "90vh";
                iframeStyle.border = "0";
                iframeStyle.margin = "0";
                iframeStyle.padding = "0";
                iframeStyle.width = "90vw";
                iframeStyle.maxWidth = "400px";
                iframeStyle.borderRadius = "16px";
                iframeStyle.maxHeight = "560px";

                const iframeMediaStyle = document.createElement('style');
                iframeMediaStyle.type = 'text/css';
                iframeMediaStyle.innerText = `
            @media (max-width: 767px) {
                iframe{
                max - width: 100% !important;
            width: 90% !important;
            left: 0;
            margin: 0 auto !important;
            right: 0 !important;
          }                 
          }
            `;

                document.head.appendChild(iframeMediaStyle);

                chatbotIframe.src = `${CHATBOT_URL}?brandId=${id}`;
                // chatbotIframe.ariaLabel = "Web site is not available";
                chatbotIframe.allow = "microphone";
                widget.appendChild(chatbotIframe);
                document.body.appendChild(chatbotIframe);

                chatbotIframe.onload = function () {
                    shimmerContainer.style.display = 'none';
                };

                closeChatButton.style.display = 'inline';
                startChatButton.style.display = 'none';
            }
        };

        closeChatButton.onclick = function () {
            if (chatbotIframe) {
                chatbotIframe.style.display = 'none';
                AppendShimmerInBody();
                closeChatButton.disabled = true;
                const message = { type: 'endChat' };

                chatbotIframe.contentWindow?.postMessage(message, `${CHATBOT_URL}`);
                const handleMessage = (event: MessageEvent) => {
                    const { type, payload, chatId } = event.data;

                    // Optional: validate that message comes from your iframe
                    if (chatbotIframe && event.source !== chatbotIframe.contentWindow) {
                        console.warn('Blocked message from unknown source:', event.origin);
                        return;
                    }


                    switch (type) {
                        case 'SAVE_CHAT':
                            saveLocalChat(chatId, payload);
                            // Respond to iframe if needed
                            chatbotIframe?.contentWindow?.postMessage({ type: 'chatHistorySaved' }, '*');
                            break;

                        case 'CLEAR_CHAT':
                            clearChatStorage();
                            break;

                        case 'chatHistorySaved':
                            // UI updates after iframe confirms chat saved
                            if (shimmerContainer) shimmerContainer.style.display = 'none';

                            if (chatbotIframe) {
                                chatbotIframe.remove();
                                chatbotIframe = null;
                            }

                            if (closeChatButton) {
                                closeChatButton.disabled = false;
                                closeChatButton.style.display = 'none';
                            }

                            if (startChatButton) {
                                startChatButton.style.display = 'inline';
                            }

                            // Remove listener to prevent memory leaks
                            window.removeEventListener('message', handleMessage);
                            break;

                        default:
                            console.warn('Unknown message type:', type);
                    }
                };

                // const handleMessage = (event: any) => {
                //     const { type } = event.data;
                //     console.log(type);

                //     if (type === 'chatHistorySaved') {
                //         shimmerContainer.style.display = "none";
                //         chatbotIframe?.remove();
                //         closeChatButton.disabled = false;
                //         chatbotIframe = null;

                //         closeChatButton.style.display = 'none';
                //         startChatButton.style.display = 'inline';

                //         window.removeEventListener('message', handleMessage);
                //     }
                // };

                window.addEventListener('message', handleMessage);
            }
        };
    };

    useEffect(() => {
        if (typeof window === "undefined") return;
        if (SUPPORT_CHATBOT) {
            initChatBot(SUPPORT_CHATBOT)
        }

    }, [SUPPORT_CHATBOT])
    return null
}

export default ChatBot