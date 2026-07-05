import { FOOTBALL_API_KEY } from '../config.js';
import { logger } from '../utils/logger.js';

const BASE_URL = 'https://api.football-data.org/v4';
const COMPETITION_ID = 2000; // جام جهانی ۲۰۲۶

const headers = {
  'X-Auth-Token': FOOTBALL_API_KEY
};

// گرفتن بازی‌های یک بازه تاریخی
export async function getTodaysMatches(dateFrom, dateTo) {
  try {
    const url = `${BASE_URL}/competitions/${COMPETITION_ID}/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`;
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    return data.matches;
  } catch (err) {
    logger.error('Fetch matches error:', err.message);
    throw err;
  }
}

// جدول رده‌بندی
export async function getStandings() {
  try {
    const url = `${BASE_URL}/competitions/${COMPETITION_ID}/standings`;
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    return data.standings;
  } catch (err) {
    logger.error('Fetch standings error:', err.message);
    throw err;
  }
}

// جستجوی تیم و بازی‌های آینده‌اش
export async function getTeamNextMatches(teamName) {
  const searchUrl = `${BASE_URL}/teams?name=${encodeURIComponent(teamName)}`;
  const searchRes = await fetch(searchUrl, { headers });
  if (!searchRes.ok) throw new Error(`Team search error: ${searchRes.status}`);
  const searchData = await searchRes.json();
  if (!searchData.teams || searchData.teams.length === 0) return null;
  
  const team = searchData.teams[0];
  const matchesUrl = `${BASE_URL}/teams/${team.id}/matches?competitions=${COMPETITION_ID}&status=SCHEDULED&limit=5`;
  const matchesRes = await fetch(matchesUrl, { headers });
  if (!matchesRes.ok) throw new Error(`Team matches error: ${matchesRes.status}`);
  const matchesData = await matchesRes.json();
  return { team: team.name, matches: matchesData.matches };
}

// دریافت ۵ بازی اخیر یک تیم (برای پیش‌بینی)
export async function getTeamRecentMatches(teamId) {
  try {
    const url = `${BASE_URL}/teams/${teamId}/matches?limit=5&status=FINISHED&competitions=${COMPETITION_ID}`;
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`Recent matches error: ${res.status}`);
    const data = await res.json();
    return data.matches;
  } catch (err) {
    logger.error('Fetch recent matches error:', err.message);
    throw err;
  }
}

// جستجوی تیم و گرفتن آی‌دی (برای پیش‌بینی)
export async function searchTeam(teamName) {
  const searchUrl = `${BASE_URL}/teams?name=${encodeURIComponent(teamName)}`;
  const searchRes = await fetch(searchUrl, { headers });
  if (!searchRes.ok) throw new Error(`Team search error: ${searchRes.status}`);
  const searchData = await searchRes.json();
  if (!searchData.teams || searchData.teams.length === 0) return null;
  return searchData.teams[0]; // { id, name, ... }
}

// دریافت جدول گلزنان جام جهانی
export async function getScorers() {
  try {
    const url = `${BASE_URL}/competitions/${COMPETITION_ID}/scorers?limit=10`;
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`Scorers error: ${res.status}`);
    const data = await res.json();
    return data.scorers;
  } catch (err) {
    logger.error('Fetch scorers error:', err.message);
    throw err;
  }
                 }
