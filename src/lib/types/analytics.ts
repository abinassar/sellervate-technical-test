import { QualityLevel } from "./quality-level";
import { User } from "./user";

export interface QualityLevelMetric {
  qualityLevel: QualityLevel;
  count: number;
  percentage: number;
}

export interface SpecialistStats {
  specialist: User;
  assignedConversationsCount: number;
  totalConversationsMessages: number;
  averageMessagesPerConversation: number;
  totalSpecialistMessages: number;
  totalRatedMessages: number;
  qualityBreakdown: QualityLevelMetric[];
}

export interface EvaluatedMessageFeedItem {
  id: string;
  message: string;
  conversationId: string;
  conversationTitle: string;
  conversationCode: string;
  createdAt: Date;
  updatedAt: Date;
  qualityLevel: QualityLevel;
  ratingUser?: User | null;
}

export interface HomeAnalyticsData {
  globalQualityDistribution: QualityLevelMetric[];
  specialistsStats: SpecialistStats[];
}
