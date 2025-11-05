'use client';

import { gql, useQuery } from '@apollo/client';
import PropertyListingCard from './property-listing-card';
import { useSearchParams } from 'next/navigation';
import Skeleton from '@/components/skelton';
import Pagination from './pagination';

// GraphQL query with filter variables and pagination and pagination
const GET_PROPERTY_LISTINGS = gql`
  query GetPropertyListings(
    $first: Int
    $offset: Int
    $orderBy: [PropertyListingsOrderBy!]
    $filter: PropertyListingFilter
  ) {
    propertyListings(first: $first, offset: $offset, orderBy: $orderBy, filter: $filter) {
      totalCount
      nodes {
        id
        nftItemId
        nftCollectionId
        blockNumber
        signer
        region
        location
        tokenPrice
        tokenAmount
        propertyId
        addressStreet
        addressTownCity
        area
        constructionDate
        estimatedRentalIncome
        files
        localAuthority
        map
        noOfBathrooms
        noOfBedrooms
        numberOfTokens
        offStreetParking
        outdoorSpace
        planningPermissionCode
        postCode
        pricePerToken
        propertyDescription
        propertyDevelopmentCode
        propertyName
        propertyNumber
        propertyPrice
        propertyType
        quality
        titleDeedNumber
      }
    }
  }
`;

export default function Listings() {
  const searchParams = useSearchParams();
  const propertyPrice = searchParams?.get('propertyPrice') ?? '';
  const tokenPrice = searchParams?.get('tokenPrice') ?? '';
  const propertyType = searchParams?.get('propertyType') ?? '';

  // Get current page from URL (default to 1)
  const currentPage = parseInt(searchParams?.get('page') ?? '1', 10);
  const ITEMS_PER_PAGE = 12; // Match the page size from page.tsx

  const isPropertyPrice = propertyPrice ? propertyPrice?.split('-').map(Number) : null;
  const isTokenPrice = tokenPrice ? tokenPrice?.split('-').map(Number) : null;

  const minPropertyPrice = isPropertyPrice ? isPropertyPrice[0] : 0;
  const maxPropertyPrice = isPropertyPrice ? isPropertyPrice[1] : 1000000;
  const minTokenPrice = isTokenPrice ? isTokenPrice[0] : 0;
  const maxTokenPrice = isTokenPrice ? isTokenPrice[1] : 10000;

  const buildFilterObject = () => {
    // Calculate offset for pagination: (page - 1) * items_per_page
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    const variables: any = {
      first: ITEMS_PER_PAGE, // Number of items per page
      offset: offset, // Skip items from previous pages
      orderBy: ['BLOCK_NUMBER_DESC']
    };

    if (
      maxPropertyPrice !== null ||
      minPropertyPrice !== null ||
      maxTokenPrice !== null ||
      minTokenPrice !== null ||
      propertyType !== null
    ) {
      variables.filter = variables.filter || {};
    }

    if (minPropertyPrice !== null || maxPropertyPrice !== null) {
      variables.filter.propertyPrice = {
        greaterThanOrEqualTo: minPropertyPrice,
        lessThanOrEqualTo: maxPropertyPrice
      };
      //   variables.filter.minPropertyPrice = minPropertyPrice;
    }

    // if (maxPropertyPrice !== null) {
    //   variables.filter.PropertyPrice = maxPropertyPrice;
    // }

    if (minTokenPrice !== null || maxTokenPrice !== null) {
      variables.filter.tokenPrice = {
        greaterThanOrEqualTo: minTokenPrice,
        lessThanOrEqualTo: maxTokenPrice
      };
    }

    if (propertyType !== null && propertyType !== '') {
      variables.filter.propertyType = { equalTo: propertyType };
    }

    return variables;
  };

  // Query with filters
  const { loading: isLoading, data } = useQuery(GET_PROPERTY_LISTINGS, {
    variables: buildFilterObject()
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 rounded-lg sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-[442px] w-full md:h-[383px] md:w-[320px] lg:h-[366px] lg:w-[317px]"
          />
        ))}
      </div>
    );
  }

  if (data && data.propertyListings.nodes.length <= 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-6 py-20">
        <p>
          Looks like there&apos;s nothing here yet! Start exploring and adding content to fill
          this space with your own unique properties.
        </p>
      </div>
    );
  }

  // Calculate total pages from GraphQL totalCount
  const totalCount = data?.propertyListings?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <>
      {data && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.propertyListings.nodes.map((property: any) => (
              <PropertyListingCard key={property.id} listing={property} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination currentPage={currentPage} totalPages={totalPages} />
            </div>
          )}
        </>
      )}
    </>
  );
}

// $filter: PropertyListingFilter # $minPropertyPrice: BigFloat
// # $maxPropertyPrice: BigFloat
// ) # $minTokenPrice: BigFloat
// # $maxTokenPrice: BigFloat
// # $propertyType: String
// {
// propertyListings(
//   first: $first
//   orderBy: $orderBy
//   filter: $filter #   filter: {
//   #     propertyType: { equalTo: $propertyType }
// ) #     propertyPrice: {
// #       greaterThanOrEqualTo: $minPropertyPrice
// #       lessThanOrEqualTo: $maxPropertyPrice
// #     }
// #     tokenPrice: { greaterThanOrEqualTo: $minTokenPrice, lessThanOrEqualTo: $maxTokenPrice }
// #   }
// {
