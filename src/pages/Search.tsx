import { useState, useMemo } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import type { CardSet, Card } from '../App';

// LaTeX rendering component with error handling
const LaTeXRenderer = ({ formula, displayMode = false }: { formula: string; displayMode?: boolean }) => {
  try {
    if (displayMode) {
      return <BlockMath math={formula} />;
    } else {
      return <InlineMath math={formula} />;
    }
  } catch (error) {
    console.error('LaTeX rendering error:', error);
    return <span className="latex-error">{formula}</span>;
  }
};

interface SearchProps {
  cardSets: CardSet[];
  onDeleteCard: (cardId: string) => void;
}

const Search = ({ cardSets, onDeleteCard }: SearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<Card | null>(null);

  // Search through all cards in all sets
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    const results: Array<{ card: Card; set: CardSet; setIndex: number; cardIndex: number }> = [];
    
    cardSets.forEach((set, setIndex) => {
      set.cards.forEach((card, cardIndex) => {
        const matchesQuestion = card.question.toLowerCase().includes(query);
        const matchesAnswer = card.answer.toLowerCase().includes(query);
        const matchesHint = card.hint?.toLowerCase().includes(query) || false;
        
        if (matchesQuestion || matchesAnswer || matchesHint) {
          results.push({ card, set, setIndex, cardIndex });
        }
      });
    });
    
    return results;
  }, [searchQuery, cardSets]);

  const handleDeleteCard = (card: Card) => {
    setCardToDelete(card);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteCard = () => {
    if (cardToDelete) {
      onDeleteCard(cardToDelete.id);
      setShowDeleteConfirm(false);
      setCardToDelete(null);
    }
  };

  const cancelDeleteCard = () => {
    setShowDeleteConfirm(false);
    setCardToDelete(null);
  };

  return (
    <div className="search-page">
      <h2>Search Cards</h2>
      
      <div className="search-container">
        <div className="search-input-section">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for questions, answers, or hints..."
            className="search-input"
          />
          <div className="search-stats">
            {searchQuery.trim() && (
              <p>Found {searchResults.length} card{searchResults.length !== 1 ? 's' : ''}</p>
            )}
          </div>
        </div>
        
        <div className="search-results">
          {searchQuery.trim() ? (
            searchResults.length > 0 ? (
              <div className="cards-grid">
                {searchResults.map(({ card, set, setIndex, cardIndex }) => (
                  <div key={card.id} className="card-item">
                    <button 
                      onClick={() => handleDeleteCard(card)}
                      className="card-delete-btn"
                      title="Delete card"
                    >
                      ×
                    </button>
                    <div className="card-header">
                      <span className="card-number">#{cardIndex + 1}</span>
                      <span className="card-set-name">from {set.name}</span>
                    </div>
                    <div className="card-content">
                      <p className="card-question">{card.question}</p>
                      <p className="card-answer">{card.answer}</p>
                      {card.hint && (
                        <p className="card-hint">
                          <strong>Hint:</strong> {card.hint}
                        </p>
                      )}
                      {card.code && (
                        <div className="code-section">
                          <pre className="code-block">{card.code}</pre>
                        </div>
                      )}
                      {card.formula && (
                        <div className="formula-section">
                          <strong>Formula:</strong>
                          <div className="formula-display">
                            <LaTeXRenderer formula={card.formula} />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="card-stats">
                      <span>Reviewed: {card.reviewedCount}</span>
                      <span>Mastered: {card.masteredCount}</span>
                      <span className={`card-status ${card.isMastered ? 'mastered' : 'learning'}`}>
                        {card.isMastered ? 'Mastered' : 'Learning'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <p>No cards found matching "{searchQuery}"</p>
                <p>Try searching for different keywords or check your spelling.</p>
              </div>
            )
          ) : (
            <div className="search-placeholder">
              <p>Enter a search term to find cards</p>
              <p>You can search by question, answer, or hint content</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && cardToDelete && (
        <div className="delete-confirm-overlay" onClick={cancelDeleteCard}>
          <div className="delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Card</h3>
            <p>Are you sure you want to delete this card?</p>
            <p className="card-preview">"{cardToDelete.question}"</p>
            <div className="delete-confirm-buttons">
              <button onClick={cancelDeleteCard} className="cancel-btn">
                Cancel
              </button>
              <button onClick={confirmDeleteCard} className="delete-btn">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;

 