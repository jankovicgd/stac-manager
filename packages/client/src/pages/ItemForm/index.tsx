import React from 'react';
import { useParams } from 'react-router-dom';
import { usePageTitle } from '../../hooks';

function ItemForm() {
  const { itemId } = useParams();
  usePageTitle(`Edit item ${itemId}`);

  return <p>Page not available</p>;
}

export default ItemForm;
