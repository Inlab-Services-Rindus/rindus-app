import { Language } from '@/models/business/Language';
import { User } from '@/models/business/User';

type Position = string;

export type Suggestions = Suggestion[];

export type Suggestion = Language | Position | User[];
