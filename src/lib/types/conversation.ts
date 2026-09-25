import { BaseEntity, BaseEntitySql, CreateEntityInput, UpdateEntityInput } from "./base-entity";
import { Product } from "./product";
import { QualityLevel } from "./quality-level";
import { User } from "./user";

import { Message } from "./message";

export interface Conversation extends BaseEntity {
  code: string;
  name: string;
  description: string;
  title: string;
  idProduct: string;
  idUser: string;
  idCustomer: string;
  idQualityLevel?: string | null;
  idRatingUser?: string | null;
  product?: Product;
  user?: User;
  customer?: User;
  qualityLevel?: QualityLevel | null;
  ratingUser?: User | null;
  messages?: Message[];
  messagesCount?: number;
}

export interface ConversationSql extends BaseEntitySql {
  code: string;
  name: string;
  description: string;
  title: string;
  product_id: string;
  user_id: string;
  customer_id: string;
  quality_level_id?: string | null;
  rating_user_id?: string | null;
}

export type CreateConversationInput = CreateEntityInput<Conversation>;
export type UpdateConversationInput = UpdateEntityInput<Conversation>;
