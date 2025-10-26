import { useState, useEffect } from 'react';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Failed to parse favorites from localStorage', error);
      }
    }
  }, []);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (productId: string) => {
    setFavorites(prev => {
      if (prev.includes(productId)) {
        return prev;
      }
      return [...prev, productId];
    });
  };

  const removeFromFavorites = (productId: string) => {
    setFavorites(prev => prev.filter(id => id !== productId));
  };

  const toggleFavorite = (productId: string) => {
    if (favorites.includes(productId)) {
      removeFromFavorites(productId);
    } else {
      addToFavorites(productId);
    }
  };

  const isFavorite = (productId: string): boolean => {
    return favorites.includes(productId);
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
  };
};
