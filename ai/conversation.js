import { SYSTEM_PROMPT } from '../prompts/systemPrompt.js';

const conversations = new Map(); // chatId -> array of {role, parts}

export function getHistory(chatId) {
  if (!conversations.has(chatId)) {
    conversations.set(chatId, [
      { role: 'user', parts: [{ text: 'Hello' }] },
      { role: 'model', parts: [{ text: "Hi! I'm your AI assistant. How can I help you today?" }] },
    ]);
  }
  return conversations.get(chatId);
}

export function addMessage(chatId, role, text) {
  const history = getHistory(chatId);
  history.push({ role, parts: [{ text }] });
  // Keep only last 20 messages to avoid token overflow
  if (history.length > 40) history.splice(0, 2);
}

export function clearHistory(chatId) {
  conversations.delete(chatId);
  // Reinitialize with default greeting
  getHistory(chatId);
}
