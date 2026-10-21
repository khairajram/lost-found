import { apiClient } from './api';
import { Match, MatchStatus, ReturnDetails } from '../types/match';
import { INITIAL_MATCHES } from './mockData';

let inMemoryMatches: Match[] = [...INITIAL_MATCHES];

export const matchService = {
  async getMatches(status?: MatchStatus): Promise<Match[]> {
    try {
      const res = await apiClient.get('/matches', { params: { status } });
      return res.data?.data || res.data;
    } catch {
      if (!status) return inMemoryMatches;
      return inMemoryMatches.filter((m) => m.status === status);
    }
  },

  async getMatchById(id: string): Promise<Match | null> {
    try {
      const res = await apiClient.get(`/matches/${id}`);
      return res.data?.data || res.data;
    } catch {
      return inMemoryMatches.find((m) => m._id === id) || null;
    }
  },

  async acceptMatch(id: string): Promise<Match> {
    try {
      const res = await apiClient.post(`/matches/${id}/accept`);
      return res.data?.data || res.data;
    } catch {
      const match = inMemoryMatches.find((m) => m._id === id);
      if (match) {
        match.status = 'ACCEPTED';
        match.updatedAt = new Date().toISOString();
        return { ...match };
      }
      throw new Error('Match not found');
    }
  },

  async rejectMatch(id: string): Promise<Match> {
    try {
      const res = await apiClient.post(`/matches/${id}/reject`);
      return res.data?.data || res.data;
    } catch {
      const match = inMemoryMatches.find((m) => m._id === id);
      if (match) {
        match.status = 'REJECTED';
        match.updatedAt = new Date().toISOString();
        return { ...match };
      }
      throw new Error('Match not found');
    }
  },

  async submitVerification(id: string, answer: string): Promise<Match> {
    try {
      const res = await apiClient.post(`/matches/${id}/verify`, { answer });
      return res.data?.data || res.data;
    } catch {
      const match = inMemoryMatches.find((m) => m._id === id);
      if (match) {
        match.verificationStatus = 'PASSED';
        match.verificationAnswerProvided = answer;
        match.status = 'RETURN_IN_PROGRESS';
        match.updatedAt = new Date().toISOString();
        return { ...match };
      }
      throw new Error('Match not found');
    }
  },

  async confirmReturned(id: string, details?: ReturnDetails): Promise<Match> {
    try {
      const res = await apiClient.post(`/matches/${id}/returned`, details);
      return res.data?.data || res.data;
    } catch {
      const match = inMemoryMatches.find((m) => m._id === id);
      if (match) {
        match.status = 'RETURNED';
        match.returnDetails = {
          ...match.returnDetails,
          ...details,
          handoverCompleted: true,
        };
        match.updatedAt = new Date().toISOString();
        return { ...match };
      }
      throw new Error('Match not found');
    }
  },
};
