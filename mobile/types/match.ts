import { User } from './user';
import { LostItem, FoundItem } from './item';

export type MatchStatus =
  | 'POTENTIAL'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'CONTACTED'
  | 'RETURN_IN_PROGRESS'
  | 'RETURNED'
  | 'DISPUTED'
  | 'CLOSED';

export interface SimilarityBreakdown {
  visualSimilarity: number;
  categorySimilarity: number;
  colorSimilarity: number;
  brandSimilarity: number;
  locationSimilarity: number;
  dateSimilarity: number;
  descriptionSimilarity: number;
}

export interface ReturnDetails {
  meetingLocation?: string;
  meetingTime?: string;
  confirmedByOwner?: boolean;
  confirmedByFinder?: boolean;
  handoverCompleted?: boolean;
  notes?: string;
}

export interface Match {
  _id: string;
  lostItemId: string | LostItem;
  foundItemId: string | FoundItem;
  lostUserId: string | User;
  foundUserId: string | User;
  matchScore: number;
  similarityBreakdown: SimilarityBreakdown;
  aiReasoning: string[];
  status: MatchStatus;
  verificationStatus?: 'NONE' | 'PENDING' | 'PASSED' | 'FAILED';
  verificationQuestion?: string;
  verificationAnswerProvided?: string;
  returnDetails?: ReturnDetails;
  createdAt: string;
  updatedAt: string;
}
