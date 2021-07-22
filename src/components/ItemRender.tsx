import { Box } from '@sajari-ui/core';
import { Item } from '../shared';

export const ItemRender = ({
  item,
  onChange,
  onRemove,
}: {
  item: Item;
  onChange: (item: Item) => void;
  onRemove: () => void;
}) => {
  if (item.type === 'field') {
    return (
      <Box as="span" textColor="text-gray-500">
        {item.value}
      </Box>
    );
  }

  if (item.type === 'operator') {
    return (
      <Box as="span" textColor="text-gray-700">
        {item.value}
      </Box>
    );
  }

  if (item.type === 'value') {
    return (
      <Box as="span" textColor="text-gray-700">
        {item.value}
      </Box>
    );
  }

  return null;
};
