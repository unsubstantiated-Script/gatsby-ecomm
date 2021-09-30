import React from 'react';
import { graphql } from 'gatsby';

//This is a page query for one specific product
export const query = graphql`
  # product id comes in as an argument and below is the query based on id.
  query ProductQuery($shopifyId: String) {
    shopifyProduct(shopifyId: { eq: $shopifyId }) {
      title
    }
  }
`;

//data from above query is injected below into props.data
const ProductTemplate = props => {
  console.log(props);
  return <h1>{props.data.shopifyProduct.title}</h1>;
};

export default ProductTemplate;
