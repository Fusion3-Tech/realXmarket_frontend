'use client';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useFavourites } from '@/hooks/use-favourites';

export default function FavoritesToggle() {
  const { favs } = useFavourites();

  const [showFavs, setShowFavs] = useState(false);

  const label = useMemo(() => (showFavs ? 'Showing Favorites' : 'Show Favorites'), [showFavs]);

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={showFavs ? 'default' : 'outline'}
        onClick={() => setShowFavs((v) => !v)}
      >
        {label}
      </Button>
      {showFavs && (
        <span className="text-sm text-muted-foreground">
          {favs.length ? `${favs.length} saved` : 'No favorites yet'}
        </span>
      )}
    </div>
  );
}
