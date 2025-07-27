import type { CardSet } from '../App';

const STORAGE_KEYS = {
  CARD_SETS: 'memoforce_card_sets',
  API_KEY: 'memoforce_api_key',
  CURRENT_SET: 'memoforce_current_set'
};

export const storage = {
  // 保存卡片集合
  saveCardSets: (cardSets: CardSet[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.CARD_SETS, JSON.stringify(cardSets));
      console.log('Card sets saved to localStorage:', cardSets.length, 'sets');
    } catch (error) {
      console.error('Error saving card sets to localStorage:', error);
    }
  },

  // 加载卡片集合
  loadCardSets: (): CardSet[] => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CARD_SETS);
      if (saved) {
        const parsedSets = JSON.parse(saved).map((set: any) => ({
          ...set,
          createdAt: new Date(set.createdAt)
        }));
        console.log('Card sets loaded from localStorage:', parsedSets.length, 'sets');
        return parsedSets;
      }
    } catch (error) {
      console.error('Error loading card sets from localStorage:', error);
    }
    return [];
  },

  // 保存当前集合
  saveCurrentSet: (currentSet: CardSet | null) => {
    try {
      if (currentSet) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_SET, JSON.stringify(currentSet));
        console.log('Current set saved to localStorage:', currentSet.name);
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_SET);
        console.log('Current set removed from localStorage');
      }
    } catch (error) {
      console.error('Error saving current set to localStorage:', error);
    }
  },

  // 加载当前集合
  loadCurrentSet: (): CardSet | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_SET);
      if (saved) {
        const parsedSet = JSON.parse(saved);
        const currentSet = {
          ...parsedSet,
          createdAt: new Date(parsedSet.createdAt)
        };
        console.log('Current set loaded from localStorage:', currentSet.name);
        return currentSet;
      }
    } catch (error) {
      console.error('Error loading current set from localStorage:', error);
    }
    return null;
  },

  // 保存API密钥
  saveApiKey: (apiKey: string) => {
    try {
      localStorage.setItem(STORAGE_KEYS.API_KEY, apiKey);
      console.log('API key saved to localStorage');
    } catch (error) {
      console.error('Error saving API key to localStorage:', error);
    }
  },

  // 加载API密钥
  loadApiKey: (): string => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.API_KEY);
      if (saved) {
        console.log('API key loaded from localStorage');
        return saved;
      }
    } catch (error) {
      console.error('Error loading API key from localStorage:', error);
    }
    return '';
  },

  // 清除所有数据
  clearAll: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.CARD_SETS);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_SET);
      localStorage.removeItem(STORAGE_KEYS.API_KEY);
      console.log('All data cleared from localStorage');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },

  // 检查存储是否可用
  isAvailable: (): boolean => {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }
}; 