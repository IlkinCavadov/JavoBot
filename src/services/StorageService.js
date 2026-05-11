import { BotConfig }      from "../models/BotConfig.js";
import { STORAGE_KEY, ACTIVE_BOT_KEY, APP_VERSION } from "../constants/index.js";

const SCHEMA_VERSION = 1;

/**
 * Manages all bot persistence via localStorage.
 *
 * Schema stored under STORAGE_KEY:
 * {
 *   version: number,
 *   bots: BotConfig[]   (serialized)
 * }
 */
export class StorageService {
  // ── Read ────────────────────────────────────────────────────────────────

  /** Load all bots. Returns [] if nothing stored or data is corrupt. */
  loadAll() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const store = JSON.parse(raw);
      return (store.bots ?? []).map(BotConfig.fromJSON);
    } catch (err) {
      console.error("[StorageService] loadAll failed:", err);
      return [];
    }
  }

  /** Load the ID of the last-active bot. */
  loadActiveId() {
    try {
      return localStorage.getItem(ACTIVE_BOT_KEY) ?? null;
    } catch {
      return null;
    }
  }

  // ── Write ───────────────────────────────────────────────────────────────

  /** Persist a full array of BotConfigs. */
  saveAll(bots) {
    try {
      const store = {
        version:     SCHEMA_VERSION,
        appVersion:  APP_VERSION,
        savedAt:     new Date().toISOString(),
        bots:        bots.map(b => b.toJSON()),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (err) {
      console.error("[StorageService] saveAll failed:", err);
      throw new Error("Could not save bots. Storage may be full.");
    }
  }

  /** Upsert a single bot (insert if new, replace if existing). */
  upsert(bot, allBots) {
    const exists = allBots.findIndex(b => b.id === bot.id);
    const updated = exists === -1
      ? [...allBots, bot]
      : allBots.map(b => b.id === bot.id ? bot : b);
    this.saveAll(updated);
    return updated;
  }

  /** Remove a bot by ID. Returns the remaining list. */
  remove(id, allBots) {
    const updated = allBots.filter(b => b.id !== id);
    this.saveAll(updated);
    return updated;
  }

  /** Persist the active bot ID. */
  saveActiveId(id) {
    try {
      if (id) localStorage.setItem(ACTIVE_BOT_KEY, id);
      else     localStorage.removeItem(ACTIVE_BOT_KEY);
    } catch {
      // non-critical, ignore
    }
  }

  // ── Import / Export ─────────────────────────────────────────────────────

  /**
   * Export a single bot as a downloadable JSON file.
   * @param {BotConfig} bot
   */
  exportBot(bot) {
    const payload = JSON.stringify(
      { botforge: true, version: SCHEMA_VERSION, exportedAt: new Date().toISOString(), bot: bot.toJSON() },
      null, 2
    );
    this.#download(`${bot.botName.toLowerCase().replace(/\s+/g, "-")}-config.json`, payload, "application/json");
  }

  /**
   * Export all bots as a single backup JSON file.
   * @param {BotConfig[]} bots
   */
  exportAll(bots) {
    const payload = JSON.stringify(
      { botforge: true, version: SCHEMA_VERSION, exportedAt: new Date().toISOString(), bots: bots.map(b => b.toJSON()) },
      null, 2
    );
    this.#download("botforge-backup.json", payload, "application/json");
  }

  /**
   * Import bots from a JSON File object.
   * @param {File} file
   * @returns {Promise<BotConfig[]>} imported bots (one or many)
   */
  async importFromFile(file) {
    const text = await file.text();
    const data = JSON.parse(text);

    if (!data.botforge) throw new Error("Not a valid JavoBot export file.");

    if (data.bot)  return [BotConfig.fromJSON(data.bot)];
    if (data.bots) return data.bots.map(BotConfig.fromJSON);

    throw new Error("Export file contains no bots.");
  }

  // ── Storage usage ───────────────────────────────────────────────────────

  /** Estimate how many bytes the store is using. */
  estimateUsage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) ?? "";
      return new Blob([raw]).size;
    } catch {
      return 0;
    }
  }

  // ── Private helpers ─────────────────────────────────────────────────────

  #download(filename, content, type) {
    const blob = new Blob([content], { type });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement("a"), { href: url, download: filename });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

/** Shared singleton */
export const storageService = new StorageService();
