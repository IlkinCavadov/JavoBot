import { useState, useCallback, useEffect } from "react";
import { BotConfig }      from "../models/BotConfig.js";
import { storageService } from "../services/StorageService.js";

/**
 * Top-level hook that owns the list of all bots and the active selection.
 * Handles load, save, create, delete, duplicate, and import/export.
 */
export function useBots() {
  const [bots,     setBots]     = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  // ── Load on mount ───────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const saved    = storageService.loadAll();
      const savedId  = storageService.loadActiveId();
      if (saved.length === 0) {
        const seed = new BotConfig();
        setBots([seed]);
        setActiveId(seed.id);
        storageService.saveAll([seed]);
      } else {
        setBots(saved);
        setActiveId(savedId && saved.some(b => b.id === savedId) ? savedId : saved[0].id);
      }
    } catch (err) {
      setError("Failed to load saved bots.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Persist whenever bots change ────────────────────────────────────────
  const persist = useCallback((nextBots, nextActiveId) => {
    try {
      storageService.saveAll(nextBots);
      if (nextActiveId !== undefined) storageService.saveActiveId(nextActiveId);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  // ── Active bot ──────────────────────────────────────────────────────────
  const activeBot = bots.find(b => b.id === activeId) ?? bots[0] ?? null;

  const selectBot = useCallback((id) => {
    setActiveId(id);
    storageService.saveActiveId(id);
  }, []);

  // ── Update the active bot's config ──────────────────────────────────────
  const updateActiveBot = useCallback((updatedConfig) => {
    setBots(prev => {
      const next = prev.map(b => b.id === updatedConfig.id ? updatedConfig : b);
      persist(next);
      return next;
    });
  }, [persist]);

  // ── CRUD ────────────────────────────────────────────────────────────────
  const createBot = useCallback(() => {
    const fresh = new BotConfig({ botName: "New Bot", company: "My Company" });
    setBots(prev => {
      const next = [...prev, fresh];
      persist(next, fresh.id);
      return next;
    });
    setActiveId(fresh.id);
    return fresh;
  }, [persist]);

  const deleteBot = useCallback((id) => {
    setBots(prev => {
      if (prev.length === 1) {
        setError("You need at least one bot.");
        return prev;
      }
      const next = prev.filter(b => b.id !== id);
      const nextActiveId = id === activeId ? next[0]?.id : activeId;
      setActiveId(nextActiveId);
      persist(next, nextActiveId);
      return next;
    });
  }, [activeId, persist]);

  const duplicateBot = useCallback((bot) => {
    const copy = new BotConfig({
      ...bot.toJSON(),
      id:        null,
      createdAt: null,
      updatedAt: null,
      botName:   `${bot.botName} (copy)`,
    });
    setBots(prev => {
      const next = [...prev, copy];
      persist(next, copy.id);
      return next;
    });
    setActiveId(copy.id);
  }, [persist]);

  // ── Import / Export ─────────────────────────────────────────────────────
  const exportBot  = useCallback((bot)   => storageService.exportBot(bot),   []);
  const exportAll  = useCallback(()       => storageService.exportAll(bots),  [bots]);

  const importFromFile = useCallback(async (file) => {
    try {
      const imported = await storageService.importFromFile(file);
      setBots(prev => {
        // Assign fresh IDs to avoid collisions with existing bots
        const fresh = imported.map(b => new BotConfig({ ...b.toJSON(), id: null, createdAt: null, updatedAt: null }));
        const next  = [...prev, ...fresh];
        const newId = fresh[fresh.length - 1]?.id;
        persist(next, newId);
        setActiveId(newId);
        return next;
      });
    } catch (err) {
      setError(`Import failed: ${err.message}`);
    }
  }, [persist]);

  const dismissError = useCallback(() => setError(null), []);

  return {
    bots, activeBot, activeId, loading, error,
    selectBot, updateActiveBot,
    createBot, deleteBot, duplicateBot,
    exportBot, exportAll, importFromFile,
    dismissError,
  };
}
