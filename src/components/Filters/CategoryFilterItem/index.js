import React from 'react';
import { Checkbox } from 'components';
import { CategoryFilterItemWrapper } from './styles';
import { navigate, useLocation } from '@reach/router';
import queryString from 'query-string';

export function CategoryFilterItem({ title, id }) {
  //Grabbing the id from the URL
  const { search } = useLocation();
  const qs = queryString.parse(search);
  //grabbing the c handle as given below if it exists, makes sure each new entry is split by a comma if already in there. If there's nothing there, we set to an empty array.
  const collectionIds = qs.c?.split(',').filter(c => !!c) || [];
  const checked = collectionIds?.find(cId => cId === id);

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

    //Making sure nothing shows up in the URL if there's nothing selected

    if (newIds.length) {
      navigate(`${navigateTo}?c=${newIds.join(',')}`);
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
