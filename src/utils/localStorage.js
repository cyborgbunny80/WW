// Save data to localStorage
export const saveToLocalStorage = (key, value) => {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

// Load data from localStorage
export const loadFromLocalStorage = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// Clear all When? Win! data from localStorage
export const clearAllLocalStorage = () => {
  try {
    localStorage.removeItem('whenwin_user');
    localStorage.removeItem('whenwin_location');
    localStorage.removeItem('whenwin_favorites');
    localStorage.removeItem('whenwin_events');
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

// Convert Set to Array for storage (localStorage can't store Sets)
export const setToArray = (set) => Array.from(set);

// Convert Array back to Set
export const arrayToSet = (array) => new Set(array);