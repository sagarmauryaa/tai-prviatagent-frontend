'use client';
import { useEffect, useState, useRef } from 'react';
import { HelpOutlineSharp } from '@mui/icons-material';
import { Button } from '@mui/material';
import { BRAND_PAGE_URL, CHATBOT_URL, SUPPORT_CHATBOT, BACKEND_ENDPOINT } from '@/utils/config';

const ChatBotHelp = () => {
    const [isVisible, setIsVisible] = useState(false);
    const chatbotIframeRef = useRef<HTMLIFrameElement | null>(null);
    const shimmerContainerRef = useRef<HTMLDivElement | null>(null);
    const closeChatButtonRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        if (SUPPORT_CHATBOT) {
            checkChatbotVisibilityToShow(SUPPORT_CHATBOT);
        }
    }, []);

    const checkChatbotVisibilityToShow = async (id: string) => {
        try {
            const response = await fetch(`${BACKEND_ENDPOINT}/chat-bot/check-visibility/${id}`);
            if (response.ok) {
                const { data } = await response.json();
                setIsVisible(data?.chatbotVisibility === true || data?.chatbotVisibility === 'true');
            }
        } catch (error) {
            console.error('Error checking chatbot visibility:', error);
        }
    };

    const createStyleTag = (css: string) => {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerText = css;
        document.head.appendChild(style);
        return style;
    };

    const createCloseButton = () => {
        const button = document.createElement('button');
        button.id = 'close-chat';
        Object.assign(button.style, {
            display: 'none',
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: '#C9EAFF',
            backgroundImage: `url('data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M10.1884 0.166687L6.00008 4.35502L1.81175 0.166687L0.166748 1.81169L4.35508 6.00002L0.166748 10.1884L1.81175 11.8334L6.00008 7.64502L10.1884 11.8334L11.8334 10.1884L7.64508 6.00002L11.8334 1.81169L10.1884 0.166687Z' fill='%23fff'/%3E%3C/svg%3E')`,
            backgroundPosition: '50%',
            backgroundRepeat: 'no-repeat',
            color: 'white',
            border: 'none',
            padding: '10px',
            width: '48px',
            height: '48px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            zIndex: '9999',
            transition: '.1s',
            margin: '0 2px 2px 0',
        });
        document.body.appendChild(button);
        return button;
    };

    const createShimmerLoader = () => {
        const container = document.createElement('div');
        container.className = 'chatbot-container';
        Object.assign(container.style, {
            position: 'fixed',
            bottom: '80px',
            right: '100px',
            width: '90vw',
            maxWidth: '400px',
            maxHeight: '560px',
            height: '90vh',
            display: 'flex',
            flexDirection: 'column',
            zIndex: '9999',
            borderRadius: '16px',
            overflow: 'hidden',
        });

        const skeleton = document.createElement('div');
        skeleton.className = 'chatbot-skeleton loading';
        Object.assign(skeleton.style, {
            flex: '1',
            background: 'white',
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            zIndex: '1',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            padding: '16px',
        });

        ['40px', '100%', '40px'].forEach((height, idx) => {
            const shimmer = document.createElement('div');
            shimmer.style.height = height;
            shimmer.style.width = '100%';
            shimmer.style.background = 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)';
            shimmer.style.backgroundSize = '200% 100%';
            shimmer.style.animation = 'shimmer 1.5s infinite';
            shimmer.style.borderRadius = '4px';
            skeleton.appendChild(shimmer);
        });

        container.appendChild(skeleton);
        document.body.appendChild(container);
        return container;
    };

    const initChatBot = (id: string) => {
        // Media styles
        createStyleTag(`
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      @media (max-width: 767px) {
        #close-chat { right: 20px !important; }
        .chatbot-container, iframe {
          max-width: 100% !important;
          width: 90% !important;
          left: 0 !important;
          right: 0 !important;
          margin: 0 auto !important;
          max-height: 506px !important;
        }
      }
    `);

        if (!closeChatButtonRef.current) {
            closeChatButtonRef.current = createCloseButton();
        }

        if (!shimmerContainerRef.current) {
            shimmerContainerRef.current = createShimmerLoader();
        }

        const iframe = document.createElement('iframe');
        Object.assign(iframe.style, {
            zIndex: '9999',
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            width: '90vw',
            maxWidth: '400px',
            maxHeight: '560px',
            height: '90vh',
            borderRadius: '16px',
            border: '0',
        });
        iframe.src = `${CHATBOT_URL}?brandId=${id}`;
        iframe.allow = 'microphone';
        document.body.appendChild(iframe);
        chatbotIframeRef.current = iframe;

        iframe.onload = () => {
            shimmerContainerRef.current!.style.display = 'none';
            closeChatButtonRef.current!.style.display = 'inline';
        };

        closeChatButtonRef.current.onclick = () => closeChat(iframe);
    };

    const closeChat = (iframe: HTMLIFrameElement) => {
        shimmerContainerRef.current!.style.display = 'flex'; // show shimmer during close
        iframe.contentWindow?.postMessage({ type: 'endChat' }, CHATBOT_URL);
        iframe.style.display = 'none';
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === 'chatHistorySaved') {
                iframe.remove();
                chatbotIframeRef.current = null;
                closeChatButtonRef.current!.style.display = 'none';
                shimmerContainerRef.current!.style.display = 'none'; // just hide instead of remove
                window.removeEventListener('message', handleMessage);
            }
        };

        window.addEventListener('message', handleMessage);
    };


    if (!isVisible) return null;

    return (
        <Button variant="text" onClick={() => initChatBot(SUPPORT_CHATBOT)}>
            <HelpOutlineSharp fontSize='medium' />
        </Button>
    );
};

export default ChatBotHelp;
