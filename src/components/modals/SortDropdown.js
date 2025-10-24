import React from 'react';
import { categories } from '../../constants/categories';

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
        {categories.map(category => (
          <button
            key={category.id}
            className={`dropdown-item ${
              sortBy === category.id ? 'dropdown-item-active' : ''
            }`}
            onClick={() => {
              setSortBy(category.id);
              setShowSortDropdown(false);
            }}
          >
            <span className="dropdown-emoji">{category.emoji}</span>
            <span
              className={`dropdown-text ${
                sortBy === category.id ? 'dropdown-text-active' : ''
              }`}
            >
              {category.name}
            </span>
            {sortBy === category.id && (
              <span className="checkmark">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SortDropdown;
