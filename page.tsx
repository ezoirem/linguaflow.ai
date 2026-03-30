"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Mic, MicOff, RotateCcw, Download, Globe, ChevronRight, Volume2, VolumeX, MessageSquare, TrendingUp, X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Lang = "TR" | "EN";
type Phase = "select" | "session" | "summary";

interface Message {
  role: "user" | "ai";
  text: string;
  feedback?: string;
  timestamp: number;
}

interface Scenario {
  id: string;
  icon: string;
  labelEN: string;
  labelTR: string;
  descEN: string;
  descTR: string;
  category: "professional" | "daily" | "travel";
  openingEN: string;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: () => void;
  onresult: (e: SpeechRecognitionEvent) => void;
  onend: () => void;
  onerror: (e: SpeechRecognitionErrorEvent) => void;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SCENARIOS: Scenario[] = [
  {
    id: "job-interview",
    icon: "💼",
    labelEN: "Job Interview",
    labelTR: "İş Mülakatı",
    descEN: "Practice common HR and behavioral questions",
    descTR: "İnsan kaynakları ve davranışsal soruları pratik edin",
    category: "professional",
    openingEN: "Good morning! Please take a seat. I'm Sarah, the HR Manager. Before we begin, could you tell me a little about yourself and why you're interested in this position?",
  },
  {
    id: "office-conflict",
    icon: "🤝",
    labelEN: "Office Conflict",
    labelTR: "Ofis Çatışması",
    descEN: "Navigate workplace disagreements professionally",
    descTR: "İş yeri anlaşmazlıklarını profesyonelce yönetin",
    category: "professional",
    openingEN: "Hey, do you have a minute? I wanted to talk to you about the presentation yesterday. I felt like some of my contributions weren't credited properly, and I'd like us to address that.",
  },
  {
    id: "restaurant",
    icon: "🍽️",
    labelEN: "Restaurant",
    labelTR: "Restoran",
    descEN: "Order food and handle special requests",
    descTR: "Yemek sipariş edin ve özel istekleri iletin",
    category: "daily",
    openingEN: "Good evening! Welcome to Le Brasserie. My name is Marco and I'll be your server tonight. Can I start you off with something to drink?",
  },
  {
    id: "small-talk",
    icon: "☕",
    labelEN: "Small Talk",
    labelTR: "Sohbet",
    descEN: "Casual conversation with a new acquaintance",
    descTR: "Yeni bir tanışmayla gündelik sohbet",
    category: "daily",
    openingEN: "Hi! Are you also waiting for the event to start? I'm Alex. I've never been to one of these networking meetups before — have you?",
  },
  {
    id: "airport",
    icon: "✈️",
    labelEN: "Airport Check-in",
    labelTR: "Havaalanı",
    descEN: "Navigate check-in, security, and boarding",
    descTR: "Check-in, güvenlik ve biniş süreçlerini yönetin",
    category: "travel",
    openingEN: "Next please! Good morning. May I see your passport and booking confirmation? Are you checking any luggage today?",
  },
  {
    id: "hotel",
    icon: "🏨",
    labelEN: "Hotel Check-in",
    labelTR: "Otel Girişi",
    descEN: "Check in, handle room requests, resolve issues",
    descTR: "Check-in yapın ve oda sorunlarını çözün",
    category: "travel",
    openingEN: "Welcome to The Grand Continental! Do you have a reservation? Let me pull that up for you — could I get your name please?",
  },
];

const UI = {
  TR: {
    tagline: "Konuşma bariyerini kır",
    selectTitle: "Senaryo Seçin",
    professional: "Profesyonel",
    daily: "Günlük Hayat",
    travel: "Seyahat",
    startBtn: "Başlat",
    holdToTalk: "Konuşmak için basılı tut",
    listening: "Dinleniyor…",
    processing: "İşleniyor…",
    endSession: "Bitir",
    coachNote: "Koç Notu",
    youSaid: "Sen dedin",
    aiPartner: "AI Partneri",
    summaryTitle: "Seans Özeti",
    strengths: "Güçlü Yönler",
    improve: "Gelişim Alanları",
    score: "Skor",
    restart: "Yeni Seans",
    export: "Dışa Aktar",
    messages: "Mesaj",
    mute: "Sesi Kapat",
    unmute: "Sesi Aç",
    noSupport: "Tarayıcınız ses tanımayı desteklemiyor. Chrome veya Edge kullanın.",
    sessionExport: "seans",
  },
  EN: {
    tagline: "Break the speaking barrier",
    selectTitle: "Choose a Scenario",
    professional: "Professional",
    daily: "Daily Life",
    travel: "Travel",
    startBtn: "Start",
    holdToTalk: "Hold to talk",
    listening: "Listening…",
    processing: "Processing…",
    endSession: "End Session",
    coachNote: "Coach Note",
    youSaid: "You said",
    aiPartner: "AI Partner",
    summaryTitle: "Session Summary",
    strengths: "Strengths",
    improve: "Areas to Improve",
    score: "Score",
    restart: "New Session",
    export: "Export",
    messages: "Messages",
    mute: "Mute",
    unmute: "Unmute",
    noSupport: "Your browser doesn't support speech recognition. Please use Chrome or Edge.",
    sessionExport: "session",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildSystemPrompt(scenario: Scenario): string {
  return `You are roleplaying as a character in a "${scenario.labelEN}" scenario. Stay in character at all times.

RESPONSE FORMAT (strictly follow this):
Line 1: [FEEDBACK: <one concise grammar/vocabulary note, or "Perfect!" if no issues>]
Line 2: <your in-character response, 1-3 sentences, conversational>

Rules:
- Keep feedback brief and constructive, focused on one specific error or tip
- Your in-character response should feel natural and advance the conversation
- Do NOT break character or explain what you are doing
- Do NOT use markdown, asterisks, or formatting in your response
- Keep the conversation realistic and engaging`;
}

function parseLLMResponse(raw: string): { feedback: string; reply: string } {
  const lines = raw.trim().split("\n").filter((l) => l.trim());
  let feedback = "Good job!";
  let reply = raw;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("[FEEDBACK:")) {
      const match = line.match(/\[FEEDBACK:\s*(.*?)\]/);
      if (match) feedback = match[1].trim();
      reply = lines
        .slice(i + 1)
        .join(" ")
        .trim();
      break;
    }
  }

  return { feedback, reply: reply || raw };
}

function scoreSession(messages: Message[]): number {
  const userMessages = messages.filter((m) => m.role === "user");
  if (userMessages.length === 0) return 0;
  const perfectCount = messages.filter(
    (m) => m.feedback && m.feedback.toLowerCase().includes("perfect")
  ).length;
  const base = Math.min(userMessages.length * 10, 60);
  const bonus = perfectCount * 8;
  return Math.min(base + bonus, 100);
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LinguaFlowApp() {
  const [lang, setLang] = useState<Lang>("TR");
  const [phase, setPhase] = useState<Phase>("select");
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(true);
  const [activeCategory, setActiveCategory] = useState<"professional" | "daily" | "travel">("professional");

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const t = UI[lang];

  useEffect(() => {
    const SR = (window as unknown as Record<string, unknown>).SpeechRecognition ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition;
    if (!SR) setHasSpeechSupport(false);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const speak = useCallback(
    (text: string) => {
      if (isMuted || typeof window === "undefined") return;
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(text);
      utt.lang = "en-US";
      utt.rate = 0.95;
      window.speechSynthesis.speak(utt);
    },
    [isMuted]
  );

  const callGemini = useCallback(
    async (userText: string, currentScenario: Scenario) => {
      setIsProcessing(true);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userText,
            systemPrompt: buildSystemPrompt(currentScenario),
          }),
        });
        const data = await res.json();
        const raw: string = data.text ?? "I'm sorry, could you repeat that?";
        const { feedback, reply } = parseLLMResponse(raw);

        const aiMsg: Message = {
          role: "ai",
          text: reply,
          feedback,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, aiMsg]);
        speak(reply);
      } catch {
        const fallback: Message = {
          role: "ai",
          text: "Sorry, I didn't catch that. Could you try again?",
          feedback: "",
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, fallback]);
      } finally {
        setIsProcessing(false);
      }
    },
    [speak]
  );

  const startSession = (sc: Scenario) => {
    setScenario(sc);
    setMessages([]);
    setPhase("session");
    const openingMsg: Message = {
      role: "ai",
      text: sc.openingEN,
      timestamp: Date.now(),
    };
    setMessages([openingMsg]);
    setTimeout(() => speak(sc.openingEN), 300);
  };

  const startListening = () => {
    if (!hasSpeechSupport || isProcessing) return;
    const SR =
      (window as unknown as Record<string, unknown>).SpeechRecognition ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition;
    const recognition = new (SR as new () => SpeechRecognitionInstance)();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e: SpeechRecognitionEvent) => {
      const transcript = e.results[0][0].transcript;
      const userMsg: Message = {
        role: "user",
        text: transcript,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);
      if (scenario) callGemini(transcript, scenario);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const endSession = () => {
    window.speechSynthesis.cancel();
    setPhase("summary");
  };

  const exportSession = () => {
    const data = {
      scenario: scenario?.labelEN,
      date: new Date().toISOString(),
      messages,
      score: scoreSession(messages),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `linguaflow-${t.sessionExport}-${Date.now()}.json`;
    a.click();
  };

  const resetAll = () => {
    window.speechSynthesis.cancel();
    setMessages([]);
    setScenario(null);
    setPhase("select");
    setIsListening(false);
    setIsProcessing(false);
  };

  const filteredScenarios = SCENARIOS.filter((s) => s.category === activeCategory);
  const score = scoreSession(messages);
  const userMessages = messages.filter((m) => m.role === "user");

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <header className="border-b border-slate-800/60 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center text-sm font-bold">
            L
          </div>
          <span className="font-semibold text-lg tracking-tight">LinguaFlow AI</span>
          {phase === "session" && scenario && (
            <span className="hidden sm:flex items-center gap-1.5 text-sm text-slate-400 ml-2">
              <ChevronRight size={14} />
              {lang === "TR" ? scenario.labelTR : scenario.labelEN}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {phase === "session" && (
            <button
              onClick={() => setIsMuted((m) => !m)}
              className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
              aria-label={isMuted ? t.unmute : t.mute}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          )}
          <button
            onClick={() => setLang((l) => (l === "EN" ? "TR" : "EN"))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Globe size={14} />
            {lang === "EN" ? "TR" : "EN"}
          </button>
        </div>
      </header>

      {/* ── SCENARIO SELECT ── */}
      {phase === "select" && (
        <main className="flex-1 flex flex-col items-center px-4 py-12">
          <div className="text-center mb-10">
            <p className="text-slate-500 text-sm uppercase tracking-widest mb-3 font-medium">
              {t.tagline}
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              {t.selectTitle}
            </h1>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 mb-8 p-1 bg-slate-900 rounded-xl border border-slate-800">
            {(["professional", "daily", "travel"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-slate-700 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {t[cat as "professional" | "daily" | "travel"]}
              </button>
            ))}
          </div>

          {/* Scenario Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-3xl">
            {filteredScenarios.map((sc) => (
              <button
                key={sc.id}
                onClick={() => startSession(sc)}
                className="group text-left p-5 bg-slate-900 border border-slate-800 rounded-2xl hover:border-cyan-500/40 hover:bg-slate-800/80 transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="text-3xl mb-3">{sc.icon}</div>
                <h3 className="font-semibold text-white mb-1">
                  {lang === "TR" ? sc.labelTR : sc.labelEN}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {lang === "TR" ? sc.descTR : sc.descEN}
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-cyan-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {t.startBtn} <ChevronRight size={12} />
                </div>
              </button>
            ))}
          </div>
        </main>
      )}

      {/* ── SESSION ── */}
      {phase === "session" && scenario && (
        <main className="flex-1 flex flex-col max-w-2xl w-full mx-auto px-4 py-6">
          {/* Chat */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-1">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                  <p className="text-xs text-slate-500 px-1">
                    {msg.role === "user" ? t.youSaid : t.aiPartner}
                  </p>
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-cyan-500/20 border border-cyan-500/30 text-cyan-50 rounded-br-sm"
                        : "bg-slate-800 border border-slate-700 text-slate-100 rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.feedback && msg.feedback !== "" && (
                    <div className="flex items-start gap-1.5 px-1 mt-0.5">
                      <span className="text-xs text-violet-400 font-medium shrink-0">
                        ✦ {t.coachNote}:
                      </span>
                      <span className="text-xs text-violet-300/80">{msg.feedback}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${d * 150}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Controls */}
          {!hasSpeechSupport && (
            <p className="text-amber-400 text-sm text-center mb-4">{t.noSupport}</p>
          )}

          <div className="flex flex-col items-center gap-4">
            <p className="text-slate-500 text-xs">
              {isListening ? t.listening : isProcessing ? t.processing : t.holdToTalk}
            </p>
            <div className="flex items-center gap-6">
              <button
                onClick={resetAll}
                className="p-3 rounded-full border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-all"
              >
                <RotateCcw size={18} />
              </button>

              {/* Mic button */}
              <button
                onMouseDown={startListening}
                onMouseUp={stopListening}
                onTouchStart={(e) => { e.preventDefault(); startListening(); }}
                onTouchEnd={(e) => { e.preventDefault(); stopListening(); }}
                disabled={!hasSpeechSupport || isProcessing}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 select-none ${
                  isListening
                    ? "bg-red-500 scale-110 shadow-[0_0_30px_rgba(239,68,68,0.4)]"
                    : isProcessing
                    ? "bg-slate-700 cursor-not-allowed"
                    : "bg-gradient-to-br from-cyan-400 to-violet-500 hover:scale-105 shadow-[0_0_20px_rgba(34,211,238,0.25)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]"
                }`}
              >
                {isListening ? <MicOff size={28} /> : <Mic size={28} />}
              </button>

              <button
                onClick={endSession}
                className="p-3 rounded-full border border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-500/50 transition-all"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-slate-600 text-xs">
              {messages.filter((m) => m.role === "user").length} {t.messages}
            </p>
          </div>
        </main>
      )}

      {/* ── SUMMARY ── */}
      {phase === "summary" && scenario && (
        <main className="flex-1 flex flex-col items-center px-4 py-10">
          <div className="w-full max-w-lg">
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">{scenario.icon}</div>
              <h2 className="text-2xl font-bold text-white mb-1">{t.summaryTitle}</h2>
              <p className="text-slate-400 text-sm">{lang === "TR" ? scenario.labelTR : scenario.labelEN}</p>
            </div>

            {/* Score */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-4 text-center">
              <p className="text-slate-400 text-sm mb-2">{t.score}</p>
              <div
                className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent"
              >
                {score}
              </div>
              <p className="text-slate-500 text-xs mt-1">/ 100</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare size={14} className="text-cyan-400" />
                  <span className="text-xs text-slate-400">{t.messages}</span>
                </div>
                <p className="text-2xl font-bold">{userMessages.length}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp size={14} className="text-violet-400" />
                  <span className="text-xs text-slate-400">{t.strengths}</span>
                </div>
                <p className="text-2xl font-bold">
                  {messages.filter((m) => m.feedback?.toLowerCase().includes("perfect")).length}
                </p>
              </div>
            </div>

            {/* Recent feedback */}
            {messages.filter((m) => m.feedback && m.feedback !== "").length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6">
                <p className="text-xs text-violet-400 font-medium uppercase tracking-wider mb-3">
                  {t.improve}
                </p>
                <ul className="space-y-2">
                  {messages
                    .filter((m) => m.feedback && !m.feedback.toLowerCase().includes("perfect"))
                    .slice(-4)
                    .map((m, i) => (
                      <li key={i} className="text-sm text-slate-300 flex gap-2">
                        <span className="text-violet-400 shrink-0">✦</span>
                        {m.feedback}
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={resetAll}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-xl font-medium text-sm hover:opacity-90 transition-opacity"
              >
                <RotateCcw size={16} />
                {t.restart}
              </button>
              <button
                onClick={exportSession}
                className="flex items-center justify-center gap-2 px-5 py-3 border border-slate-700 rounded-xl text-sm text-slate-300 hover:border-slate-500 hover:text-white transition-all"
              >
                <Download size={16} />
                {t.export}
              </button>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
