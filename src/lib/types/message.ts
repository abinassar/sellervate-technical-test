import { BaseEntity, BaseEntitySql, CreateEntityInput, UpdateEntityInput } from "./base-entity";
import { Conversation } from "./conversation";
import { QualityLevel } from "./quality-level";
import { User } from "./user";

export interface Message extends BaseEntity {
  name: string;
  message: string;
  idConversation: string;
  idUserAuthor: string;
  idQualityLevel?: string | null;
  idRatingUser?: string | null;
  conversation?: Conversation;
  userAuthor?: User;
  qualityLevel?: QualityLevel | null;
  ratingUser?: User | null;
}

export interface MessageSql extends BaseEntitySql {
  name: string;
  message: string;
  conversation_id: string;
  user_author_id: string;
  quality_level_id?: string | null;
  rating_user_id?: string | null;
}

export type CreateMessageInput = CreateEntityInput<Message>;
export type UpdateMessageInput = UpdateEntityInput<Message>;
