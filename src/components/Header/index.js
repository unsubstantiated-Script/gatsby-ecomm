import React from 'react';
import { Cart } from '../Cart';
import { Search } from '../Search';
import { HeaderWrapper } from './styles';

export function Header() {
  return (
    <HeaderWrapper>
      <Search />
      <Cart />
    </HeaderWrapper>
  );
}
