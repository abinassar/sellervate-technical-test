import { BaseEntity, BaseEntitySql, CreateEntityInput, UpdateEntityInput } from "./base-entity";
import { Conversation } from "./conversation";
import { User } from "./user";

export interface Message extends BaseEntity {
  name: string;
  message: string;
  idConversation: string;
  idUserAuthor: string;
  conversation?: Conversation;
  userAuthor?: User;
}

export interface MessageSql extends BaseEntitySql {
  name: string;
  message: string;
  conversation_id: string;
  user_author_id: string;
}

export type CreateMessageInput = CreateEntityInput<Message>;
export type UpdateMessageInput = UpdateEntityInput<Message>;
