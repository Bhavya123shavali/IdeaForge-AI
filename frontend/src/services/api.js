import {
  cacheHistory,
  compareKnownIdeas,
  createLocalValidation,
  deleteKnownEntry,
  fallbackSampleIdeas,
  getKnownEntry,
  getLocalHistory
} from "./localValidation";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api";

class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function formatErrorDetail(error) {
  const detail = error?.detail || error?.message;
  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg || item.message || "Invalid input").join(" ");
  }
  if (typeof detail === "string") return detail;
  return "Request failed";
}

function mergeHistory(remoteEntries) {
  const merged = [...getLocalHistory(), ...(Array.isArray(remoteEntries) ? remoteEntries : [])];
  const seen = new Set();
  return merged.filter((entry) => {
    if (!entry?.id || seen.has(entry.id)) return false;
    seen.add(entry.id);
    return true;
  });
}

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      ...options
    });
  } catch {
    throw new ApiError("Backend is unavailable. Using local demo analysis.", 0);
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Request failed" }));
    throw new ApiError(formatErrorDetail(error), response.status);
  }

  return response.json();
}

export const api = {
  validateIdea: async (payload) => {
    try {
      return await request("/validate", {
        method: "POST",
        body: JSON.stringify(payload)
      });
    } catch (error) {
      if (error.status === 0) return createLocalValidation(payload);
      throw error;
    }
  },
  getHistory: async () => {
    try {
      const remoteEntries = await request("/history");
      const entries = mergeHistory(remoteEntries);
      cacheHistory(entries);
      return entries;
    } catch {
      const entries = mergeHistory([]);
      cacheHistory(entries);
      return entries;
    }
  },
  getHistoryEntry: async (id) => {
    const knownEntry = getKnownEntry(id);
    if (knownEntry) return knownEntry;
    return request(`/history/${id}`);
  },
  getSampleIdeas: async () => {
    try {
      const ideas = await request("/sample-ideas");
      return Array.isArray(ideas) && ideas.length ? ideas : fallbackSampleIdeas;
    } catch {
      return fallbackSampleIdeas;
    }
  },
  compareIdeas: async (entryIds) => {
    try {
      return await request("/compare", {
        method: "POST",
        body: JSON.stringify({ entry_ids: entryIds })
      });
    } catch {
      return compareKnownIdeas(entryIds);
    }
  },
  deleteHistoryEntry: async (id) => {
    try {
      await request(`/history/${id}`, { method: "DELETE" });
    } catch (error) {
      if (error.status && error.status !== 404) throw error;
    } finally {
      deleteKnownEntry(id);
      window.dispatchEvent(new Event("historyChanged"));
      window.dispatchEvent(new Event("likedIdeasChanged"));
    }
  }
};
