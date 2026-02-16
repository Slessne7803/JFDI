
export type BrainItemType = 'task' | 'idea' | 'win' | 'note';

export interface BrainItem {
  id: string;
  type: BrainItemType;
  content: string;
  title: string;
  category: string;
  timestamp: number;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  tags: string[];
}

export type ColorPalette = 'default' | 'earthy' | 'ocean' | 'midnight';

export interface UserPreferences {
  palette: ColorPalette;
  notificationsEnabled: boolean;
  nudgeFrequency: 'low' | 'medium' | 'high';
  aiContext: string;
}

export interface UserProfile {
  name: string;
  avatar: string;
  streak: number;
  totalWins: number;
  preferences: UserPreferences;
}
