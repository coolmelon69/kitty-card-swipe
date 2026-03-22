import { useState, useCallback } from "react";
import type { CatCard } from "./cardTypes";

const STORAGE_KEY = "kitty-card-collection";

export function useCardCollection() {
  const [cards, setCards] = useState<CatCard[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CatCard[]) : [];
    } catch {
      return [];
    }
  });

  const addCard = useCallback((card: CatCard) => {
    setCards((prev) => {
      const next = [...prev, card];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  return { cards, addCard };
}
