const RatingStars = ({ rating, count, size = 'small', onRate }) => {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.3 && rating - fullStars < 0.8;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    // Filled stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span
          key={`filled-${i}`}
          className="material-symbols-outlined filled text-[#F59E0B]"
          style={{ fontSize: size === 'small' ? '16px' : '20px', fontVariationSettings: "'FILL' 1" }}
          onClick={onRate ? () => onRate(i + 1) : undefined}
        >
          star
        </span>
      );
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <span
          key="half"
          className="material-symbols-outlined text-[#F59E0B]"
          style={{ fontSize: size === 'small' ? '16px' : '20px', fontVariationSettings: "'FILL' 1" }}
          onClick={onRate ? () => onRate(fullStars + 1) : undefined}
        >
          star_half
        </span>
      );
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span
          key={`empty-${i}`}
          className="material-symbols-outlined text-[#F59E0B]"
          style={{ fontSize: size === 'small' ? '16px' : '20px' }}
          onClick={onRate ? () => onRate(fullStars + (hasHalfStar ? 1 : 0) + i + 1) : undefined}
        >
          star
        </span>
      );
    }

    return stars;
  };

  return (
    <div className="flex items-center gap-1">
      <div className={`flex ${onRate ? 'cursor-pointer' : ''}`}>
        {renderStars()}
      </div>
      {count !== undefined && (
        <span className="font-label-sm text-label-sm text-on-surface-variant dark:text-gray-400 ml-1">
          ({count})
        </span>
      )}
    </div>
  );
};

export default RatingStars;