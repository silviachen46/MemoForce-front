import { useState } from 'react';
import { Edit, Trash2, X } from 'lucide-react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import type { Card } from '../App';

interface CardDisplayProps {
  card: Card;
  showDetailed: boolean;
  onMastered: () => void;
  onReview: () => void;
  onUpdateCard: (cardId: string, updates: Partial<Card>) => void;
  onDeleteCard: (cardId: string) => void;
}

const CardDisplay = ({ 
  card, 
  showDetailed, 
  onMastered, 
  onReview, 
  onUpdateCard, 
  onDeleteCard 
}: CardDisplayProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editData, setEditData] = useState({
    question: card.question,
    answer: card.answer,
    hint: card.hint || '',
    code: card.code || '',
    formula: card.formula || ''
  });

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdateCard(card.id, {
      question: editData.question,
      answer: editData.answer,
      hint: editData.hint || undefined,
      code: editData.code || undefined,
      formula: editData.formula || undefined
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      question: card.question,
      answer: card.answer,
      hint: card.hint || '',
      code: card.code || '',
      formula: card.formula || ''
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this card?')) {
      onDeleteCard(card.id);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDeleteCard(card.id);
    setShowDeleteConfirm(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const toggleHint = () => {
    setShowHint(!showHint);
  };

  if (showDetailed) {
    return (
      <div className={`card-display detailed ${isEditing ? 'editing' : ''}`}>
        <div className="card-header">
          <h3>Card Details</h3>
          <div className="card-actions">
            <button onClick={handleEdit} className="action-btn">
              <Edit size={16} />
            </button>
            <button onClick={handleDelete} className="action-btn delete">
              ×
            </button>
          </div>
        </div>

        {isEditing ? (
          <div className="edit-form">
            <div className="form-group">
              <label>Question:</label>
              <textarea
                value={editData.question}
                onChange={(e) => setEditData(prev => ({ ...prev, question: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label>Answer:</label>
              <textarea
                value={editData.answer}
                onChange={(e) => setEditData(prev => ({ ...prev, answer: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label>Hint:</label>
              <input
                type="text"
                value={editData.hint}
                onChange={(e) => setEditData(prev => ({ ...prev, hint: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label>Code:</label>
              <textarea
                value={editData.code}
                onChange={(e) => setEditData(prev => ({ ...prev, code: e.target.value }))}
                placeholder="Enter code block..."
                rows={4}
              />
            </div>
            <div className="form-group">
              <label>Formula:</label>
              <textarea
                value={editData.formula}
                onChange={(e) => setEditData(prev => ({ ...prev, formula: e.target.value }))}
                placeholder="Enter LaTeX formula..."
                rows={2}
              />
            </div>
            <div className="edit-buttons">
              <button onClick={handleSave} className="save-btn">Save</button>
              <button onClick={handleCancel} className="cancel-btn">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="card-content">
            <div className="question-section">
              <h4>Question:</h4>
              <p>{card.question}</p>
            </div>
            <div className="answer-section">
              <h4>Answer:</h4>
              <p>{card.answer}</p>
            </div>
            {card.hint && (
              <div className="hint-section">
                <h4>Hint:</h4>
                <p className="hint-text">{card.hint}</p>
              </div>
            )}
            {card.code && (
              <div className="code-section">
                <pre className="code-block">{card.code}</pre>
              </div>
            )}
            {card.formula && (
              <div className="formula-section">
                <h4>Formula:</h4>
                <div className="formula-display">
                  <LaTeXRenderer formula={card.formula} displayMode={true} />
                </div>
              </div>
            )}
            <div className="stats-section">
              <div className="stat">
                <span>Reviewed:</span>
                <span>{card.reviewedCount}</span>
              </div>
              <div className="stat">
                <span>Mastered:</span>
                <span>{card.masteredCount}</span>
              </div>
              <div className="stat">
                <span>Status:</span>
                <span className={card.isMastered ? 'mastered' : 'learning'}>
                  {card.isMastered ? 'Mastered' : 'Learning'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`card-display ${isFlipped ? 'flipped' : ''}`}>
      <div className="card-inner" onClick={handleFlip}>
        <div className="card-front">
          <button 
            onClick={handleDeleteClick}
            className="card-delete-btn"
            title="Delete card"
          >
            ×
          </button>
          <div className="card-content">
            <h3>Question</h3>
            <p>{card.question}</p>
            {card.hint && (
              <div className="hint-section">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleHint();
                  }} 
                  className="hint-toggle-btn"
                >
                  {showHint ? 'Hide Hint' : 'Check Hint'}
                </button>
                {showHint && (
                  <div className="hint">
                    <strong>Hint:</strong> {card.hint}
                  </div>
                )}
              </div>
            )}
            <div className="click-hint">Click to flip</div>
          </div>
        </div>
        <div className="card-back">
          <button 
            onClick={handleDeleteClick}
            className="card-delete-btn"
            title="Delete card"
          >
            ×
          </button>
          <div className="card-content">
            <h3>Answer</h3>
            <p>{card.answer}</p>
            {card.code && (
              <div className="code-section">
                <pre className="code-block">{card.code}</pre>
              </div>
            )}
            {card.formula && (
              <div className="formula-section">
                <h4>Formula:</h4>
                <div className="formula-display">
                  <LaTeXRenderer formula={card.formula} displayMode={true} />
                </div>
              </div>
            )}
            <div className="click-hint">Click to flip back</div>
          </div>
        </div>
      </div>
      
      <div className="card-actions">
        <button onClick={onMastered} className="action-btn mastered">
          Mastered
        </button>
        <button onClick={onReview} className="action-btn review">
          Review
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="delete-confirm-overlay" onClick={cancelDelete}>
          <div className="delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Card</h3>
            <p>Are you sure you want to delete this card?</p>
            <p className="card-preview">"{card.question}"</p>
            <div className="delete-confirm-buttons">
              <button onClick={cancelDelete} className="cancel-btn">
                Cancel
              </button>
              <button onClick={confirmDelete} className="delete-btn">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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

export default CardDisplay; 