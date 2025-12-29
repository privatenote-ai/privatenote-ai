import type { KVNamespace } from "@cloudflare/workers-types";
import type { Note, InsertNote } from "@shared/schema";

// Stored format in KV (dates as ISO strings)
interface StoredNote {
  id: string;
  content: string;
  iv: string;
  expiresAt: string; // ISO timestamp
  maxReads: number;
  currentReads: number;
  createdAt: string; // ISO timestamp
  isPasswordProtected: boolean;
  salt: string | null;
  encryptedKey: string | null;
  encryptedKeyIv: string | null;
}

// KV TTL limits
const MIN_TTL_SECONDS = 60;
const MAX_TTL_SECONDS = 2147483647; // ~68 years

export class KVNoteStorage {
  constructor(private kv: KVNamespace) {}

  private getKey(id: string): string {
    return `note:${id}`;
  }

  private calculateTTL(expiresAt: Date): number | undefined {
    const now = Date.now();
    const expiresAtMs = expiresAt.getTime();
    const ttlSeconds = Math.floor((expiresAtMs - now) / 1000);

    // If already expired, reject
    if (ttlSeconds <= 0) {
      return undefined;
    }

    // If beyond max TTL, return undefined (store without TTL, check manually)
    if (ttlSeconds > MAX_TTL_SECONDS) {
      return undefined;
    }

    // Clamp to minimum TTL
    return Math.max(MIN_TTL_SECONDS, ttlSeconds);
  }

  private noteToStored(note: Note): StoredNote {
    return {
      id: note.id,
      content: note.content,
      iv: note.iv,
      expiresAt: note.expiresAt instanceof Date 
        ? note.expiresAt.toISOString() 
        : new Date(note.expiresAt).toISOString(),
      maxReads: note.maxReads || 1,
      currentReads: note.currentReads || 0,
      createdAt: note.createdAt instanceof Date
        ? note.createdAt.toISOString()
        : new Date(note.createdAt).toISOString(),
      isPasswordProtected: note.isPasswordProtected || false,
      salt: note.salt || null,
      encryptedKey: note.encryptedKey || null,
      encryptedKeyIv: note.encryptedKeyIv || null,
    };
  }

  private storedToNote(stored: StoredNote): Note {
    return {
      id: stored.id,
      content: stored.content,
      iv: stored.iv,
      expiresAt: new Date(stored.expiresAt),
      maxReads: stored.maxReads,
      currentReads: stored.currentReads,
      createdAt: new Date(stored.createdAt),
      isPasswordProtected: stored.isPasswordProtected,
      salt: stored.salt,
      encryptedKey: stored.encryptedKey,
      encryptedKeyIv: stored.encryptedKeyIv,
    };
  }

  async getNoteById(id: string): Promise<Note | undefined> {
    const key = this.getKey(id);
    const value = await this.kv.get(key);
    
    if (!value) {
      return undefined;
    }

    try {
      const stored: StoredNote = JSON.parse(value);
      const note = this.storedToNote(stored);
      
      // Check if manually expired (for notes beyond max TTL)
      if (new Date(note.expiresAt) < new Date()) {
        // Delete expired note
        await this.kv.delete(key);
        return undefined;
      }

      return note;
    } catch (error) {
      console.error(`Error parsing note ${id}:`, error);
      return undefined;
    }
  }

  async createNote(noteData: Omit<InsertNote, "id">, id: string): Promise<Note> {
    const note: Note = {
      id,
      content: noteData.content,
      iv: noteData.iv,
      expiresAt: noteData.expiresAt instanceof Date 
        ? noteData.expiresAt 
        : new Date(noteData.expiresAt),
      maxReads: noteData.maxReads || 1,
      currentReads: 0,
      createdAt: new Date(),
      isPasswordProtected: noteData.isPasswordProtected || false,
      encryptedKey: noteData.encryptedKey || null,
      encryptedKeyIv: noteData.encryptedKeyIv || null,
      salt: noteData.salt || null,
    };

    const stored = this.noteToStored(note);
    const key = this.getKey(id);
    const ttl = this.calculateTTL(note.expiresAt);

    if (ttl === undefined) {
      // If TTL is undefined (expired or too long), check expiration manually
      // Store without TTL, but reject if already expired
      if (note.expiresAt < new Date()) {
        throw new Error("Cannot create note with expiration in the past");
      }
      await this.kv.put(key, JSON.stringify(stored));
    } else {
      await this.kv.put(key, JSON.stringify(stored), { expirationTtl: ttl });
    }

    return note;
  }

  async updateNoteReadCount(id: string): Promise<Note | undefined> {
    const note = await this.getNoteById(id);
    if (!note) {
      return undefined;
    }

    // Increment read count
    note.currentReads = (note.currentReads || 0) + 1;

    // Update in KV
    const stored = this.noteToStored(note);
    const key = this.getKey(id);
    
    // Recalculate TTL to preserve expiration
    const ttl = this.calculateTTL(note.expiresAt);
    
    if (ttl === undefined) {
      await this.kv.put(key, JSON.stringify(stored));
    } else {
      await this.kv.put(key, JSON.stringify(stored), { expirationTtl: ttl });
    }

    return note;
  }

  async deleteNote(id: string): Promise<void> {
    const key = this.getKey(id);
    await this.kv.delete(key);
  }
}

