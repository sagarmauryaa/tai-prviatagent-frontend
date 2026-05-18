"use client";

import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import { Button, CardActions, Input, Stack } from "@mui/material";
import SyntaxHighlighter from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CopyAll } from "@mui/icons-material";
import { IntegrationCode } from "@/constant/integration-code-snippets";
import { useAuth } from "@/components/auth/auth-context";
import MailCode from "./mail-code";

export function ChatbotWidget() {
  const { selectedBrand } = useAuth();
  const [codeSinppet, setCodeSinppet] = React.useState('');
  const [copySuccess, setCopySuccess] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`<script>${codeSinppet}</script>`);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  React.useEffect(() => {
    if (selectedBrand?._id) {
      const code = IntegrationCode(selectedBrand?._id ?? '');
      setCodeSinppet(code)
    }
  }, [selectedBrand])

  return (
    <Card>
      <CardHeader
        title="Chatbot Widget"
      />
      <CardContent>
        <Typography>The Tellofy Chatbot Widget can be placed on your website or any other web page. All you need to do is copy the code and paste it anywhere on your website code. You can also have the code emailed to you from below</Typography>
      </CardContent>
      <MailCode code={codeSinppet} />
      <CardContent>
        <Stack spacing={2}>
          <Stack direction={'row'} sx={{ alignItems: 'center' }}>
            <Typography variant="h6">Generated script code for: {selectedBrand?.name}
            </Typography>
            <Button
              sx={{ ml: 'auto' }}
              onClick={handleCopy}
            >
              {copySuccess ? 'Copied!' : 'Copy'} <CopyAll fontSize="small" />
            </Button>
          </Stack>
            <SyntaxHighlighter 
              language={'javascript'} 
            wrapLines={true}
              style={dracula}
              customStyle={{ 
              maxHeight: '500px', 
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word'
              }}
            >
            {`<script>${codeSinppet}</script>`}
            </SyntaxHighlighter>
        </Stack>
      </CardContent>
    </Card>
  );
}