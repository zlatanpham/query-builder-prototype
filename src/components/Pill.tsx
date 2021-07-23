import { Box, IconButton } from '@sajari-ui/core';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useContextProvider } from '../ContextProvider';
import { Item } from '../shared';

interface Props {
  index: number;
  item: Item;
}

export const Pill = ({ index, item }: Props) => {
  const {
    hoverIndexes,
    setHoverIndexes,
    removeBlock,
    selectedItem,
    setSelectedItem,
    items,
    replaceItem,
  } = useContextProvider();
  const [tempValue, setTempValue] = useState('');

  let innerRender: JSX.Element | null = null;
  let inputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (selectedItem?.type === 'value' && selectedItem.fieldType === 'STRING') {
      inputRef.current?.focus();
      setTempValue(selectedItem.value);
    }
  }, [selectedItem]);

  if (item === selectedItem) {
    return (
      <Box
        ref={inputRef}
        onBlur={() => {
          if (tempValue !== '') {
            replaceItem(index, { ...item, value: tempValue });
            setTempValue('');
          }
          setSelectedItem(null);
        }}
        as="input"
        outline="outline-none"
        value={tempValue}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setTempValue(e.target.value)
        }
        onKeyDown={(e) => {
          if (e.key !== 'Enter') {
            return;
          }
          if (tempValue !== '') {
            replaceItem(index, { ...item, value: tempValue.trim() });
            setTempValue('');
          }
          setSelectedItem(null);
        }}
        margin={item.type === 'field' && index !== 0 ? 'ml-2' : 'ml-0.5'}
      />
    );
  }

  return (
    <Box
      height="h-8"
      key={`selected-item-${index}`}
      onClick={() => {
        if (index % 3 === 2) {
          setSelectedItem(item);
        } else if (index % 3 === 1 && items[index + 1]) {
          setSelectedItem(items[index + 1]);
        } else if (index % 3 === 0 && items[index + 2]) {
          setSelectedItem(items[index + 2]);
        }
      }}
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
