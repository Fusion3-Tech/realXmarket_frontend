import { useWalletContext } from '@/context/wallet-context';
import { useEffect, useState } from 'react';

function favKey(addr?: string) {
  return `market_favorites:${addr || 'guest'}`;
}

function readFavs(addr?: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(favKey(addr));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeFavs(next: string[], addr?: string) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(favKey(addr), JSON.stringify([...new Set(next)]));
  } catch {}
}

export function useFavourites() {
  const { selectedAccount } = useWalletContext();
  const address = selectedAccount?.[0]?.address as string | undefined;
  const [favs, setFavs] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setFavs(readFavs(address));
    sync();
  }, [address]);

  const toggleFav = (listingId: string) => {
    const exists = favs.includes(listingId);
    const next = exists ? favs.filter(id => id !== listingId) : [listingId, ...favs];
    writeFavs(next, address);
    setFavs(next);
    return next;
  }

  return { favs, toggleFav };
}
