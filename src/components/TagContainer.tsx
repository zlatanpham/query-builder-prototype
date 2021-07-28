import React, { useRef, useState } from 'react';
import { Box, FlexProps, IconButton, TagInput } from '@sajari-ui/core';
import { useContextProvider } from '../ContextProvider';
import { Item, Operator, Value } from '../shared';
import { useEffect } from 'react';

interface TagContainerProps {
  index: number;
  item?: Item;
  hovered: boolean;
}

export const TagContainer = ({ index, item, hovered }: TagContainerProps) => {
  const { value = [] } = item || {};
  const [tags, setTags] = useState<string[]>(
    Array.isArray(value) ? value : [value],
  );
  const ref: React.RefObject<HTMLInputElement> = React.createRef();
  const { items, replaceItem, addItem, setSelectedItem } = useContextProvider();
  const lastItem: Item | undefined = items[items.length - 1];
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const styleProps: FlexProps = {
    overflow: undefined,
    boxShadow: undefined,
  };

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [tags]);

  return (
    <TagInput
      ref={ref}
      tags={tags}
      hasInputWrapper={false}
      onChange={setTags}
      editable={false}
      style={{ height: 24 }}
      tagRender={({ tag, onDelete, index }) => (
        <Box
          height="h-8"
          key={`selected-item-${index}`}
          margin="ml-0.5"
          padding={['pl-2', 'py-0.5']}
          whitespace="whitespace-no-wrap"
          borderRadius={
            index === tags.length - 1 ? 'rounded-r-md' : 'rounded-none'
          }
          display="inline-flex"
          justifyContent="justify-center"
          alignItems="items-center"
          transitionProperty="transition"
          transitionDuration="duration-200"
          backgroundColor={hovered ? 'bg-gray-300' : 'bg-gray-100'}
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
        // @ts-ignore
        if (e.code === 'Enter' && e.target.value === '') {
          if (tags.length && index) {
            replaceItem(index, { ...item, value: tags } as Value);
          }
          setSelectedItem(null);
        }
      }}
      placeholder="Type and press enter"
      onEnterPress={(tags) => {
        if (!item) {
          addItem({
            type: 'value',
            value: tags[0].split(','),
            component: 'tags',
            field: (lastItem as Operator).field,
            fieldType: lastItem.fieldType,
          });
        }
      }}
    />
  );
};
