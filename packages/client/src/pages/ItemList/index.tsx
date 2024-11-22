import React, { useEffect } from 'react';
import { Heading, Flex } from '@chakra-ui/react';
import { useStacSearch } from '@developmentseed/stac-react';

import { usePageTitle } from '../../hooks';
import ItemListFilter from './ItemListFilter';
import ItemResults from '../../components/ItemResults';

function ItemList() {
  usePageTitle('Items');
  const {
    results,
    state,
    sortby,
    setSortby,
    limit,
    setLimit,
    submit,
    nextPage,
    previousPage,
    ...searchState
  } = useStacSearch();

  // Submit handlers and effects
  useEffect(() => {
    // Automatically submit to receive intial results
    if (results) return;
    submit();
  }, [submit]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Flex direction='column' gap={8}>
      <Heading>Items</Heading>
      <ItemListFilter submit={submit} {...searchState} />
      <ItemResults
        results={results}
        sortby={sortby}
        setSortby={setSortby}
        limit={limit}
        setLimit={setLimit}
        previousPage={previousPage}
        nextPage={nextPage}
        state={state}
        submit={submit}
      />
    </Flex>
  );
}

export default ItemList;
