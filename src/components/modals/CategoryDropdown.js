import React from 'react';
import { categories } from '../../constants/categories';

const CategoryDropdown = ({
  showCategoryDropdown,
  setShowCategoryDropdown,
  selectedCategory,
  setSelectedCategory
}) => {
  if (!showCategoryDropdown) return null;

  return (
    <div className="modal-overlay" onClick={() => setShowCategoryDropdown(false)}>
      <div className="dropdown-container" onClick={(e) => e.stopPropagation()}>
        {categories.map(category => (
          <button
            key={category.id}
            className={`dropdown-item ${
              selectedCategory === category.id ? 'dropdown-item-active' : ''
            }`}
            onClick={() => {
              setSelectedCategory(category.id);
              setShowCategoryDropdown(false);
            }}
          >
            <span className="dropdown-emoji">{category.emoji}</span>
            <span
              className={`dropdown-text ${
                selectedCategory === category.id ? 'dropdown-text-active' : ''
              }`}
            >
              {category.name}
            </span>
            {selectedCategory === category.id && (
              <span className="checkmark">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryDropdown;