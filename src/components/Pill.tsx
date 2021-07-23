import { Box, IconButton } from '@sajari-ui/core';
import { useContextProvider } from '../ContextProvider';
import { Item } from '../shared';

interface Props {
  index: number;
  item: Item;
}

export const Pill = ({ index, item }: Props) => {
  const { hoverIndexes, setHoverIndexes, removeBlock } = useContextProvider();

  let innerRender: JSX.Element | null = null;

  if (item.type === 'field') {
    innerRender = (
      <Box as="span" textColor="text-gray-500">
        {item.value}
      </Box>
    );
  } else if (item.type === 'operator') {
    innerRender = (
      <Box as="span" textColor="text-gray-700">
        {item.value}
      </Box>
    );
  } else if (item.type === 'value') {
    innerRender = (
      <Box as="span" textColor="text-gray-700">
        {item.value}
      </Box>
    );
  }

  return (
    <Box
      height="h-8"
      key={`selected-item-${index}`}
      onMouseEnter={() => {
        const p = index + 1;
        if (p % 3 === 0) {
          setHoverIndexes([index, index - 1, index - 2]);
        } else if (p % 3 === 2) {
          setHoverIndexes([index - 1, index, index + 1]);
        } else {
          setHoverIndexes([index, index + 1, index + 2]);
        }
      }}
      margin={item.type === 'field' && index !== 0 ? 'ml-2' : 'ml-0.5'}
      padding={[item.type === 'value' ? 'pl-2' : 'px-2', 'py-0.5']}
      whitespace="whitespace-no-wrap"
      borderRadius={
        index % 3 === 0
          ? 'rounded-l-md'
          : index % 3 === 2
          ? 'rounded-r-md'
          : 'rounded-none'
      }
      display="inline-flex"
      justifyContent="justify-center"
      alignItems="items-center"
      transitionProperty="transition"
      transitionDuration="duration-200"
      backgroundColor={
        hoverIndexes.includes(index) ? 'bg-gray-300' : 'bg-gray-100'
      }
      onMouseLeave={() => {
        setHoverIndexes([]);
      }}
    >
      {innerRender}
      {item.type === 'value' && (
        <IconButton
          icon="close"
          size="sm"
          padding="px-2"
          margin="ml-0.5"
          display="flex"
          alignItems="items-center"
          justifyContent="justify-center"
          appearance="none"
          textColor="text-gray-700"
          iconSize="sm"
          label="Remove"
          onClick={() => {
            removeBlock(index);
          }}
        />
      )}
    </Box>
  );
};
