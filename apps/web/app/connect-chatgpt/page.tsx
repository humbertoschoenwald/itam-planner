import { ConnectChatGptPanel } from "@/components/connect-chatgpt-panel";

export default function ConnectChatGptPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-5 py-8 sm:px-8 sm:py-12">
      <div className="flex flex-col gap-3">
        <p className="eyebrow">Connect to ChatGPT</p>
        <h1 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
          Prepare your browser-local planner for external AI use
        </h1>
        <p className="max-w-3xl text-base leading-7 text-muted sm:text-lg">
          The student code already reflects your browser-local planner state. The exact AI context
          endpoint shape is still deferred by doctrine, so this page stays focused on the current
          contract and what comes next.
        </p>
      </div>

      <ConnectChatGptPanel />
    </main>
  );
}
