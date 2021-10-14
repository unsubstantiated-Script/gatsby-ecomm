/* eslint-disable jsx-a11y/no-onchange */
import React, { useContext, useEffect, useState } from 'react';
import { graphql } from 'gatsby';
import {
  Layout,
  ImageGallery,
  ProductQuantityAdder,
  Button,
  SEO,
} from '../../components';
import { Grid, SelectWrapper, Price } from './styles';
import CartContext from '../../context/CartContext';

//Stuff used to grab items from the URL
//navigates to a url and retuns stuff from our current url
import { navigate, useLocation } from '@reach/router';
//reads the query string to get the id we need to load an item
import queryString from 'query-string';

//This is a page query for one specific product
export const query = graphql`
  # product id comes in as an argument and below is the query based on id.
  query ProductQuery($shopifyId: String) {
    shopifyProduct(shopifyId: { eq: $shopifyId }) {
      # this is what we need to pass to shopify to find this product
      # shopifyId
      # title
      # description
      # images {
      #   id
      #   localFile {
      #     childImageSharp {
      #       fluid(maxWidth: 300) {
      #         ...GatsbyImageSharpFluid_withWebp
      #       }
      #     }
      #   }
      # }

      # Replaced with GraphQL fragment provided by Gatsby
      ...ShopifyProductFields
    }
  }
`;

//data from above query is injected below into props.data
const ProductTemplate = props => {
  const { getProductById } = useContext(CartContext);

  const [product, setProduct] = useState(null);

  const [selectedVariant, setSelectedVariant] = useState(null);

  const { search, origin, pathname } = useLocation();

  //Getting the id back from the url
  const variantId = queryString.parse(search).variant;

  useEffect(() => {
    // Loading up the id from the API query
    getProductById(props.data.shopifyProduct.shopifyId).then(result => {
      setProduct(result);
      setSelectedVariant(
        result.variants.find(({ id }) => id === variantId) || result.variants[0]
      );
    });
  }, [
    getProductById,
    setProduct,
    props.data.shopifyProduct.shopifyId,
    variantId,
  ]);

  const handleVariantChange = e => {
    const newVariant = product?.variants.find(v => v.id === e.target.value);
    setSelectedVariant(newVariant);
    //allows us to navigate to this location using the plugin above
    navigate(
      //loads up the path we're trying to get to
      `${origin}${pathname}?variant=${encodeURIComponent(newVariant.id)}`,
      //swaps out the current url with the one we're trying to get allows user to backtrack in the browser
      { replace: true }
    );
  };

  return (
    <Layout>
      <SEO
        title={props.data.shopifyProduct.title}
        description={props.data.shopifyProduct.description}
      />
      <Button onClick={() => navigate(-1)}>Back to Products</Button>
      <Grid>
        <div>
          <h1>{props.data.shopifyProduct.title}</h1>
          <p>{props.data.shopifyProduct.description}</p>
          {/* Gotta make sure both below are in existence before we render the select list */}
          {product?.availableForSale && !!selectedVariant && (
            <>
              {product.variants.length > 1 && (
                <SelectWrapper>
                  <strong>Variant</strong>
                  <select
                    value={selectedVariant.id}
                    onChange={handleVariantChange}
                  >
                    {product?.variants.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.title}
                      </option>
                    ))}
                  </select>
                </SelectWrapper>
              )}

              {!!selectedVariant && (
                <>
                  <Price>${selectedVariant.price}</Price>
                  <ProductQuantityAdder
                    available={selectedVariant.available}
                    variantId={selectedVariant.id}
                  />
                </>
              )}
            </>
          )}
        </div>

        <div>
          <ImageGallery
            selectedVariantImageId={selectedVariant?.image.id}
            images={props.data.shopifyProduct.images}
            showVariantGallery={product !== null && product.variants.length > 1}
          />
        </div>
      </Grid>
    </Layout>
  );
};

export default ProductTemplate;
