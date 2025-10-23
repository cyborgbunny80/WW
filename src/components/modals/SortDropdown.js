import React from 'react';

const sortOptions = [
  { id: 'date', label: 'Date', icon: '📅' },
  { id: 'popularity', label: 'Popularity', icon: '🔥' },
  { id: 'price', label: 'Price', icon: '💰' }
];

const SortDropdown = ({
  showSortDropdown,
  setShowSortDropdown,
  sortBy,
  setSortBy
}) => {
  if (!showSortDropdown) return null;

  return (
    <div className="modal-overlay" onClick={() => setShowSortDropdown(false)}>
      <div className="dropdown-container" onClick={(e) => e.stopPropagation()}>
        {sortOptions.map(option => (
          <button
            key={option.id}
            className={`dropdown-item ${
              sortBy === option.id ? 'dropdown-item-active' : ''
            }`}
            onClick={() => {
              setSortBy(option.id);
              setShowSortDropdown(false);
            }}
          >
            <span className="dropdown-emoji">{option.icon}</span>
            <span
              className={`dropdown-text ${
                sortBy === option.id ? 'dropdown-text-active' : ''
              }`}
            >
              {option.label}
            </span>
            {sortBy === option.id && (
              <span className="checkmark">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SortDropdown;
