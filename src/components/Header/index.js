import React from 'react';
import { Cart } from '../Cart';
import { Search } from '../Search';
import { Logo } from '../Logo';
import { HeaderWrapper } from './styles';
import { Link } from 'gatsby';

export function Header() {
  return (
    <HeaderWrapper>
      <div>
        <Link to="/">
          <Logo></Logo>
        </Link>
      </div>
      <Search />
      <Cart />
    </HeaderWrapper>
  );
}
