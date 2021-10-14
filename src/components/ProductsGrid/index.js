import React from 'react';
import { ProductsGridWrapper } from './styles';
import { ProductTile } from '../ProductTile';

export function ProductsGrid({ products }) {
  return (
    <ProductsGridWrapper>
      {products.map(product => (
        <ProductTile
          minPrice={product.priceRange.minVariantPrice.amount}
          imageFluid={product.images[0].localFile.childImageSharp.fluid}
          key={product.shopifyId}
          handle={product.handle}
          title={product.title}
          description={product.description}
        />
      ))}
    </ProductsGridWrapper>
  );
}
