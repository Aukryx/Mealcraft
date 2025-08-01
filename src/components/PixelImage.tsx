import React, { useState } from 'react';

type Props = {
  src?: string;
  alt: string;
  fallbackIcon: string; // Emoji ou icône de fallback
  style?: React.CSSProperties;
  size?: 'small' | 'medium' | 'large';
};

const sizeMap = {
  small: { width: '60px', height: '60px' },
  medium: { width: '120px', height: '120px' },
  large: { width: '200px', height: '200px' }
};

export default function PixelImage({ src, alt, fallbackIcon, style, size = 'medium' }: Props) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const containerStyle = {
    ...sizeMap[size],
    ...style,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px',
    border: '3px solid #8b4513',
    background: 'linear-gradient(135deg, #FFF6B7, #FFD6A5)',
    position: 'relative' as const,
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(139, 69, 19, 0.3)',
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    imageRendering: 'pixelated' as const, // Style pixel-art
    filter: imageLoaded ? 'none' : 'blur(2px)',
    transition: 'filter 0.3s ease',
  };

  const fallbackStyle = {
    fontSize: size === 'small' ? '1.5rem' : size === 'medium' ? '3rem' : '4rem',
    color: '#8b4513',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  };

  return (
    <div style={containerStyle}>
      {src && !imageError ? (
        <>
          <img
            src={src}
            alt={alt}
            style={imageStyle}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
          {!imageLoaded && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #FFF6B7, #FFD6A5)',
            }}>
              <div style={fallbackStyle}>{fallbackIcon}</div>
            </div>
          )}
        </>
      ) : (
        <div style={fallbackStyle}>{fallbackIcon}</div>
      )}
      
      {/* Effet de bordure pixélisée */}
      <div style={{
        position: 'absolute',
        top: '-1px',
        left: '-1px',
        right: '-1px',
        bottom: '-1px',
        border: '1px solid rgba(255,255,255,0.5)',
        borderRadius: '12px',
        pointerEvents: 'none',
      }} />
    </div>
  );
}

// Composant spécialisé pour les recettes
export function RecipeImage({ recette }: { recette: { nom: string; image?: string; categorie?: string } }) {
  // Emojis par catégorie
  const categoryEmojis: Record<string, string> = {
    'Petit-déjeuner': '🥐',
    'Déjeuner': '🍽️',
    'Dîner': '🍛',
    'Dessert': '🧁',
    'Entrée': '🥗',
    'Boisson': '🥤',
    'Goûter': '🍪',
    'Autre': '🍳'
  };

  const fallbackIcon = categoryEmojis[recette.categorie || 'Autre'] || '🍳';

  return (
    <PixelImage
      src={recette.image}
      alt={recette.nom}
      fallbackIcon={fallbackIcon}
      size="medium"
    />
  );
}
