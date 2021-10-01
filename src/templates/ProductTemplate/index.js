import React, { useContext, useEffect } from 'react';
import { graphql } from 'gatsby';
import { Layout, ImageGallery } from 'components';
import { Grid } from './styles';
import CartContext from '../../context/CartContext';

//This is a page query for one specific product
export const query = graphql`
  # product id comes in as an argument and below is the query based on id.
  query ProductQuery($shopifyId: String) {
    shopifyProduct(shopifyId: { eq: $shopifyId }) {
      # this is what we need to pass to shopify to find this product
      shopifyId
      title
      description
      images {
        id
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
`;

//data from above query is injected below into props.data
const ProductTemplate = props => {
  const { getProductById } = useContext(CartContext);

  useEffect(() => {
    // Loading up the id from the API query
    getProductById(props.data.shopifyProduct.shopifyId).then(result => {
      console.log(result);
    });
  }, [getProductById, props.data.shopifyProduct.shopifyId]);

  return (
    <Layout>
      <Grid>
        <div>
          <h1>{props.data.shopifyProduct.title}</h1>
          <p>{props.data.shopifyProduct.description}</p>
        </div>
        <div>
          <ImageGallery images={props.data.shopifyProduct.images} />
        </div>
      </Grid>
    </Layout>
  );
};

export default ProductTemplate;
