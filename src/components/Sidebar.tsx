import { useState } from 'react';
import { ChevronRight, Plus, Folder } from 'lucide-react';
import type { CardSet } from '../App';

interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
  cardSets: CardSet[];
  onCreateSet: (name: string) => void;
  onSelectSet: (set: CardSet) => void;
}

const Sidebar = ({ isExpanded, onToggle, cardSets, onCreateSet, onSelectSet }: SidebarProps) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSetName, setNewSetName] = useState('');

  const handleCreateSet = () => {
    if (newSetName.trim()) {
      onCreateSet(newSetName.trim());
      setNewSetName('');
      setShowCreateModal(false);
    }
  };

  const handleCancel = () => {
    setNewSetName('');
    setShowCreateModal(false);
  };

  return (
    <div className={`sidebar ${isExpanded ? 'expanded' : ''}`}>
      <button className="sidebar-toggle" onClick={onToggle}>
        <ChevronRight className={`chevron ${isExpanded ? 'rotated' : ''}`} />
      </button>
      
      {isExpanded && (
        <div className="sidebar-content">
          <div className="sidebar-header">
            <h3>Sets</h3>
            <button 
              className="create-set-btn"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={16} />
            </button>
          </div>
          
          <div className="sets-list">
            {cardSets.map((set) => (
              <div 
                key={set.id} 
                className="set-item"
                data-id={set.id}  // 添加data-id属性
                onClick={() => onSelectSet(set)}
              >
                {set.id === 'favorites' ? (
                  <span className="favorites-icon">⭐</span>
                ) : (
                  <Folder size={16} />
                )}
                <span>{set.name}</span>
                <span className="card-count">({set.cards.length})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Set Name</h3>
            <input
              type="text"
              value={newSetName}
              onChange={(e) => setNewSetName(e.target.value)}
              placeholder="Enter set name..."
              autoFocus
            />
            <div className="modal-buttons">
              <button onClick={handleCancel}>Cancel</button>
              <button onClick={handleCreateSet}>✓</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar; 