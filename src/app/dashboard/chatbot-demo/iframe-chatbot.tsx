"use client";

import React, { useEffect, useRef, useState } from "react";
import { CHATBOT_URL } from "@/utils/config";
import { Box, CircularProgress } from "@mui/material";
import { createPortal } from "react-dom";
import { useAuth } from "@/components/auth/auth-context";
import { saveLocalChat, getLocalChat, clearChatStorage, getStorageKey } from "@/lib/chat-storage";

interface ChatMessage {
  user: { message: string; type: "text" | "audio"; createdTime: string };
  bot: string;
  is_answered: boolean;
  createdTime: string;
}

const IframeChatbot = () => {
  const { selectedBrand } = useAuth();
  const chatbotIframe = useRef<HTMLIFrameElement | null>(null);
  const [isBrowser, setIsBrowser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  useEffect(() => {
    if (!isBrowser || !chatbotIframe.current) return;

    const handleMessage = (event: MessageEvent) => {
      const { type, payload, chatId } = event.data;
      const iframe = chatbotIframe.current;

      if (!iframe) return;

      // Optional: verify message comes from iframe
      if (event.source !== iframe.contentWindow) return;


      switch (type) {
        case "SAVE_CHAT":
          saveLocalChat(chatId, payload as ChatMessage[]);
          iframe.contentWindow?.postMessage({ type: "SAVE_CHAT_SUCCESS" }, "*");
          break;

        case "CLEAR_CHAT":
          clearChatStorage();
          break;

        case "GET_CHAT":
          const chat = getLocalChat(chatId);
          iframe.contentWindow?.postMessage({ type: "CHAT_RESPONSE", payload: chat }, "*");
          break;

        default:
          console.warn("Unknown message type:", type);
      }
    };

    window.addEventListener("message", handleMessage);

    const clearTimeInterval = setInterval(function () {
      var expiry = parseInt((localStorage.getItem(getStorageKey('chatbot_expiry')) || '0'), 10);
      if (expiry && Date.now() > expiry) {
        clearChatStorage();
      }
    }, 60 * 1000);


    return () => {
      window.removeEventListener("message", handleMessage);
      clearInterval(clearTimeInterval);
    };
  }, [isBrowser]);

  if (!isBrowser || !selectedBrand) return null;

  // Query-param-based URL to isolate chats
  const iframeUrl = `${CHATBOT_URL}?demo=1&brandId=${selectedBrand._id}`;

  return createPortal(
    <Box
      sx={{
        width: "100%",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: { xs: "100%", md: "700px" },
        height: { xs: "calc(100vh - 260px)", md: "auto" },
      }}
      className="wrapper-chatbot"
    >
      {isLoading && (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <iframe
        ref={chatbotIframe}
        src={iframeUrl}
        width="100%"
        allow="microphone"
        height="100%"
        style={{ border: "none", position: "absolute", left: 0, top: 0 }}
        onLoad={() => setIsLoading(false)}
      />
    </Box>,
    document.getElementById("iframe-root") as HTMLElement
  );
};

export default IframeChatbot;
