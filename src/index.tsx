import { useEffect, useRef, useState } from 'react';
import { render } from 'react-dom';
import { useCombobox } from 'downshift';
import {
  items,
  Item,
  fieldOptions,
  operationOptions,
  booleanOptions,
  operationMapping,
} from './shared';
import { Container, Wrapper, InputContainer, Dropdown, Input } from './styled';
import './index.css';
import { Code, Box, IconButton } from '@sajari-ui/core';

const ItemRender = ({
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
    return <Box as="span">{item.value}</Box>;
  }

  if (item.type === 'operation') {
    return <Box as="span">{operationMapping[item.value]}</Box>;
  }

  if (item.type === 'value') {
    if (item.component === 'text') {
      return (
        <input
          ref={inputRef}
          value={item.value}
          onChange={(e) => {
            onChange({ ...item, value: e.target.value });
          }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && item.value === '') {
              onRemove();
            }
          }}
        />
      );
    }

    if (item.component === 'boolean') {
      return <Box as="span">{item.value}</Box>;
    }
  }

  return null;
};

function DropdownMultipleCombobox() {
  const [inputValue, setInputValue] = useState('');
  const [selectedItems, setSelectedItems] = useState<Item[]>([
    items[0],
    items[1],
    items[2],
  ]);

  const [hoverIndexes, setHoverIndexes] = useState<number[]>([]);

  const addSelectedItem = (item) => {
    setSelectedItems((prev) => [...prev, item]);
  };

  const getFilteredItems = (items) =>
    items.filter((item) =>
      item?.text?.toLowerCase().startsWith(inputValue.toLowerCase()),
    );

  const type = selectedItems[selectedItems.length - 1]?.type;
  const endFieldOption = fieldOptions.find(
    (o) => o.value === selectedItems[selectedItems.length - 2]?.value,
  );
  const endItem = selectedItems[selectedItems.length - 1];

  const suggestions =
    type === undefined || type === 'value'
      ? fieldOptions
      : type === 'field'
      ? operationOptions
      : endFieldOption?.type === 'BOOLEAN'
      ? booleanOptions
      : [];

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    selectItem,
    selectedItem,
    openMenu,
    setHighlightedIndex,
  } = useCombobox({
    inputValue,
    items: getFilteredItems(suggestions),
    onStateChange: ({ inputValue, type, selectedItem }) => {
      switch (type) {
        case useCombobox.stateChangeTypes.InputChange:
          // @ts-ignore
          setInputValue(inputValue);
          break;

        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          if (selectedItem) {
            if (!endItem || endItem?.type === 'value') {
              // @ts-ignore
              addSelectedItem({
                type: 'field',
                // @ts-ignore
                value: selectedItem.value,
                // @ts-ignore
                fieldType: selectedItem.type,
              });
              openMenu();
            } else if (endItem?.type === 'field') {
              // @ts-ignore
              addSelectedItem({ type: 'operation', value: selectedItem.value });
              openMenu();
            } else if (
              endItem?.type === 'operation' &&
              endFieldOption?.type === 'BOOLEAN'
            ) {
              openMenu();
              // @ts-ignore
              addSelectedItem({
                type: 'value',
                // @ts-ignore
                value: selectedItem.value,
                component: 'boolean',
              });
            }
            setInputValue('');
            selectItem(null);
          }

          break;
        default:
          break;
      }
    },
  });
  const [focusIndex, setFocusIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const [lastItem, setLastItem] = useState<null | Item>(null);

  useEffect(() => {
    if (lastItem) {
      setInputValue(lastItem.value.substring(0, lastItem.value.length - 1));
      inputRef.current?.focus();
    }
  }, [lastItem]);

  const changeItem = (index: number) => (item: Item) => {
    setSelectedItems((prev) => {
      return prev.map((eItem, eIndex) => (eIndex === index ? item : eItem));
    });
  };

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [isOpen]);

  return (
    <div>
      <Container>
        <Wrapper>
          {selectedItems.map((selectedItem, index) => {
            return (
              <Box
                key={`selected-item-${index}`}
                margin={['mr-0.5']}
                // isBegin={selectedItem.type === 'field' && index !== 0}
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
                transitionProperty="transition"
                transitionDuration="duration-200"
                backgroundColor={
                  hoverIndexes.includes(index) ? 'bg-gray-300' : 'bg-gray-200'
                }
                onMouseLeave={() => {
                  setHoverIndexes([]);
                }}
              >
                <ItemRender
                  item={selectedItem}
                  shouldFocus={focusIndex === index}
                  onChange={changeItem(index)}
                  onRemove={() => {
                    setFocusIndex(index - 1);
                    openMenu();
                    setLastItem(selectedItems[selectedItems.length - 2]);
                    setSelectedItems((prev) =>
                      prev.filter(
                        (_, i) =>
                          i !== selectedItems.length - 1 &&
                          i !== selectedItems.length - 2,
                      ),
                    );
                  }}
                />
                {selectedItem.type === 'value' && (
                  <IconButton
                    icon="close"
                    margin="ml-2.5"
                    size="sm"
                    label="Remove"
                    onClick={() => {
                      const selectedIndex = selectedItems.indexOf(selectedItem);
                      const newItems = [...selectedItems];
                      setSelectedItems(
                        newItems.filter((_, index) => {
                          return (
                            index !== selectedIndex - 2 &&
                            index !== selectedIndex - 1 &&
                            index !== selectedIndex
                          );
                        }),
                      );
                    }}
                  />
                )}
              </Box>
            );
          })}
          <InputContainer {...getComboboxProps()}>
            <Input
              {...getInputProps({
                ref: inputRef,
                onFocus: () => {
                  openMenu();
                },
                onKeyDown: (e) => {
                  if (e.key === 'Backspace' && inputValue === '') {
                    if (
                      endItem?.type === 'value' &&
                      endItem?.component === 'text'
                    ) {
                    } else if (selectedItems.length > 0) {
                      setSelectedItems((prev) =>
                        prev.filter((_, i) => i !== prev.length - 1),
                      );
                    }
                    setFocusIndex(selectedItems.length - 1);
                    setTimeout(() => {
                      setFocusIndex(-1);
                    }, 500);
                  }

                  if (
                    e.key === 'Enter' &&
                    endItem?.type === 'operation' &&
                    inputValue !== ''
                  ) {
                    openMenu();
                    // @ts-ignore
                    addSelectedItem({
                      type: 'value',
                      value: inputValue,
                      component: 'text',
                    });
                    setInputValue('');
                  }
                },
              })}
            />
            {isOpen && suggestions.length > 0 && (
              <Dropdown {...getMenuProps()}>
                {getFilteredItems(suggestions).map((item, index) => (
                  <li
                    style={
                      highlightedIndex === index
                        ? { backgroundColor: '#bde4ff' }
                        : {}
                    }
                    key={`${item.value}${index}`}
                    {...getItemProps({
                      item,
                      index,
                    })}
                  >
                    {item.text}
                  </li>
                ))}
              </Dropdown>
            )}
          </InputContainer>
        </Wrapper>
      </Container>

      <Container>
        <Code
          theme="dark"
          language="bash"
          value={selectedItems
            .map((item, index) => {
              if (item.type === 'field') {
                return index === 0 ? item.value : `AND ${item.value}`;
              }
              if (item.type === 'value') {
                return `'${item.value}'`;
              }

              return item.value;
            })
            .join(' ')}
          showCopyButton={false}
          flex="flex-1"
        />
      </Container>
    </div>
  );
}

render(<DropdownMultipleCombobox />, document.getElementById('root'));
