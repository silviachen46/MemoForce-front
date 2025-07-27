import { useState } from 'react';
import { Trash2, Edit, Eye } from 'lucide-react';
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

interface ManageProps {
  cardSets: CardSet[];
  onDeleteSet: (setId: string) => void;
  onUpdateSet: (setId: string, updates: Partial<CardSet>) => void;
  onDeleteCard: (cardId: string) => void;
}

const Manage = ({ cardSets, onDeleteSet, onUpdateSet, onDeleteCard }: ManageProps) => {
  const [selectedSet, setSelectedSet] = useState<CardSet | null>(null);
  const [editingSet, setEditingSet] = useState<CardSet | null>(null);
  const [editName, setEditName] = useState('');
  const [editReviewMode, setEditReviewMode] = useState<'normal' | 'new-only' | 'top-review' | 'least-mastered'>('normal');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<Card | null>(null);

  const handleEditSet = (set: CardSet) => {
    setEditingSet(set);
    setEditName(set.name);
    setEditReviewMode(set.reviewMode);
  };

  const handleSaveEdit = () => {
    if (editingSet && editName.trim()) {
      onUpdateSet(editingSet.id, { 
        name: editName.trim(),
        reviewMode: editReviewMode
      });
      setEditingSet(null);
      setEditName('');
      setEditReviewMode('normal');
    }
  };

  const handleCancelEdit = () => {
    setEditingSet(null);
    setEditName('');
    setEditReviewMode('normal');
  };

  const handleDeleteSet = (set: CardSet) => {
    if (confirm(`Are you sure you want to delete "${set.name}" and all its cards?`)) {
      onDeleteSet(set.id);
    }
  };

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
    <div className="manage-page">
      <h2>Manage Sets</h2>
      
      <div className="manage-content">
        <div className="sets-list">
          <h3>All Sets</h3>
          {cardSets.length === 0 ? (
            <p>No sets created yet.</p>
          ) : (
            <div className="sets-grid">
              {cardSets.map((set) => (
                <div key={set.id} className="set-card">
                  <div className="set-header">
                    {editingSet?.id === set.id ? (
                      <div className="edit-form">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="edit-input"
                          placeholder="Set name"
                        />
                        <div className="review-mode-section">
                          <label htmlFor="review-mode">Review Mode:</label>
                          <select
                            id="review-mode"
                            value={editReviewMode}
                            onChange={(e) => setEditReviewMode(e.target.value as 'normal' | 'new-only' | 'top-review' | 'least-mastered')}
                            className="review-mode-select"
                          >
                            <option value="normal">Normal</option>
                            <option value="new-only">New Only</option>
                            <option value="top-review">Top Review Needed</option>
                            <option value="least-mastered">Least Mastered</option>
                          </select>
                        </div>
                        <div className="edit-buttons">
                          <button onClick={handleSaveEdit} className="save-btn">Save</button>
                          <button onClick={handleCancelEdit} className="cancel-btn">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <h4>{set.name}</h4>
                    )}
                  </div>
                  
                  <div className="set-info">
                    <p>Cards: {set.cards.length}</p>
                    <p>Created: {set.createdAt.toLocaleDateString()}</p>
                    <p>Mastered: {set.cards.filter(card => card.isMastered).length}</p>
                    <p>Review Mode: {set.reviewMode === 'normal' ? 'Normal' : 
                                     set.reviewMode === 'new-only' ? 'New Only' : 
                                     set.reviewMode === 'top-review' ? 'Top Review Needed' : 
                                     'Least Mastered'}</p>
                  </div>
                  
                  <div className="set-actions">
                    <button 
                      onClick={() => setSelectedSet(set)}
                      className="action-btn view"
                    >
                      <Eye size={16} />
                      View
                    </button>
                    <button 
                      onClick={() => handleEditSet(set)}
                      className="action-btn edit"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteSet(set)}
                      className="action-btn delete"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {selectedSet && (
          <div className="set-details">
            <div className="details-header">
              <h3>{selectedSet.name}</h3>
              <button 
                onClick={() => setSelectedSet(null)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            
            <div className="details-content">
              <div className="set-stats">
                <div className="stat">
                  <span>Total Cards:</span>
                  <span>{selectedSet.cards.length}</span>
                </div>
                <div className="stat">
                  <span>Mastered:</span>
                  <span>{selectedSet.cards.filter(card => card.isMastered).length}</span>
                </div>
                <div className="stat">
                  <span>Learning:</span>
                  <span>{selectedSet.cards.filter(card => !card.isMastered).length}</span>
                </div>
                <div className="stat">
                  <span>Created:</span>
                  <span>{selectedSet.createdAt.toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="cards-list">
                <h4>Cards</h4>
                {selectedSet.cards.length === 0 ? (
                  <p>No cards in this set.</p>
                ) : (
                  <div className="cards-grid">
                    {selectedSet.cards.map((card, index) => (
                      <div key={card.id} className="card-item">
                        <button 
                          onClick={() => handleDeleteCard(card)}
                          className="card-delete-btn"
                          title="Delete card"
                        >
                          ×
                        </button>
                        <div className="card-header">
                          <span className="card-number">#{index + 1}</span>
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
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
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

export default Manage; 