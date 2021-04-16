export const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $after: String) {
    products(first: $first, after: $after, query: "productType:Lenses") {
      pageInfo {
        hasNextPage
      }
      edges {
        cursor
        node {
          availableForSale
          createdAt
          description
          descriptionHtml
          handle
          id
          images(first: 250) {
            edges {
              node {
                id
                altText
                originalSrc
              }
            }
          }
          media(first: 10) {
            edges {
              node {
                alt
                mediaContentType
                previewImage {
                  altText
                  id
                  originalSrc
                }
                ... on ExternalVideo {
                  id
                  mediaContentType
                  embeddedUrl
                  alt
                  previewImage {
                    altText
                    id
                    originalSrc
                  }
                }
                ... on Video {
                  id
                  alt
                  mediaContentType
                  previewImage {
                    altText
                    id
                    originalSrc
                  }
                }
              }
              cursor
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
            }
          }
          metafields(first: 250) {
            edges {
              node {
                description
                id
                key
                namespace
                value
                valueType
              }
            }
          }
          onlineStoreUrl
          options {
            id
            name
            values
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          productType
          publishedAt
          tags
          title
          updatedAt
          variants(first: 250) {
            edges {
              node {
                availableForSale
                compareAtPrice
                compareAtPriceV2 {
                  amount
                  currencyCode
                }
                id
                image {
                  altText
                  id
                  originalSrc
                }
                metafields(first: 250) {
                  edges {
                    node {
                      description
                      id
                      key
                      namespace
                      value
                      valueType
                    }
                  }
                }
                price
                priceV2 {
                  amount
                  currencyCode
                }
                requiresShipping
                selectedOptions {
                  name
                  value
                }
                sku
                title
                weight
                weightUnit
                presentmentPrices(first: 250) {
                  edges {
                    node {
                      price {
                        amount
                        currencyCode
                      }
                      compareAtPrice {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
            }
          }
          vendor
        }
      }
    }
  }
`;
