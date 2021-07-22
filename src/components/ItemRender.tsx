import { Box } from '@sajari-ui/core';
import { useEffect, useRef } from 'react';
import { Item } from '../shared';

export const ItemRender = ({
  item,
  shouldFocus,
  onChange,
  onRemove,
}: {
  item: Item;
  shouldFocus: boolean;
  onChange: (item: Item) => void;
  onRemove: () => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (shouldFocus) {
      inputRef.current?.focus();
    }
  }, [shouldFocus]);

  if (item.type === 'field') {
    return (
      <Box as="span" textColor="text-gray-500">
        {item.value}
      </Box>
    );
  }

  if (item.type === 'operator') {
    return <Box as="span">{item.value}</Box>;
  }

  if (item.type === 'value') {
    return <Box as="span">{item.value}</Box>;
  }

  return null;
};
