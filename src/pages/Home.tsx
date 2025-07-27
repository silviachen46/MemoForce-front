import { useState } from 'react';
import type { Card, CardSet } from '../App';
import CardDisplay from '../components/CardDisplay';
import StorageTest from '../components/StorageTest';
import DataBackup from '../components/DataBackup';
import React from 'react'; // Added missing import for React

interface HomeProps {
  currentSet: CardSet | null;
  onAddCards: (cards: Card[]) => void;
  onUpdateCard: (cardId: string, updates: Partial<Card>) => void;
  onDeleteCard: (cardId: string) => void;
  apiKey: string;
  onCheckApiKey: () => boolean;
  onImportData?: (cardSets: CardSet[]) => void;
  onShowApiKeyModal?: () => void;
  onToggleFavorite?: (cardId: string) => void;  // 添加收藏回调
}

const Home = ({ 
  currentSet, 
  onAddCards, 
  onUpdateCard, 
  onDeleteCard, 
  apiKey, 
  onCheckApiKey, 
  onImportData,
  onShowApiKeyModal,
  onToggleFavorite
}: HomeProps) => {
  const [question, setQuestion] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [generationMode, setGenerationMode] = useState<'basic' | 'formula' | 'code'>('basic');
  const [isLoading, setIsLoading] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showGenerateMore, setShowGenerateMore] = useState(false);
  const [previousCardIndex, setPreviousCardIndex] = useState(0);
  const [sortedCardIndices, setSortedCardIndices] = useState<number[]>([]);
  const [showDetailedView, setShowDetailedView] = useState(false);

  // Function to sort cards based on review mode
  const getSortedCards = (cards: Card[]) => {
    if (!currentSet) return cards;
    
    switch (currentSet.reviewMode) {
      case 'normal':
        return [...cards]; // Keep original order
      case 'new-only':
        return cards.filter(card => card.reviewedCount === 0 && card.masteredCount === 0);
      case 'top-review':
        return [...cards].sort((a, b) => b.reviewedCount - a.reviewedCount);
      case 'least-mastered':
        return [...cards].sort((a, b) => a.masteredCount - b.masteredCount);
      default:
        return cards;
    }
  };

  // Update sorted card indices when currentSet or review mode changes
  React.useEffect(() => {
    if (currentSet) {
      const sortedCards = getSortedCards(currentSet.cards);
      const indices = sortedCards.map(card => currentSet.cards.findIndex(c => c.id === card.id));
      setSortedCardIndices(indices);
      // Reset current card index if it's out of bounds
      if (currentCardIndex >= indices.length) {
        setCurrentCardIndex(0);
      }
    }
  }, [currentSet, currentSet?.reviewMode, currentSet?.cards]);

  const generateCards = async (prompt: string, numberOfCards: number) => {
    try {
      const response = await fetch('https://memoforce-back.onrender.com/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey
        },
        body: JSON.stringify({
          prompt: prompt,
          number_of_cards: numberOfCards,
          mode: generationMode
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error generating cards:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!question.trim() || !currentSet) return;
    
    // Check if API key is available
    if (!onCheckApiKey()) {
      return; // Modal will be shown by onCheckApiKey
    }
    
    setIsLoading(true);
    
    try {
      const generatedCards = await generateCards(question, numQuestions);
      
      // Transform the API response to our Card format
      const newCards: Card[] = generatedCards.map((card: any, index: number) => ({
        id: Date.now().toString() + index,
        question: card.question,
        answer: card.answer,
        hint: card.hint,
        code: card.code,
        formula: card.formula,
        reviewedCount: 0,
        masteredCount: 0,
        isMastered: false
      }));
      
      onAddCards(newCards);
      setQuestion('');
      setCurrentCardIndex(0);
      setShowGenerateMore(false);
    } catch (error) {
      console.error('Failed to generate cards:', error);
      alert('Failed to generate cards. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateMore = () => {
    setPreviousCardIndex(currentCardIndex);
    setShowGenerateMore(true);
  };

  const handleBack = () => {
    setShowGenerateMore(false);
    setCurrentCardIndex(previousCardIndex);
  };

  const handleMastered = () => {
    if (!currentSet || currentCardIndex >= sortedCardIndices.length) return;
    
    const actualCardIndex = sortedCardIndices[currentCardIndex];
    const card = currentSet.cards[actualCardIndex];
    
    onUpdateCard(card.id, {
      masteredCount: card.masteredCount + 1,
      reviewedCount: card.reviewedCount + 1,
      isMastered: card.masteredCount + 1 >= 3
    });
    
    // Move to next card after updating
    if (currentCardIndex < sortedCardIndices.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const handleReview = () => {
    if (!currentSet || currentCardIndex >= sortedCardIndices.length) return;
    
    const actualCardIndex = sortedCardIndices[currentCardIndex];
    const card = currentSet.cards[actualCardIndex];
    
    onUpdateCard(card.id, {
      reviewedCount: card.reviewedCount + 1
    });
    
    setShowDetailedView(true);
  };

  const handleBackToCard = () => {
    setShowDetailedView(false);
  };

  const handleNextCard = () => {
    if (currentCardIndex < sortedCardIndices.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const handlePreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  // Add this function to handle API key button click
  const handleApiKeyClick = () => {
    if (onShowApiKeyModal) {
      onShowApiKeyModal();
    }
  };

  if (!currentSet) {
    return (
      <div className="home-page">
        <div className="welcome-message">
          <h2>Welcome to MemoForce</h2>
          <p>Create a new set from the sidebar to get started!</p>
        </div>
        <StorageTest />
        <DataBackup onImport={onImportData || (() => {})} />
      </div>
    );
  }

  if (currentSet.cards.length === 0 || showGenerateMore) {
    return (
      <div className="home-page">
        <div className="card-generation">
          <div className="generation-header">
            <h2>Generate Cards for: {currentSet.name}</h2>
            <div className="generation-header-actions">
              {onShowApiKeyModal && (
                <button 
                  onClick={handleApiKeyClick}
                  className="api-key-btn"
                  title="Update API Key"
                >
                  🔑 API Key
                </button>
              )}
              {showGenerateMore && currentSet.cards.length > 0 && (
                <button 
                  onClick={handleBack}
                  className="back-btn"
                >
                  ← Back to Cards
                </button>
              )}
            </div>
          </div>
          <div className="input-section">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your question or topic..."
              className="question-input"
            />
            <div className="number-input-section">
              <input
                type="number"
                value={numQuestions}
                onChange={(e) => setNumQuestions(parseInt(e.target.value) || 1)}
                min="1"
                max="50"
                className="number-input"
              />
              <select
                value={generationMode}
                onChange={(e) => setGenerationMode(e.target.value as 'basic' | 'formula' | 'code')}
                className="generation-mode-select"
              >
                <option value="basic">Basic</option>
                <option value="formula">Formula</option>
                <option value="code">Code</option>
              </select>
              <button 
                onClick={handleSubmit}
                disabled={isLoading || !question.trim()}
                className="submit-btn"
              >
                {isLoading ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="card-view">
        <div className="card-navigation">
          <button 
            onClick={handlePreviousCard}
            disabled={currentCardIndex === 0}
            className="nav-btn"
          >
            ← Previous
          </button>
          <span className="card-counter">
            {currentCardIndex + 1} / {sortedCardIndices.length}
          </span>
          <button 
            onClick={handleNextCard}
            disabled={currentCardIndex === sortedCardIndices.length - 1}
            className="nav-btn"
          >
            Next →
          </button>
        </div>
        
        <div className="generate-more-container">
          <button 
            onClick={handleGenerateMore}
            className="generate-more-btn"
          >
            Generate More
          </button>
        </div>
        
        {sortedCardIndices.length > 0 && (
          <CardDisplay
            card={currentSet.cards[sortedCardIndices[currentCardIndex]]}
            showDetailed={showDetailedView}
            onMastered={handleMastered}
            onReview={handleReview}
            onUpdateCard={onUpdateCard}
            onDeleteCard={onDeleteCard}
            onBack={handleBackToCard}
            onToggleFavorite={onToggleFavorite}  // 传递收藏回调
          />
        )}
      </div>
    </div>
  );
};

export default Home; 