import type { CardSet } from '../App';

interface AnalyticsProps {
  cardSets: CardSet[];
}

const Analytics = ({ cardSets }: AnalyticsProps) => {
  const totalCards = cardSets.reduce((sum, set) => sum + set.cards.length, 0);
  const totalMastered = cardSets.reduce((sum, set) => 
    sum + set.cards.filter(card => card.isMastered).length, 0
  );
  const totalReviewed = cardSets.reduce((sum, set) => 
    sum + set.cards.reduce((cardSum, card) => cardSum + card.reviewedCount, 0), 0
  );
  const totalMasteredCount = cardSets.reduce((sum, set) => 
    sum + set.cards.reduce((cardSum, card) => cardSum + card.masteredCount, 0), 0
  );

  const masteryRate = totalCards > 0 ? (totalMastered / totalCards * 100).toFixed(1) : '0';

  return (
    <div className="analytics-page">
      <h2>Learning Analytics</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Sets</h3>
          <div className="stat-value">{cardSets.length}</div>
        </div>
        
        <div className="stat-card">
          <h3>Total Cards</h3>
          <div className="stat-value">{totalCards}</div>
        </div>
        
        <div className="stat-card">
          <h3>Mastery Rate</h3>
          <div className="stat-value">{masteryRate}%</div>
        </div>
        
        <div className="stat-card">
          <h3>Total Reviews</h3>
          <div className="stat-value">{totalReviewed}</div>
        </div>
        
        <div className="stat-card">
          <h3>Total Mastered</h3>
          <div className="stat-value">{totalMasteredCount}</div>
        </div>
      </div>

      <div className="sets-breakdown">
        <h3>Sets Breakdown</h3>
        {cardSets.length === 0 ? (
          <p>No sets created yet.</p>
        ) : (
          <div className="sets-list">
            {cardSets.map((set) => {
              const setMastered = set.cards.filter(card => card.isMastered).length;
              const setReviewed = set.cards.reduce((sum, card) => sum + card.reviewedCount, 0);
              const setMasteryRate = set.cards.length > 0 ? (setMastered / set.cards.length * 100).toFixed(1) : '0';
              
              return (
                <div key={set.id} className="set-stat">
                  <div className="set-header">
                    <h4>{set.name}</h4>
                    <span className="set-date">
                      Created: {set.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="set-stats">
                    <div className="set-stat-item">
                      <span>Cards:</span>
                      <span>{set.cards.length}</span>
                    </div>
                    <div className="set-stat-item">
                      <span>Mastered:</span>
                      <span>{setMastered}</span>
                    </div>
                    <div className="set-stat-item">
                      <span>Reviews:</span>
                      <span>{setReviewed}</span>
                    </div>
                    <div className="set-stat-item">
                      <span>Mastery Rate:</span>
                      <span>{setMasteryRate}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics; 