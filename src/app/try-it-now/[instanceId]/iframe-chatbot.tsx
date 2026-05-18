'use client';
import { CHATBOT_URL } from '@/utils/config';
import { CircularProgress } from '@mui/material';
import React, { useState } from 'react'

const IframeChatbot = ({ instanceId }: { instanceId: string }) => {
  const [isLoading, setIsLoading] = useState(true);

  const decodeId = (encoded: string): string => {
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    return Buffer.from(base64, 'base64').toString();
  }

  const iframeUrl = `${CHATBOT_URL}?demo=1&brandId=${decodeId(instanceId)}`;

  return (
    <div style={{ width: '100%', height: '100dvh', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {isLoading && (
        <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </div>
      )}
      <iframe
        src={iframeUrl}
        width="100%"
        allow="microphone"
        height="100%"
        style={{ border: 'none' }}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}

export default IframeChatbot