import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import TopNav from './components/TopNav';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Analytics from './pages/Analytics';
import Manage from './pages/Manage';
import Search from './pages/Search';
import ApiKeyModal from './components/ApiKeyModal';
import { storage } from './utils/storage';
import './App.css';

export interface Card {
  id: string;
  question: string;
  answer: string;
  hint?: string;
  code?: string;
  formula?: string;
  reviewedCount: number;
  masteredCount: number;
  isMastered: boolean;
  isFavorite?: boolean;  // 添加收藏字段
}

export interface CardSet {
  id: string;
  name: string;
  cards: Card[];
  createdAt: Date;
  reviewMode: 'normal' | 'new-only' | 'top-review' | 'least-mastered';
}

// Component to handle the main content with conditional sidebar
function MainContent() {
  const location = useLocation();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [cardSets, setCardSets] = useState<CardSet[]>([]);
  const [currentSet, setCurrentSet] = useState<CardSet | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<'home' | 'analytics' | 'manage' | 'search'>('home');

  // Check if we should show sidebar (only on home page)
  const shouldShowSidebar = location.pathname === '/';

  // Update currentPage based on location
  useEffect(() => {
    if (location.pathname === '/') {
      setCurrentPage('home');
    } else if (location.pathname === '/analytics') {
      setCurrentPage('analytics');
    } else if (location.pathname === '/manage') {
      setCurrentPage('manage');
    } else if (location.pathname === '/search') {
      setCurrentPage('search');
    }
  }, [location.pathname]);

  // Load data from localStorage on component mount
  useEffect(() => {
    console.log('App component mounted, loading data from localStorage...');
    
    // Check if localStorage is available
    if (!storage.isAvailable()) {
      console.error('localStorage is not available in this browser');
      alert('您的浏览器不支持本地存储，数据将无法保存。请使用现代浏览器。');
      setIsLoading(false);
      return;
    }

    try {
      // Load all data
      const savedCardSets = storage.loadCardSets();
      const savedCurrentSet = storage.loadCurrentSet();
      const savedApiKey = storage.loadApiKey();

      setCardSets(savedCardSets);
      setCurrentSet(savedCurrentSet);
      setApiKey(savedApiKey);

      console.log('Data loaded successfully:', {
        cardSetsCount: savedCardSets.length,
        hasCurrentSet: !!savedCurrentSet,
        hasApiKey: !!savedApiKey
      });
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      alert('加载数据时出现错误，请刷新页面重试。');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      console.log('Data changed, saving to localStorage...');
      try {
        storage.saveCardSets(cardSets);
        storage.saveCurrentSet(currentSet);
        storage.saveApiKey(apiKey);
        console.log('Data saved successfully');
      } catch (error) {
        console.error('Error saving data to localStorage:', error);
        alert('保存数据时出现错误，请检查浏览器存储空间。');
      }
    }
  }, [cardSets, currentSet, apiKey, isLoading]);

  // 创建默认收藏夹
  const createFavoritesSet = (): CardSet => ({
    id: 'favorites',
    name: 'Collected',
    cards: [],
    createdAt: new Date(),
    reviewMode: 'normal'
  });

  // 初始化收藏夹
  useEffect(() => {
    if (!isLoading && cardSets.length > 0) {
      const favoritesSet = cardSets.find(set => set.id === 'favorites');
      if (!favoritesSet) {
        const newFavoritesSet = createFavoritesSet();
        setCardSets(prev => [newFavoritesSet, ...prev]);
      }
    }
  }, [isLoading, cardSets.length]);

  // 处理收藏/取消收藏
  const handleToggleFavorite = (cardId: string) => {
    // 更新原卡片的状态
    const updatedCardSets = cardSets.map(set => ({
      ...set,
      cards: set.cards.map(card => 
        card.id === cardId 
          ? { ...card, isFavorite: !card.isFavorite }
          : card
      )
    }));
    
    setCardSets(updatedCardSets);
    
    // 更新收藏夹
    const favoritesSet = updatedCardSets.find(set => set.id === 'favorites');
    const card = updatedCardSets.flatMap(set => set.cards).find(c => c.id === cardId);
    
    if (favoritesSet && card) {
      const updatedFavoritesSet = { ...favoritesSet };
      
      if (card.isFavorite) {
        // 添加到收藏夹
        if (!updatedFavoritesSet.cards.find(c => c.id === cardId)) {
          updatedFavoritesSet.cards = [...updatedFavoritesSet.cards, card];
        }
      } else {
        // 从收藏夹移除
        updatedFavoritesSet.cards = updatedFavoritesSet.cards.filter(c => c.id !== cardId);
      }
      
      setCardSets(prev => prev.map(set => 
        set.id === 'favorites' ? updatedFavoritesSet : set
      ));
    }
  };

  const handleCreateSet = (setName: string) => {
    const newSet: CardSet = {
      id: Date.now().toString(),
      name: setName,
      cards: [],
      createdAt: new Date(),
      reviewMode: 'normal'
    };
    console.log('Creating new set:', newSet.name);
    setCardSets(prev => [...prev, newSet]);
    setCurrentSet(newSet);
    setIsSidebarExpanded(false);
  };

  const handleAddCards = (cards: Card[]) => {
    if (!currentSet) return;
    
    console.log('Adding cards to set:', currentSet.name, cards.length, 'cards');
    const updatedSet = {
      ...currentSet,
      cards: [...currentSet.cards, ...cards]
    };
    
    setCardSets(prev => prev.map(set => 
      set.id === currentSet.id ? updatedSet : set
    ));
    setCurrentSet(updatedSet);
  };

  const handleUpdateCard = (cardId: string, updates: Partial<Card>) => {
    console.log('Updating card:', cardId, updates);
    setCardSets(prev => prev.map(set => ({
      ...set,
      cards: set.cards.map(card => 
        card.id === cardId ? { ...card, ...updates } : card
      )
    })));
    
    if (currentSet) {
      setCurrentSet(prev => prev ? {
        ...prev,
        cards: prev.cards.map(card => 
          card.id === cardId ? { ...card, ...updates } : card
        )
      } : null);
    }
  };

  const handleDeleteCard = (cardId: string) => {
    console.log('Deleting card:', cardId);
    setCardSets(prev => prev.map(set => ({
      ...set,
      cards: set.cards.filter(card => card.id !== cardId)
    })));
    
    if (currentSet) {
      setCurrentSet(prev => prev ? {
        ...prev,
        cards: prev.cards.filter(card => card.id !== cardId)
      } : null);
    }
  };

  const handleDeleteSet = (setId: string) => {
    console.log('Deleting set:', setId);
    setCardSets(prev => prev.filter(set => set.id !== setId));
    if (currentSet?.id === setId) {
      setCurrentSet(null);
    }
  };

  const handleUpdateSet = (setId: string, updates: Partial<CardSet>) => {
    console.log('Updating set:', setId, updates);
    setCardSets(prev => prev.map(set => 
      set.id === setId ? { ...set, ...updates } : set
    ));
    if (currentSet?.id === setId) {
      setCurrentSet(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const handleApiKeySave = (key: string) => {
    console.log('Saving API key');
    setApiKey(key);
    setShowApiKeyModal(false);
  };

  const handleImportData = (cardSets: CardSet[]) => {
    console.log('Importing data:', cardSets.length, 'sets');
    setCardSets(cardSets);
  };

  const checkApiKey = () => {
    if (!apiKey) {
      setShowApiKeyModal(true);
      return false;
    }
    return true;
  };

  // Add this function to handle API key button click
  const handleShowApiKeyModal = () => {
    setShowApiKeyModal(true);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>正在加载数据...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <TopNav currentPage={currentPage} onPageChange={setCurrentPage} />
      <div className="main-content">
        {shouldShowSidebar && (
          <Sidebar 
            isExpanded={isSidebarExpanded}
            onToggle={() => setIsSidebarExpanded(!isSidebarExpanded)}
            cardSets={cardSets}
            onCreateSet={handleCreateSet}
            onSelectSet={setCurrentSet}
          />
        )}
        <div className={`content-area ${!shouldShowSidebar ? 'full-width' : ''}`}>
          <Routes>
            <Route 
              path="/" 
              element={
                <Home 
                  currentSet={currentSet}
                  onAddCards={handleAddCards}
                  onUpdateCard={handleUpdateCard}
                  onDeleteCard={handleDeleteCard}
                  apiKey={apiKey}
                  onCheckApiKey={checkApiKey}
                  onImportData={handleImportData}
                  onShowApiKeyModal={handleShowApiKeyModal}
                  onToggleFavorite={handleToggleFavorite}
                />
              } 
            />
            <Route 
              path="/analytics" 
              element={<Analytics cardSets={cardSets} />} 
            />
            <Route 
              path="/manage" 
              element={
                <Manage 
                  cardSets={cardSets}
                  onDeleteSet={handleDeleteSet}
                  onUpdateSet={handleUpdateSet}
                  onDeleteCard={handleDeleteCard}
                />
              } 
            />
            <Route 
              path="/search" 
              element={<Search cardSets={cardSets} onDeleteCard={handleDeleteCard} />} 
            />
          </Routes>
        </div>
      </div>
      
      {showApiKeyModal && (
        <ApiKeyModal
          onSave={handleApiKeySave}
          onCancel={() => setShowApiKeyModal(false)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}

export default App;
