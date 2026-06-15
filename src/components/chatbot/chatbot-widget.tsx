"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Source = { title: string; url: string; type: string };
type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
};

const SUGGESTED_QUESTIONS = [
  "What industries do you serve?",
  "Show me the latest articles on manufacturing",
  "How can I contact Wipfli?",
  "What does Wipfli do for healthcare?",
  "Where can I subscribe?",
  "How do I sign in to Summit Hub?",
];

const GREETING =
  "👋 Hi! I'm the Summit Assistant. I can answer questions about anything on this site — services, industries, locations, articles, how to subscribe, sign in to Summit Hub, contact us, and more.";

type Props = {
  locale?: string;
};

export function ChatbotWidget({ locale = "en" }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, pending, open]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || pending) return;

      const nextMessages: Message[] = [
        ...messages,
        { role: "user", content: trimmed },
      ];
      setMessages(nextMessages);
      setInput("");
      setPending(true);

      try {
        const resp = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: nextMessages.map(({ role, content }) => ({ role, content })),
            locale,
          }),
        });
        const data = (await resp.json()) as { reply?: string; sources?: Source[] };
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              data.reply?.trim() ||
              "Sorry, I couldn't generate a response. Try rephrasing.",
            sources: data.sources ?? [],
          },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "I couldn't reach the assistant right now. Please try again shortly.",
          },
        ]);
      } finally {
        setPending(false);
      }
    },
    [messages, pending, locale],
  );

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      void sendMessage(input);
    },
    [input, sendMessage],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        void sendMessage(input);
      }
    },
    [input, sendMessage],
  );

  const reset = useCallback(() => {
    setMessages([{ role: "assistant", content: GREETING }]);
    setInput("");
  }, []);

  return (
    <>
      {/* Floating launcher button */}
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open Summit Assistant"
          className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#1247ff] text-white shadow-lg transition hover:scale-105 hover:bg-[#0a39d6] focus:outline-none focus:ring-4 focus:ring-[#1247ff]/30"
        >
          <ChatBubbleIcon />
        </button>
      ) : null}

      {/* Panel */}
      {open ? (
        <div
          role="dialog"
          aria-label="Summit Assistant"
          className="fixed bottom-5 right-5 z-50 flex h-[600px] max-h-[85vh] w-[380px] max-w-[95vw] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl sm:bottom-5 sm:right-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-2 bg-[#1247ff] px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                <ChatBubbleIcon />
              </div>
              <div>
                <div className="text-sm font-semibold leading-tight">Summit Assistant</div>
                <div className="text-[11px] leading-tight text-white/70">Ask me anything about Summit</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={reset}
                aria-label="Clear conversation"
                title="Clear conversation"
                className="rounded p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                <RefreshIcon />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="rounded p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                <CloseIcon />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto bg-[#f7f9fc] px-3 py-4"
          >
            {messages.map((m, i) => (
              <MessageBubble key={i} message={m} />
            ))}
            {pending ? <TypingIndicator /> : null}

            {/* Suggested chips — only when conversation hasn't started */}
            {messages.length === 1 && !pending ? (
              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  Try asking
                </div>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => void sendMessage(q)}
                      className="rounded-full border border-[#1247ff]/20 bg-white px-3 py-1.5 text-xs text-[#1247ff] transition hover:border-[#1247ff] hover:bg-[#1247ff] hover:text-white"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {/* Input */}
          <form
            onSubmit={onSubmit}
            className="flex items-end gap-2 border-t border-gray-200 bg-white px-3 py-3"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask about Summit…"
              rows={1}
              disabled={pending}
              className="max-h-24 min-h-[40px] flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#1247ff] focus:outline-none focus:ring-1 focus:ring-[#1247ff] disabled:bg-gray-50"
            />
            <button
              type="submit"
              disabled={pending || !input.trim()}
              aria-label="Send"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1247ff] text-white transition hover:bg-[#0a39d6] disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              <SendIcon />
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
          isUser
            ? "bg-[#1247ff] text-white"
            : "bg-white text-gray-800 ring-1 ring-gray-200"
        }`}
      >
        <RichText text={message.content} />
        {!isUser && message.sources && message.sources.length > 0 ? (
          <div className="mt-2 space-y-1 border-t border-gray-200 pt-2">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
              Sources
            </div>
            {message.sources.slice(0, 4).map((s, i) => (
              <a
                key={`${s.url}-${i}`}
                href={s.url}
                className="block truncate text-xs text-[#1247ff] hover:underline"
                title={s.title}
              >
                {s.type}: {s.title}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** Minimal renderer — turns [label](url) markdown links into anchors and
 *  preserves line breaks. Avoids pulling a markdown lib for one feature. */
function RichText({ text }: { text: string }) {
  const lines = text.split(/\n+/);
  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => (
        <p key={i} className="whitespace-pre-wrap">
          {renderInline(line)}
        </p>
      ))}
    </div>
  );
}

function renderInline(line: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      parts.push(line.slice(lastIndex, match.index));
    }
    const label = match[1];
    const href = match[2];
    parts.push(
      <a
        key={`l-${key++}`}
        href={href}
        className="text-[#1247ff] underline underline-offset-2 hover:opacity-80"
      >
        {label}
      </a>,
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < line.length) {
    parts.push(line.slice(lastIndex));
  }
  return parts;
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1 rounded-2xl bg-white px-3.5 py-2.5 shadow-sm ring-1 ring-gray-200">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
      </div>
    </div>
  );
}

function ChatBubbleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 5C4 3.9 4.9 3 6 3H18C19.1 3 20 3.9 20 5V15C20 16.1 19.1 17 18 17H8L4 21V5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.15"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 12a9 9 0 0 1 15.5-6.3M21 12a9 9 0 0 1-15.5 6.3M21 4v5h-5M3 20v-5h5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 11L21 3L13 21L11 13L3 11Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.2"
      />
    </svg>
  );
}
