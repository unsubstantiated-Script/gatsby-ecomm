import React, { useContext } from 'react';
import { Layout, Filters, ProductsGrid, SEO } from 'components';
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
  const searchTerm = qs.s;

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

  const filterBySearchTerm = product => {
    //looking for the search term in the object by its position in the array. -1 means it doesn't exist
    if (searchTerm) {
      return product.title.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0;
    }
    //if it's not found, it'll return all the things
    return true;
  };

  const filteredProducts = products
    .filter(filterByCategory)
    .filter(filterBySearchTerm);

  return (
    <Layout>
      <SEO title="All Products" description="The Mad Hatter Store Products" />
      {!!searchTerm && !!filteredProducts.length && (
        <h3>
          Search term: <strong>'{searchTerm}'</strong>
        </h3>
      )}
      {!!filteredProducts.length && (
        <h4> {filteredProducts.length} Products</h4>
      )}
      <Content>
        <Filters />
        {!!filteredProducts.length ? (
          <div>
            <ProductsGrid products={filteredProducts} />
          </div>
        ) : (
          <div>
            <h3>
              <span>Oh no! Nothing Matches</span>
              &nbsp; '{searchTerm}'
            </h3>
            <div>
              To help with your search, why not try:
              <br />
              <br />
              <ul>
                <li>Check your spelling </li>
                <li>Use fewer words </li>
                <li>Try using a different search term </li>
              </ul>
            </div>
          </div>
        )}
      </Content>
    </Layout>
  );
}
