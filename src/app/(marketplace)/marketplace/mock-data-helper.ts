/**
 * TEMPORARY HELPER FOR PAGINATION TESTING
 *
 * This file helps you test pagination by duplicating existing listings.
 * DELETE THIS FILE before going to production!
 */

export function addMockListingsForTesting(listingData: any[], count: number = 10) {
  if (listingData.length === 0) return listingData;

  // Take only the FIRST listing from the original data
  // to avoid exponential growth on refresh
  const originalListing = listingData[0];

  const mockListings = [];

  // Create 'count' duplicates of the first listing only
  for (let i = 0; i < count; i++) {
    mockListings.push({
      ...originalListing,
      listing: {
        ...originalListing.listing,
        listingId: `${originalListing.listing.listingId}-mock-${i}`
      },
      // Optionally vary some data to make it look different
      metadata: originalListing.metadata
    });
  }

  // Return ONLY original data + mocks (not exponential)
  return [...listingData, ...mockListings];
}

/**
 * Usage in page.tsx:
 *
 * import { addMockListingsForTesting } from './mock-data-helper';
 *
 * let listingData = await fetchListingMetadata(rawListings);
 *
 * // FOR TESTING ONLY - Remove before production!
 * listingData = addMockListingsForTesting(listingData, 10);
 */
