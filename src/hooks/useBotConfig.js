import { useCallback } from "react";

/**
 * Provides typed setters for every BotConfig field.
 * Calls updateActiveBot so changes are immediately persisted.
 *
 * @param {import("../models/BotConfig.js").BotConfig} config
 * @param {(config: BotConfig) => void} updateActiveBot
 */
export function useBotConfig(config, updateActiveBot) {
  const set = useCallback((patch) => {
    updateActiveBot(config.with(patch));
  }, [config, updateActiveBot]);

  // ── Identity ──────────────────────────────────────────────────────────
  const setBotName     = v => set({ botName:     v });
  const setCompany     = v => set({ company:     v });
  const setAvatar      = v => set({ avatar:      v });
  const setWelcomeMsg  = v => set({ welcomeMsg:  v });
  const setFallbackMsg = v => set({ fallbackMsg: v });

  // ── Behavior ──────────────────────────────────────────────────────────
  const setTone            = v => set({ tone:            v });
  const setPersonalityNote = v => set({ personalityNote: v });
  const setHandoffTrigger  = v => set({ handoffTrigger:  v });
  const setCollectEmail    = v => set({ collectEmail:    v });
  const setShowTyping      = v => set({ showTyping:      v });
  const toggleChip         = chip => updateActiveBot(config.toggleChip(chip));

  // ── Knowledge ─────────────────────────────────────────────────────────
  const setBizContext    = v => set({ bizContext: v });
  const addQA            = () => updateActiveBot(config.addQA());
  const removeQA         = id => updateActiveBot(config.removeQA(id));
  const updateQAQuestion = (id, q) => updateActiveBot(config.updateQAQuestion(id, q));
  const updateQAAnswer   = (id, a) => updateActiveBot(config.updateQAAnswer(id, a));

  // ── Style ─────────────────────────────────────────────────────────────
  const setPrimaryColor = v => set({ primaryColor: v });
  const setUserColor    = v => set({ userColor:    v });
  const setChatRadius   = v => set({ chatRadius:   v });
  const setPosition     = v => set({ position:     v });

  return {
    setBotName, setCompany, setAvatar, setWelcomeMsg, setFallbackMsg,
    setTone, setPersonalityNote, setHandoffTrigger, setCollectEmail, setShowTyping, toggleChip,
    setBizContext, addQA, removeQA, updateQAQuestion, updateQAAnswer,
    setPrimaryColor, setUserColor, setChatRadius, setPosition,
  };
}
