import { BaseEntity, BaseEntitySql, CreateEntityInput, UpdateEntityInput } from "./base-entity";
import { Product } from "./product";
import { User } from "./user";

export interface Conversation extends BaseEntity {
  code: string;
  name: string;
  description: string;
  title: string;
  idProduct: string;
  idUser: string;
  idCustomer: string;
  product?: Product;
  user?: User;
  customer?: User;
}

export interface ConversationSql extends BaseEntitySql {
  code: string;
  name: string;
  description: string;
  title: string;
  product_id: string;
  user_id: string;
  customer_id: string;
}

export type CreateConversationInput = CreateEntityInput<Conversation>;
export type UpdateConversationInput = UpdateEntityInput<Conversation>;
