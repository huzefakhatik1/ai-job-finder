import React, { useState, useRef, useEffect } from 'react';
import {
  BotMessageSquare,
  Sparkles,
  Send,
  User,
  Search,
  GitCompare,
  Target,
  ArrowRight,
  RefreshCw,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api.ts';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionTaken?: {
    type: string;
    payload?: any;
  };
}

interface AssistantViewProps {
  onNavigateToJobsWithFilter?: (params: any) => void;
  onNavigateToCompare?: () => void;
}

export const AssistantView: React.FC<AssistantViewProps> = ({
  onNavigateToJobsWithFilter,
  onNavigateToCompare
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm_init',
      sender: 'assistant',
      text: "Hello Huzefa! I'm your personal AI Job Assistant. I continuously monitor Indian tech opportunities and match them to your 2 years of experience in Angular, TypeScript, C#, .NET Web API, and SQL Server. How can I assist your search today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    'Find Angular jobs in Pune',
    'Find .NET jobs above 5 LPA',
    'Show jobs with more than 85% match',
    'Which technical skills am I missing?',
    'Compare these job opportunities'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.sendAiChat(userMsg.text);
      const assistantMsg: Message = {
        id: `ast_${Date.now()}`,
        sender: 'assistant',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionTaken: res.actionTaken
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'assistant',
          text: `I encountered an issue processing your query: ${err.message}. Please try again.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-130px)] flex flex-col rounded-2xl bg-[#0f172a] border border-slate-800 shadow-2xl overflow-hidden">
      {/* Top Chat Header */}
      <div className="p-4 bg-gradient-to-r from-[#141b2d] to-[#0e1424] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-900/30">
            <BotMessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              Personal AI Search Assistant
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                Gemini 3.8 Flash
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Natural language job search, compensation filters & skill gap diagnostics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Active</span>
        </div>
      </div>

      {/* Quick Prompts Chips */}
      <div className="p-3 bg-slate-900/50 border-b border-slate-800/80 overflow-x-auto flex gap-2">
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-purple-950/60 hover:text-purple-200 border border-slate-700/60 hover:border-purple-500/40 transition-colors whitespace-nowrap cursor-pointer shrink-0"
          >
            "{p}"
          </button>
        ))}
      </div>

      {/* Messages stream */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-purple-600 text-white'
                    : 'bg-indigo-950 border border-indigo-700/60 text-indigo-300'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4 text-purple-400" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed space-y-3 ${
                  isUser
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-900/20'
                    : 'bg-[#141b2d] border border-slate-800 text-slate-200 shadow-sm'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {/* Controlled Action Button / Payload */}
                {msg.actionTaken && (
                  <div className="pt-2 border-t border-slate-700/60 flex items-center gap-2">
                    {msg.actionTaken.type === 'FILTER_JOBS' && onNavigateToJobsWithFilter && (
                      <button
                        onClick={() => onNavigateToJobsWithFilter(msg.actionTaken?.payload)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1.5 shadow transition-colors cursor-pointer"
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>View Filtered Openings</span>
                      </button>
                    )}

                    {msg.actionTaken.type === 'COMPARE_JOBS' && onNavigateToCompare && (
                      <button
                        onClick={onNavigateToCompare}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 shadow transition-colors cursor-pointer"
                      >
                        <GitCompare className="w-3.5 h-3.5" />
                        <span>Open Comparison Matrix</span>
                      </button>
                    )}
                  </div>
                )}

                <span className="block text-[10px] text-right opacity-60">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-950 border border-indigo-700/60 flex items-center justify-center text-indigo-300">
              <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
            </div>
            <div className="p-3.5 rounded-2xl bg-[#141b2d] border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-400" />
              <span>Analyzing database & generating tailored response...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input row */}
      <div className="p-4 bg-[#0e1424] border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask anything (e.g. 'Find Angular jobs in Pune' or 'Which skills am I missing?')..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500"
          />

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white transition-all shadow-md shadow-purple-900/30 disabled:opacity-40 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
