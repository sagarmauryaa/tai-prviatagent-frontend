import IframeChatbot from "./iframe-chatbot";

export const metadata = { title: `Chatbot Demo` };

export default async function ({ params }: { params: Promise<{ instanceId: string }> }) {
    const instanceId = (await params).instanceId;
    return <IframeChatbot instanceId={instanceId} />;
}
