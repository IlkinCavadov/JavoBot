import { useState, useRef, useEffect, useCallback } from "react";
import { ChatMessage }     from "../models/ChatMessage.js";
import { anthropicService } from "../services/AnthropicService.js";

/**
 * Manages the live chat preview: messages, history, typing state, send/reset.
 *
 * @param {import("../models/BotConfig.js").BotConfig} config
 */
export function useChat(config) {
  const [messages,  setMessages]  = useState([]);
  const [isTyping,  setIsTyping]  = useState(false);
  const [msgCount,  setMsgCount]  = useState(0);
  const historyRef                = useRef([]); // mutable — avoids stale closures
  const bottomRef                 = useRef(null);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Reset when the bot or its welcome message changes
  const reset = useCallback(() => {
    historyRef.current = [];
    setMessages(config?.welcomeMsg ? [ChatMessage.bot(config.welcomeMsg)] : []);
    setMsgCount(0);
    setIsTyping(false);
  }, [config?.id, config?.welcomeMsg]); // eslint-disable-line

  useEffect(() => { reset(); }, [reset]);

  const send = useCallback(async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const userMsg = ChatMessage.user(trimmed);
    historyRef.current = [...historyRef.current, userMsg.toAPIMessage()];
    setMessages(prev => [...prev, userMsg]);
    setMsgCount(c => c + 1);

    if (config.showTyping) setIsTyping(true);

    try {
      const reply  = await anthropicService.chat(config, historyRef.current);
      const botMsg = ChatMessage.bot(reply);
      historyRef.current = [...historyRef.current, botMsg.toAPIMessage()];
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        ChatMessage.bot(`⚠ ${err.message ?? "Connection error. Please check your setup."}`),
      ]);
    } finally {
      setIsTyping(false);
    }
  }, [config, isTyping]);

  return { messages, isTyping, msgCount, send, reset, bottomRef };
}
