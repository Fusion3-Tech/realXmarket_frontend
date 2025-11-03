'use client';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useWalletContext } from '@/context/wallet-context';
import { useRouter, useSearchParams } from 'next/navigation';
import { readFavs } from '../utils';

export default function FavoritesToggle() {
  const router = useRouter();
  const sp = useSearchParams();

  const { selectedAccount } = useWalletContext();
  const address = selectedAccount?.[0]?.address as string | undefined;

  const [showFavs, setShowFavs] = useState(false);
  const [favs, setFavs] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const _favs = await readFavs(address);
      setFavs(_favs);
    })();
    const params = new URLSearchParams(sp);
    setShowFavs(params.get('mode') === 'favs');
  }, [address]);

  const toggleShow = () => {
    const params = new URLSearchParams(sp);
    setShowFavs(prev => !prev);
    if (params.has('mode')) {
      params.delete('mode'); // back to "all"
    } else {
      params.set('mode', 'favs');
    }
    const qs = params.toString();
    router.replace(qs ? `?${qs}` : '?', { scroll: false });
    router.refresh();
  };

  const label = useMemo(() => (showFavs ? 'Show All' : 'Show Favorites'), [showFavs]);

  return (
    <div className="flex items-center gap-2">
      <Button variant={showFavs ? 'default' : 'outline'} onClick={toggleShow}>
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
