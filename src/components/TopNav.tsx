import { useNavigate } from 'react-router-dom';

interface TopNavProps {
  currentPage: 'home' | 'analytics' | 'manage' | 'search';
  onPageChange: (page: 'home' | 'analytics' | 'manage' | 'search') => void;
}

const TopNav = ({ currentPage, onPageChange }: TopNavProps) => {
  const navigate = useNavigate();

  const handlePageChange = (page: 'home' | 'analytics' | 'manage' | 'search') => {
    onPageChange(page);
    navigate(page === 'home' ? '/' : `/${page}`);
  };

  return (
    <nav className="top-nav">
      <div className="nav-container">
        <h1 className="app-title">MemoForce</h1>
        <div className="nav-buttons">
          <button
            className={`nav-button ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => handlePageChange('home')}
          >
            Home
          </button>
          <button
            className={`nav-button ${currentPage === 'search' ? 'active' : ''}`}
            onClick={() => handlePageChange('search')}
          >
            Search
          </button>
          <button
            className={`nav-button ${currentPage === 'analytics' ? 'active' : ''}`}
            onClick={() => handlePageChange('analytics')}
          >
            Analytics
          </button>
          <button
            className={`nav-button ${currentPage === 'manage' ? 'active' : ''}`}
            onClick={() => handlePageChange('manage')}
          >
            Manage
          </button>
        </div>
      </div>
    </nav>
  );
};

export default TopNav; 