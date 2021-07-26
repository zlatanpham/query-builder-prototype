import React, { useRef, useState } from 'react';
import { FlexProps, TagInput } from '@sajari-ui/core';
import { useContextProvider } from '../ContextProvider';
import { Item, Operator, Value } from '../shared';
import { useEffect } from 'react';

interface TagContainerProps {
  index?: number;
  item?: Item;
}

export const TagContainer = ({ index, item }: TagContainerProps) => {
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
    if (!index || !item) {
      return () => {};
    }

    const listener = (event) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      if (tags.length) {
        replaceItem(index, { ...item, value: tags } as Value);
      }
      setSelectedItem(null);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [index, item, ref, replaceItem, setSelectedItem, tags]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [tags]);

  return (
    <TagInput
      ref={ref}
      tags={tags}
      onChange={setTags}
      editable={false}
      size="sm"
      onBlur={() => {
        if (!index) {
          return;
        }
        timeoutRef.current = setTimeout(() => {
          setSelectedItem(null);
        }, 500);
      }}
      styleProps={styleProps}
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
