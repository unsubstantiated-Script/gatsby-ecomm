import React, { useContext } from 'react';
import { Layout, Filters, ProductsGrid } from 'components';
import ProductContext from 'context/ProductContext';
import styled from 'styled-components';
import queryString from 'query-string';
import { useLocation } from '@reach/router';

//Pages can't have a separate styled component
const Content = styled.div`
  display: grid;
  grid-gap: 20px;
  margin-top: 20px;
  grid-template-columns: 1fr 3fr;
`;

export default function AllProducts() {
  const { products, collections } = useContext(ProductContext);
  const collectionProductMap = {};

  const { search } = useLocation();
  const qs = queryString.parse(search);
  const selectedCollectionIds = qs.c?.split(',').filter(c => !!c) || [];
  const selectedCollectionIdsMap = {};

  selectedCollectionIds.forEach(cId => {
    selectedCollectionIdsMap[cId] = true;
  });

  if (collections) {
    //Looping through the collections
    collections.forEach(collection => {
      //For each location, this creates a new object
      collectionProductMap[collection.shopifyId] = {};
      //This will load each product id into the above inner object
      collection.products.forEach(product => {
        collectionProductMap[collection.shopifyId][product.shopifyId] = true;
      });
    });
  }

  console.log(collectionProductMap);

  const filterByCategory = product => {
    if (Object.keys(selectedCollectionIdsMap).length) {
      for (let key in selectedCollectionIdsMap) {
        if (collectionProductMap[key]?.[product.shopifyId]) {
          //return just the selected items from categories
          return true;
        }
      }
      //Do not return items that are not included
      return false;
    }
    //No selected filters return all
    return true;
  };

  const filteredProducts = products.filter(filterByCategory);

  return (
    <Layout>
      <h4> {products.length} Products</h4>
      <Content>
        <Filters />
        <div>
          <ProductsGrid products={filteredProducts} />
        </div>
      </Content>
    </Layout>
  );
}
