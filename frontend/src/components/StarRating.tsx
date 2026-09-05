import React from 'react';

interface StarRatingProps {
  rating: number;
  max?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  max = 5,
  interactive = false,
  onRatingChange,
  size = 'md',
}) => {
  const fontSize = size === 'sm' ? '0.9rem' : size === 'lg' ? '2rem' : '1.25rem';

  return (
    <div style={{ display: 'inline-flex', gap: '4px', alignItems: 'center' }}>
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= Math.round(rating);

        if (interactive) {
          return (
            <button
              key={i}
              type="button"
              className={`star-btn ${isFilled ? 'active' : ''}`}
              style={{ fontSize, padding: 0 }}
              onClick={() => onRatingChange?.(starValue)}
            >
              ★
            </button>
          );
        }

        return (
          <span
            key={i}
            style={{
              color: isFilled ? 'var(--star-gold)' : '#384663',
              fontSize,
              lineHeight: 1,
            }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};
