/**
 * External dependencies.
 */
import { useContext } from 'react';

/**
 * Internal dependencies.
 */
import { AppContext } from '@/store/contexts/AppContext';

export const useStore = () => {
  return useContext(AppContext);
};