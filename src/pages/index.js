import React, { useContext } from 'react';
import {
  Layout,
  SEO,
  FeaturedProducts,
  HomepageCollectionsGrid,
} from '../components';
import ProductContext from '../context/ProductContext';

const IndexPage = () => {
  const { collections } = useContext(ProductContext);
  return (
    <Layout>
      <SEO title="Home Page" description="The Mad Hatter Store Home Page" />
      {/* Making sure we only get the collections that are not featured hats  */}
      <HomepageCollectionsGrid
        collections={collections.filter(
          collection => collection.title !== 'Featured Hats'
        )}
      />
      {!!collections.find(
        collection => collection.title === 'Featured Hats'
      ) && <FeaturedProducts />}
    </Layout>
  );
};

export default IndexPage;
