import { useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { RootState } from '../../app/store';

/** Typed selector hook — use everywhere instead of plain useSelector. */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
