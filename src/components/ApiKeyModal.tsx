import { useState } from 'react';

interface ApiKeyModalProps {
  onSave: (apiKey: string) => void;
  onCancel: () => void;
}

const ApiKeyModal = ({ onSave, onCancel }: ApiKeyModalProps) => {
  const [apiKey, setApiKey] = useState('');

  const handleSave = () => {
    if (apiKey.trim()) {
      onSave(apiKey.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal api-key-modal">
        <h3>Enter OpenAI API Key</h3>
        <p className="modal-description">
          Please enter your OpenAI API key to generate flashcards. 
          Your API key will be stored locally and used for future requests.
        </p>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="sk-..."
          className="api-key-input"
          autoFocus
        />
        <div className="modal-buttons">
          <button onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={!apiKey.trim()}
            className="save-btn"
          >
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal; 