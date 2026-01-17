'use client';

import { useEffect, useEffectEvent } from 'react';

import { create } from 'zustand';

export type HeaderState = {
  primaryText: string;
  primarySubText: string;
  secondaryText: string;
  backNavigation: string;
  setText: (text: {
    primaryText: string;
    primarySubText: string;
    secondaryText: string;
    backNavigation: string;
  }) => void;
};

export const useHeaderTextStore = create<HeaderState>((set) => ({
  primaryText: '',
  primarySubText: '',
  secondaryText: '',
  backNavigation: '',
  setText: (text): void => {
    set(text);
  },
}));

export const SetHeader = (val: Partial<HeaderState>) => {
  const { setText, ...headerState } = useHeaderTextStore();

  const setHeaderState = useEffectEvent((val: Partial<HeaderState>) => {
    setText({ ...headerState, ...val });
  });

  useEffect(() => {
    setHeaderState(val);
  }, [val]);
  return null;
};
