import { useEffect, useRef, useState } from 'react';
import { render } from 'react-dom';
import { useCombobox } from 'downshift';
import {
  items,
  Item,
  fieldOptions,
  operatorOptions,
  booleanOptions,
} from './shared';
import './index.css';
import {
  Code,
  Box,
  IconButton,
  usePopper,
  Portal,
  Flex,
} from '@sajari-ui/core';
import { ItemRender } from './components';

function DropdownMultipleCombobox() {
  const [inputValue, setInputValue] = useState('');
  const [selectedItems, setSelectedItems] = useState<Item[]>([
    items[0],
    items[1],
    items[2],
  ]);

  const [inputFocus, setInputFocus] = useState(false);

  const [hoverIndexes, setHoverIndexes] = useState<number[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const addSelectedItem = (item: Item) => {
    setSelectedItems((prev) => [...prev, item]);
  };

  const getFilteredItems = (items) => {
    return items.filter((item) =>
      item?.text?.toLowerCase().startsWith(inputValue.toLowerCase()),
    );
  };

  const type = selectedItems[selectedItems.length - 1]?.type;
  const endFieldOption = fieldOptions.find(
    (o) => o.text === selectedItems[selectedItems.length - 2]?.value,
  );
  const endItem = selectedItems[selectedItems.length - 1];

  const suggestions =
    type === undefined || type === 'value'
      ? fieldOptions
      : type === 'field'
      ? operatorOptions
      : endFieldOption?.type === 'BOOLEAN'
      ? booleanOptions
      : [];

  const filteredSuggestions = getFilteredItems(suggestions);

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    selectItem,
    openMenu,
    setHighlightedIndex,
  } = useCombobox<Item>({
    inputValue,
    items: filteredSuggestions,
    onStateChange: ({ inputValue, type, selectedItem }) => {
      switch (type) {
        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(inputValue || '');
          break;

        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.FunctionSelectItem:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          if (selectedItem) {
            if (!endItem || endItem?.type === 'value') {
              addSelectedItem({
                type: 'field',
                value: selectedItem.value,
                // @ts-ignore
                fieldType: selectedItem.type,
              });
              openMenu();
            } else if (endItem?.type === 'field') {
              addSelectedItem({
                type: 'operator',
                value: selectedItem.value,
                field: endItem.value,
                fieldType: endItem.fieldType,
              });
              openMenu();
            } else if (
              endItem?.type === 'operator' &&
              endFieldOption?.type === 'BOOLEAN'
            ) {
              openMenu();
              addSelectedItem({
                type: 'value',
                value: selectedItem.value,
                component: 'boolean',
                field: endItem.field,
                fieldType: endItem.fieldType,
              });
            }
            setInputValue('');
            // @ts-ignore
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

  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.scrollLeft = wrapperRef.current?.scrollWidth;
    }

    console.log(selectedItems);
  }, [selectedItems.length]);

  const changeItem = (index: number) => (item: Item) => {
    setSelectedItems((prev) => {
      return prev.map((eItem, eIndex) => (eIndex === index ? item : eItem));
    });
  };

  const { popper, update, reference } = usePopper({
    forceUpdate: isOpen,
    gutter: 8,
    placement: 'bottom',
  });

  useEffect(() => {
    setHighlightedIndex(-1);
    update();
  }, [isOpen, update, setHighlightedIndex, selectedItems.length]);

  return (
    <>
      <Box padding="p-10" maxWidth="max-w-7xl" margin="mx-auto">
        <Box
          ref={wrapperRef}
          borderWidth="border"
          borderColor="border-gray-300"
          borderRadius="rounded-md"
          padding={['py-1', 'px-3']}
          overflow="overflow-auto"
          width="w-auto"
          display="flex"
          flexWrap="flex-no-wrap"
          boxShadow={inputFocus ? 'shadow-outline-blue' : undefined}
        >
          {selectedItems.map((selectedItem, index) => {
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
                margin={
                  selectedItem.type === 'field' && index !== 0
                    ? 'ml-2'
                    : 'ml-0.5'
                }
                padding={[
                  selectedItem.type === 'value' ? 'pl-2' : 'px-2',
                  'py-0.5',
                ]}
                whitespace="whitespace-no-wrap"
                borderRadius={
                  // selectedItems.length === 1 ||
                  // (index === selectedItems.length - 1 && index % 3 === 0)
                  //   ? 'rounded-md'
                  //   :
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
                    size="sm"
                    padding="px-2"
                    margin="ml-0.5"
                    display="flex"
                    alignItems="items-center"
                    justifyContent="justify-center"
                    appearance="none"
                    iconSize="sm"
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
          <Box
            flex="flex-1"
            width="w-full"
            onClick={() => {
              inputRef.current?.focus();
            }}
            display="inline-flex"
            margin="pl-1"
            {...getComboboxProps()}
          >
            <Box
              height="h-8"
              as="input"
              outline="outline-none"
              padding="p-0"
              {...getInputProps({
                ref: (ref) => {
                  // @ts-ignore
                  inputRef.current = ref;
                  // @ts-ignore
                  reference.ref.current = ref;
                },
                onFocus: () => {
                  openMenu();
                  setInputFocus(true);
                },
                onBlur: () => {
                  setInputFocus(false);
                },
                onKeyDown: (e) => {
                  if (e.key === 'Backspace' && inputValue === '') {
                    if (selectedItems.length > 0) {
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
                    endItem?.type === 'operator' &&
                    inputValue !== ''
                  ) {
                    openMenu();
                    addSelectedItem({
                      type: 'value',
                      value: inputValue,
                      component: 'text',
                      field: endItem.field,
                      fieldType: endItem.fieldType,
                    });
                    setInputValue('');
                  }
                },
              })}
            />
            <Portal>
              <Box
                style={popper.style}
                ref={popper.ref}
                display={
                  isOpen && filteredSuggestions.length > 0
                    ? undefined
                    : 'hidden'
                }
                backgroundColor="bg-white"
                borderRadius="rounded-lg"
                padding="p-2"
                zIndex="z-50"
                borderWidth="border"
                width="w-52"
                borderColor="border-gray-200"
                boxShadow="shadow-menu"
                as="ul"
              >
                <Box {...getMenuProps()}>
                  {filteredSuggestions.map((item, index) => (
                    <Flex
                      justifyContent="justify-between"
                      alignItems="items-center"
                      as="li"
                      padding={['px-3', 'py-1']}
                      borderRadius="rounded-md"
                      backgroundColor={
                        highlightedIndex === index ? 'bg-blue-500' : 'bg-white'
                      }
                      textColor={
                        highlightedIndex === index
                          ? 'text-white'
                          : 'text-gray-500'
                      }
                      key={`${item.value}${index}`}
                      {...getItemProps({
                        item,
                        index,
                        onClick: () => {
                          if (endItem) {
                            if (!endItem || endItem?.type === 'value') {
                              addSelectedItem({
                                type: 'field',
                                value: item.value,
                                fieldType: item.type,
                              });
                              openMenu();
                            } else if (endItem?.type === 'field') {
                              addSelectedItem({
                                type: 'operator',
                                value: item.value,
                                field: endItem.value,
                                fieldType: endItem.fieldType,
                              });
                              openMenu();
                            } else if (
                              endItem?.type === 'operator' &&
                              endFieldOption?.type === 'BOOLEAN'
                            ) {
                              openMenu();
                              addSelectedItem({
                                type: 'value',
                                value: item.value,
                                component: 'boolean',
                                field: endItem.value,
                                fieldType: endItem.fieldType,
                              });
                            }
                            setInputValue('');
                            // @ts-ignore
                            selectItem(null);
                          }
                        },
                      })}
                    >
                      {endItem?.type === 'field' && (
                        <Box as="span">{item.value}</Box>
                      )}
                      <Box
                        as="span"
                        fontSize={
                          endItem?.type === 'field' ? 'text-sm' : 'text-base'
                        }
                      >
                        {item.text}
                      </Box>
                    </Flex>
                  ))}
                </Box>
              </Box>
            </Portal>
          </Box>
        </Box>
      </Box>

      <Box padding="p-10" maxWidth="max-w-7xl" margin="mx-auto">
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
          whitespace="whitespace-normal"
        />
      </Box>
    </>
  );
}

render(<DropdownMultipleCombobox />, document.getElementById('root'));
