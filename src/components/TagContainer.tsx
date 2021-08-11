import React, { useState } from 'react';
import { Box, Flex, FlexProps, IconButton, TagInput } from '@sajari-ui/core';
import { useContextProvider } from '../ContextProvider';
import { Item, Value } from '../shared';
import { useEffect } from 'react';

interface TagContainerProps {
  index: number;
  item?: Item;
  hovered: boolean;
  onFocusLast: () => void;
}

export const TagContainer = ({
  index,
  item,
  hovered,
  onFocusLast,
}: TagContainerProps) => {
  const { value = [] } = item || {};
  const [tags, setTags] = useState<string[]>(
    Array.isArray(value) ? value : [value],
  );
  const ref: React.RefObject<HTMLInputElement> = React.createRef();
  const { items, replaceItem, setSelectedItem } = useContextProvider();
  const lastItem: Item | undefined = items[items.length - 1];

  const styleProps: FlexProps = {
    overflow: undefined,
    boxShadow: undefined,
  };

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
      padding={[tags.length === 0 ? 'px-2' : 'pr-2']}
      borderRadius="rounded-r-md"
    >
      <TagInput
        ref={ref}
        tags={tags}
        hasInputWrapper={false}
        onChange={setTags}
        editable={false}
        style={{ height: 24 }}
        splitChar=","
        placeholder="Type and press Enter"
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
      />
    </Flex>
  );
};
