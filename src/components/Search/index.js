import React, { useState } from 'react';
import { Input } from '../Input';
import { Button } from '../Button';
import { FaSearch } from 'react-icons/fa';
import { SearchForm } from './styles';
import { useLocation } from '@reach/router';
import { navigate as gatsbyNavigate } from 'gatsby';
import queryString from 'query-string';

export function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const { search } = useLocation();
  const c = queryString.parse(search)?.c || [];

  const handleSubmit = e => {
    e.preventDefault();

    //Making sure category items exist if they do, they get tagged on to the URL with the search term
    if (c.length) {
      gatsbyNavigate(
        `/all-products?s=${encodeURIComponent(
          searchTerm
        )}&c=${encodeURIComponent(c)}`
      );
      //If they don't, then just the search term is used
    } else if (searchTerm) {
      gatsbyNavigate(`/all-products?s=${encodeURIComponent(searchTerm)}`);
    } else {
      gatsbyNavigate(`/all-products`);
    }
  };

  return (
    <SearchForm onSubmit={handleSubmit}>
      <Input
        value={searchTerm}
        onChange={e => setSearchTerm(e.currentTarget.value)}
        placeholder="Search"
      />
      <Button>
        <FaSearch />
      </Button>
    </SearchForm>
  );
}
