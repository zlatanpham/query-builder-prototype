import React, { useState } from 'react';
import { Box, Flex, FlexProps, IconButton, TagInput } from '@sajari-ui/core';
import { Item, Value } from '../shared';
import { useEffect } from 'react';
import { useQueryBuilderContext } from '../context';

interface TagContainerProps {
  index: number;
  item?: Item;
  hovered: boolean;
  onFocusLast: () => void;
  onScrollEnd: () => void;
}

const styleProps: FlexProps = {
  overflow: undefined,
  boxShadow: undefined,
};

export const TagContainer = ({
  index,
  item,
  hovered,
  onFocusLast,
  onScrollEnd,
}: TagContainerProps) => {
  const { value = [] } = item || {};
  const [tags, setTags] = useState<string[]>(
    Array.isArray(value) ? value : [String(value)],
  );
  const ref: React.RefObject<HTMLInputElement> = React.createRef();
  const { items, replaceItem, setSelectedItem } = useQueryBuilderContext();
  const lastItem: Item | undefined = items[items.length - 1];

  useEffect(() => {
    if (!index || !item) {
      return () => {};
    }

    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      replaceItem(index, { ...item, value: tags } as Value);
      setSelectedItem(null);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [index, item, ref, replaceItem, setSelectedItem, tags]);

  return (
    <Flex
      backgroundColor={hovered ? 'bg-gray-300' : 'bg-gray-100'}
      transitionProperty="transition"
      transitionDuration="duration-200"
      height="h-8"
      alignItems="items-center"
      padding={[tags.length === 0 ? 'px-0.5' : 'pr-0.5']}
      borderRadius="rounded-r-md"
    >
      <TagInput
        ref={ref}
        tags={tags}
        hasInputWrapper={false}
        onChange={setTags}
        editable={false}
        style={{ height: 28 }}
        padding="pl-2"
        splitChar=","
        placeholder="Type and press enter"
        borderRadius="rounded-l-none"
        tagRender={({ tag, onDelete, index }) => (
          <Box
            height="h-8"
            key={`selected-item-${index}`}
            padding={['pl-2', 'py-0.5']}
            whitespace="whitespace-no-wrap"
            display="inline-flex"
            justifyContent="justify-center"
            alignItems="items-center"
          >
            {tag}
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
                onDelete();
              }}
            />
          </Box>
        )}
        styleProps={styleProps}
        onKeyDown={(e) => {
          if (
            e.code === 'Enter' &&
            (e.target as HTMLInputElement).value === ''
          ) {
            if (index) {
              replaceItem(index, { ...item, value: tags } as Value);
            }
            setSelectedItem(null);
            if (item === lastItem) {
              onFocusLast();
            }
          }
        }}
        onEnterPress={() => onScrollEnd()}
      />
    </Flex>
  );
};
