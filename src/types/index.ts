export const EventCondition = {
  CONDITION_ACTIVE: 'active',
  CONDITION_WARNING: 'warning',
  CONDITION_ERROR: 'error',
} as const;

export type EventCondition = (typeof EventCondition)[keyof typeof EventCondition];

export interface Product {
  id: string;
  name: string;
  description: string;
  type: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface Report {
  id: string;
  productId: string;
  title: string;
  description: string;
  reportDate: string;
  createdAt: string;
}

export interface Event {
  id: string;
  reportId: string;
  productId: string;
  condition: EventCondition;
  title: string;
  description: string;
  occurredAt: string;
  createdAt: string;
}
