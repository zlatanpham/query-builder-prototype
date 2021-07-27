import { useEffect, useRef, useState } from 'react';
import { render } from 'react-dom';
import { useCombobox } from 'downshift';
import { JoinOperator } from './ContextProvider';
import {
  Item,
  fieldOptions,
  operatorOptions,
  booleanOptions,
  Operator,
} from './shared';
import './index.css';
import {
  Box,
  IconButton,
  usePopper,
  Portal,
  Flex,
  Select,
} from '@sajari-ui/core';
import { ContextProvider, useContextProvider } from './ContextProvider';
import { Pill, Result } from './components';

function DropdownMultipleCombobox() {
  const [inputValue, setInputValue] = useState('');
  const {
    items,
    setItems,
    removeLast,
    addItem,
    setSelectedItem,
    joinOperator,
    setJoinOperator,
  } = useContextProvider();
  const lastItem: Item | undefined = items[items.length - 1];
  const [inputFocus, setInputFocus] = useState(false);
  const previousLength = useRef(items.length);

  const wrapperRef = useRef<HTMLDivElement>(null);

  // TODO: cannot infer because the type of the suggestions is different from the type of items
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
                value: selectedItem.value as string,
                field: lastItem.value,
                fieldType: lastItem.fieldType,
                isAdvanced: (selectedItem as Operator).isAdvanced,
              });
              openMenu();
            } else if (lastItem?.type === 'operator') {
              if (lastItem.isAdvanced && inputValue) {
                addItem({
                  type: 'value',
                  value: [inputValue],
                  component: 'tags',
                  field: lastItem.field,
                  fieldType: lastItem.fieldType,
                });
              } else if (endFieldOption?.type === 'BOOLEAN') {
                openMenu();
                addItem({
                  type: 'value',
                  value: selectedItem.value as string,
                  component: 'boolean',
                  field: lastItem.field,
                  fieldType: lastItem.fieldType,
                });
              }
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
    if (wrapperRef.current && items.length > previousLength.current) {
      wrapperRef.current.scrollLeft = wrapperRef.current?.scrollWidth;
    }

    previousLength.current = items.length;
  }, [items.length]);

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
          borderColor="border-gray-200"
          borderRadius="rounded-md"
          padding={['py-1', 'pl-1']}
          display="flex"
          justifyContent="justify-between"
          flexWrap="flex-no-wrap"
          boxShadow={inputFocus ? 'shadow-outline-blue' : undefined}
        >
          <Select
            width="w-20"
            borderWidth="border-0"
            padding={['p-0', 'pl-3']}
            value={joinOperator}
            onChange={(e) => setJoinOperator(e.target.value as JoinOperator)}
          >
            <option value="AND">AND</option>
            <option value="OR">OR</option>
          </Select>
          <Box width="w-px" backgroundColor="bg-gray-200" margin="m-1" />
          <Box
            ref={wrapperRef}
            overflow="overflow-auto"
            width="w-auto"
            display="flex"
            flex="flex-1"
            flexWrap="flex-no-wrap"
          >
            {items.map((item, index) => (
              <Pill key={index} item={item} index={index} />
            ))}
            <Box
              flex="flex-1"
              width="w-full"
              display="inline-flex"
              margin="pl-1"
              onClick={() => {
                inputRef.current?.focus();
              }}
              {...getComboboxProps()}
            >
              <Box
                height="h-8"
                as="input"
                textColor="text-gray-600"
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
                    setSelectedItem(null);
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
                      if (lastItem.isAdvanced) {
                        addItem({
                          type: 'value',
                          value: inputValue
                            .trim()
                            .split(',')
                            .filter(Boolean)
                            .map((v) => v.trim()),
                          component: 'tags',
                          field: lastItem.field,
                          fieldType: lastItem.fieldType,
                        });
                      } else {
                        addItem({
                          type: 'value',
                          value: inputValue.trim(),
                          component: 'text',
                          field: lastItem.field,
                          fieldType: lastItem.fieldType,
                        });
                      }
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
                                  isAdvanced: (item as Operator).isAdvanced,
                                });
                                openMenu();
                              } else if (
                                lastItem?.type === 'operator' &&
                                endFieldOption?.type === 'BOOLEAN'
                              ) {
                                openMenu();
                                addItem({
                                  type: 'value',
                                  value: item.value as string,
                                  component: 'boolean',
                                  field: lastItem.field,
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

      <Result />
    </>
  );
}

render(
  <ContextProvider>
    <DropdownMultipleCombobox />
  </ContextProvider>,
  document.getElementById('root'),
);
