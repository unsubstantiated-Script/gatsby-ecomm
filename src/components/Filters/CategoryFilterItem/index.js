import React from 'react';
import { Checkbox } from 'components';
import { CategoryFilterItemWrapper } from './styles';
import { navigate } from 'gatsby';
import { useLocation } from '@reach/router';
import queryString from 'query-string';

export function CategoryFilterItem({ title, id }) {
  //Grabbing the id from the URL
  const { search } = useLocation();
  const qs = queryString.parse(search);
  //grabbing the c handle as given below if it exists, makes sure each new entry is split by a comma if already in there. If there's nothing there, we set to an empty array.
  const collectionIds = qs.c?.split(',').filter(c => !!c) || [];
  const checked = collectionIds?.find(cId => cId === id);

  //Making sure any search term is preserved
  const searchTerm = qs.s;

  const onClick = () => {
    let navigateTo = '/all-products';

    //Making sure these are happily coded for the URL
    let newIds = [];

    if (checked) {
      //Filters out duplicates and encodes for URL
      newIds = collectionIds
        .filter(cId => cId !== id)
        .map(cId => encodeURIComponent(cId));
    } else {
      //adding any new id to the array and encodes for URL
      collectionIds.push(id);
      newIds = collectionIds.map(cId => encodeURIComponent(cId));
    }

    //If there's just filters and no search
    if (newIds.length && !searchTerm) {
      navigate(`${navigateTo}?c=${newIds.join(',')}`);
      //If there's a search AND filter term
    } else if (newIds.length && !!searchTerm) {
      navigate(
        `${navigateTo}?c=${newIds.join(',')}&s=${encodeURIComponent(
          searchTerm
        )}`
      );
      //If there's only a search term
    } else if (!newIds.length && !!searchTerm) {
      navigate(`${navigateTo}?s=${encodeURIComponent(searchTerm)}`);
      //If there's no search and no filter
    } else {
      navigate(`${navigateTo}`);
    }
  };

  return (
    <CategoryFilterItemWrapper onClick={onClick}>
      {/* toggles based on the id of the item passed and the one pulled from the url */}
      <Checkbox checked={checked} />
      <div>{title}</div>
    </CategoryFilterItemWrapper>
  );
}
