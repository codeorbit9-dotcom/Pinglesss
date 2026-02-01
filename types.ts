
export type PlanType = 'Free' | 'Pro';

export interface User {
  id: string;
  email: string;
  name?: string;
  plan: PlanType;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  usage: number;
  limit: number;
  status: 'active' | 'disabled';
  createdAt: string;
  targetApiKey?: string;
  defaultTargetUrl?: string; // The endpoint this key is meant to protect
}

export interface FirewallRule {
  id: string;
  type: 'IP' | 'Domain' | 'Path';
  value: string;
  action: 'Block' | 'Allow';
  enabled: boolean;
  createdAt: string;
}

export interface AnalyticsData {
  timestamp: string;
  requests: number;
  blocked: number;
  latency: number;
}

export enum AppRoute {
  Landing = '/',
  Dashboard = '/dashboard',
  Keys = '/keys',
  Rules = '/rules',
  Billing = '/billing',
  Login = '/login',
  Signup = '/signup',
  Profile = '/profile',
  Docs = '/docs',
  Developers = '/developers',
  Playground = '/playground'
}
