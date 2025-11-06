/**
 * Marketplace Configuration Constants
 */

/**
 * Number of property listings to display per page
 * Used by both blockchain and GraphQL pagination implementations
 */
export const ITEMS_PER_PAGE = 12;

/**
 * Default page number when none is specified
 */
export const DEFAULT_PAGE = 1;

/**
 * Filter Price Range Defaults
 * These define the default min/max boundaries for property and token price filters
 */
export const DEFAULT_MIN_PROPERTY_PRICE = 0;
export const DEFAULT_MAX_PROPERTY_PRICE = 1_000_000;
export const DEFAULT_MIN_TOKEN_PRICE = 0;
export const DEFAULT_MAX_TOKEN_PRICE = 10_000;

/**
 * Sentinel value for "all" filter option (no filter applied)
 * Used across property type, country, and city filters
 */
export const FILTER_ALL_VALUE = 'all';

/**
 * Default sort order for listings
 */
export const DEFAULT_SORT_ORDER = 'BLOCK_NUMBER_DESC' as const;

/**
 * Number of skeleton loaders to show while loading
 */
export const LOADING_SKELETON_COUNT = 8;
