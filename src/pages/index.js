import React, { useContext } from 'react';
import { Layout, SEO } from 'components';
import ProductContext from 'context/ProductContext';
import { HomepageCollectionsGrid } from 'components';

const IndexPage = () => {
  const { collections } = useContext(ProductContext);
  console.log(collections);
  return (
    <Layout>
      {/* Making sure we only get the collections that are not featured hats  */}
      <HomepageCollectionsGrid
        collections={collections.filter(
          collection => collection.title !== 'Featured Hats'
        )}
      />
    </Layout>
  );
};

export default IndexPage;
