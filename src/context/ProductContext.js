import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';

//These collections get sorted alphabetically
const query = graphql`
  {
    allShopifyProduct {
      edges {
        node {
          ...ShopifyProductFields
          ...ProductTileFields
        }
      }
    }
    allShopifyCollection(sort: { fields: title, order: ASC }) {
      edges {
        node {
          products {
            # This is coming in from a fragment
            ...ShopifyProductFields
            ...ProductTileFields
          }
          title
          description
          shopifyId
          image {
            localFile {
              childImageSharp {
                fluid(maxWidth: 300) {
                  ...GatsbyImageSharpFluid_withWebp
                }
              }
            }
          }
        }
      }
    }
  }
`;

const defaultState = {
  products: [],
};

const ProductContext = React.createContext(defaultState);
export default ProductContext;

export function ProductContextProvider({ children }) {
  //Destructuring the data from above
  const { allShopifyCollection, allShopifyProduct } = useStaticQuery(query);
  return (
    <ProductContext.Provider
      value={{
        products: allShopifyProduct.edges.map(({ node }) => node),
        //This will extract just the collection info we need into a new array
        collections: allShopifyCollection.edges.map(({ node }) => node),
      }}
    >
      {children}{' '}
    </ProductContext.Provider>
  );
}
