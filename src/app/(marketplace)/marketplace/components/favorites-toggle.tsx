'use client';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useWalletContext } from '@/context/wallet-context';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function favKey(addr?: string) {
  return `market_favorites:${addr || 'guest'}`;
}

export function readFavs(addr?: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(favKey(addr));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeFavs(next: string[], addr?: string) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(favKey(addr), JSON.stringify([...new Set(next)]));
  } catch {}
}

export default function FavoritesToggle() {
  const { selectedAccount } = useWalletContext();
  const address = selectedAccount?.[0]?.address as string | undefined;

  const [showFavs, setShowFavs] = useState(false);
  const [favs, setFavs] = useState<string[]>([]);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const sync = () => setFavs(readFavs(address));
    sync();
    const onStorage = (e: StorageEvent) => {
      if (e.key === favKey(address)) sync();
    };
    window.addEventListener('storage', onStorage);
    const onLocal = (e: Event) => {
      const detail = (e as CustomEvent).detail as { address?: string } | undefined;
      if ((detail?.address || 'guest') === (address || 'guest')) sync();
    };
    window.addEventListener('favorites:update', onLocal as EventListener);
    let bc: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== 'undefined') {
      bc = new BroadcastChannel('favorites');
      bc.onmessage = (msg) => {
        if ((msg?.data?.address || 'guest') === (address || 'guest')) sync();
      };
    }
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('favorites:update', onLocal as EventListener);
      if (bc) bc.close();
    };
  }, [address]);

  useEffect(() => {
    const isOn = searchParams.get('favorites') === '1';
    setShowFavs(isOn);
  }, [searchParams]);

  const label = useMemo(() => (showFavs ? 'Showing Favorites' : 'Show Favorites'), [showFavs]);

  function toggleUrlParam(nextOn: boolean) {
    const params = new URLSearchParams(searchParams.toString());
    if (nextOn) {
      params.set('favorites', '1');
    } else {
      params.delete('favorites');
    }
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={showFavs ? 'default' : 'outline'}
        onClick={() => {
          const next = !showFavs;
          setShowFavs(next);
          toggleUrlParam(next);
        }}
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
