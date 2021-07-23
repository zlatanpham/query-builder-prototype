import { useEffect, useRef, useState } from 'react';
import { render } from 'react-dom';
import { useCombobox } from 'downshift';
import { Item, fieldOptions, operatorOptions, booleanOptions } from './shared';
import './index.css';
import {
  Code,
  Box,
  IconButton,
  usePopper,
  Portal,
  Flex,
} from '@sajari-ui/core';
import { ContextProvider, useContextProvider } from './ContextProvider';
import { Pill } from './components/Pill';

function DropdownMultipleCombobox() {
  const [inputValue, setInputValue] = useState('');
  const { items, setItems, removeLast, addItem } = useContextProvider();
  const lastItem = items[items.length - 1];

  const [inputFocus, setInputFocus] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  // TODO: cannot infer because the type of the suggetions is different from the type of items
  const getFilteredSuggestions = (items: any[]) => {
    return items.filter((item) => {
      return (
        item?.text?.toLowerCase().startsWith(inputValue.toLowerCase()) &&
        (lastItem?.type !== 'field' ||
          (lastItem?.type === 'field' &&
            'types' in item &&
            item?.types.includes(lastItem.fieldType)))
      );
    });
  };

  const type = items[items.length - 1]?.type;
  const endFieldOption = fieldOptions.find(
    (o) => o.text === items[items.length - 2]?.value,
  );

  const suggestions =
    type === undefined || type === 'value'
      ? fieldOptions
      : type === 'field'
      ? operatorOptions
      : endFieldOption?.type === 'BOOLEAN'
      ? booleanOptions
      : [];

  const filteredSuggestions = getFilteredSuggestions(suggestions);

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
            if (!lastItem || lastItem?.type === 'value') {
              addItem({
                type: 'field',
                value: selectedItem.value,
                // @ts-ignore
                fieldType: selectedItem.type,
              });
              openMenu();
            } else if (lastItem?.type === 'field') {
              addItem({
                type: 'operator',
                value: selectedItem.value,
                field: lastItem.value,
                fieldType: lastItem.fieldType,
              });
              openMenu();
            } else if (
              lastItem?.type === 'operator' &&
              endFieldOption?.type === 'BOOLEAN'
            ) {
              openMenu();
              addItem({
                type: 'value',
                value: selectedItem.value,
                component: 'boolean',
                field: lastItem.field,
                fieldType: lastItem.fieldType,
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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.scrollLeft = wrapperRef.current?.scrollWidth;
    }

    console.log(items);
  }, [items]);

  const { popper, update, reference } = usePopper({
    forceUpdate: isOpen,
    gutter: 8,
    placement: 'bottom',
  });

  useEffect(() => {
    setHighlightedIndex(-1);
    update();
  }, [isOpen, update, setHighlightedIndex, items.length]);

  return (
    <>
      <Box padding="p-10" maxWidth="max-w-7xl" margin="mx-auto">
        <Box
          position="relative"
          borderWidth="border"
          borderColor="border-gray-300"
          borderRadius="rounded-md"
          padding={['py-1', 'pl-3']}
          display="flex"
          justifyContent="justify-between"
          flexWrap="flex-no-wrap"
          boxShadow={inputFocus ? 'shadow-outline-blue' : undefined}
        >
          <Box
            ref={wrapperRef}
            overflow="overflow-auto"
            width="w-auto"
            display="flex"
            flexWrap="flex-no-wrap"
          >
            {items.map((item, index) => (
              <Pill key={index} item={item} index={index} />
            ))}
            <Box
              flex="flex-1"
              width="w-full"
              padding="pr-20"
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
                      removeLast();
                    }

                    if (
                      e.key === 'Enter' &&
                      lastItem?.type === 'operator' &&
                      inputValue !== ''
                    ) {
                      openMenu();
                      addItem({
                        type: 'value',
                        value: inputValue,
                        component: 'text',
                        field: lastItem.field,
                        fieldType: lastItem.fieldType,
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
                          highlightedIndex === index
                            ? 'bg-blue-500'
                            : 'bg-white'
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
                            if (lastItem) {
                              if (lastItem?.type === 'value') {
                                addItem({
                                  type: 'field',
                                  value: item.value,
                                  fieldType: item.type,
                                });
                                openMenu();
                              } else if (lastItem?.type === 'field') {
                                addItem({
                                  type: 'operator',
                                  value: item.value,
                                  field: lastItem.value,
                                  fieldType: lastItem.fieldType,
                                });
                                openMenu();
                              } else if (
                                lastItem?.type === 'operator' &&
                                endFieldOption?.type === 'BOOLEAN'
                              ) {
                                openMenu();
                                addItem({
                                  type: 'value',
                                  value: item.value,
                                  component: 'boolean',
                                  field: lastItem.value,
                                  fieldType: lastItem.fieldType,
                                });
                              }
                            } else {
                              addItem({
                                type: 'field',
                                value: item.value,
                                fieldType: item.type,
                              });
                              openMenu();
                            }
                            setInputValue('');
                            // @ts-ignore
                            selectItem(null);
                          },
                        })}
                      >
                        {lastItem?.type === 'field' && (
                          <Box as="span">{item.value}</Box>
                        )}
                        <Box
                          as="span"
                          fontSize={
                            lastItem?.type === 'field' ? 'text-sm' : 'text-base'
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
          {items.length > 0 && (
            <IconButton
              label="Clear"
              icon="close"
              size="sm"
              appearance="ghost"
              onClick={() => setItems([])}
            />
          )}
        </Box>
      </Box>

      <Box padding="p-10" maxWidth="max-w-7xl" margin="mx-auto">
        <Code
          theme="dark"
          language="bash"
          value={items
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

render(
  <ContextProvider>
    <DropdownMultipleCombobox />
  </ContextProvider>,
  document.getElementById('root'),
);
