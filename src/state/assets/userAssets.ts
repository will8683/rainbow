import { Hex } from 'viem';

import { ParsedSearchAsset, UniqueId, UserAssetFilter } from '@/__swaps__/types/assets';
import { deriveAddressAndChainWithUniqueId } from '@/__swaps__/utils/address';
import { createRainbowStore } from '@/state/internal/createRainbowStore';

export interface UserAssetsState {
  userAssetIds: UniqueId[];
  userAssets: ParsedSearchAsset[];
  filter: UserAssetFilter;
  searchQuery: string;
  favoriteAssetIds: Hex[]; // this is chain agnostic, so we don't want to store a UniqueId here
  setFavorites: (favoriteAssetIds: Hex[]) => void;

  getFilteredUserAssetIds: () => UniqueId[];
  getUserAsset: (uniqueId: UniqueId) => ParsedSearchAsset | undefined;
  isFavorite: (uniqueId: UniqueId) => boolean;
}

export const userAssetsStore = createRainbowStore<UserAssetsState>(
  (set, get) => ({
    userAssetIds: [],
    userAssets: [],
    filter: 'all',
    searchQuery: '',
    favoriteAssetIds: [],

    setUserAssets: (userAssets: ParsedSearchAsset[]) => {
      // TODO: Verify that setting this doesn't impact performance...
      // we might need to use a Set?
      set({ userAssets });
    },

    getFilteredUserAssetIds: () => {
      const { userAssets, searchQuery } = get();

      // NOTE: No search query let's just return the userAssetIds
      if (!searchQuery.trim()) {
        return userAssets.map(asset => asset.uniqueId);
      }

      // Otherwise, let's match against the name, symbol OR address
      const matchedAssets = userAssets.filter(({ name, symbol, address }) =>
        [name, symbol, address].reduce((res, param) => res || param.toLowerCase().startsWith(searchQuery.toLowerCase()), false)
      );

      // and return the uniqueIds of those assets
      return matchedAssets.map(asset => asset.uniqueId);
    },

    setFavorites: (favoriteAssetIds: Hex[]) => set({ favoriteAssetIds }),

    getUserAsset: (uniqueId: UniqueId) => {
      const { userAssets } = get();

      return userAssets.find(asset => asset.uniqueId === uniqueId);
    },

    isFavorite: (uniqueId: UniqueId) => {
      const { favoriteAssetIds } = get();

      const { address } = deriveAddressAndChainWithUniqueId(uniqueId);

      return favoriteAssetIds.includes(address);
    },
  }),
  {
    storageKey: 'userAssets',
    version: 1,
  }
);
