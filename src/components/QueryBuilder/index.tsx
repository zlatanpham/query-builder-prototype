import React, { useEffect, useRef, useState } from 'react';
import { useCombobox } from 'downshift';
import {
  Box,
  IconButton,
  usePopper,
  Portal,
  Select,
  Heading,
  Divider,
  Flex,
  TextInput,
  Icon,
  Tooltip,
} from '@sajari-ui/core';
import { Pill, Result, DropdownItem } from './components';
import { DatePicker } from './components/DatePicker';
import { formatDate } from './utils/dateUtils';
import { filterObjectToString } from './utils/filterObjectToString';
import { stringParser } from './utils/parser';
import { flattenSuggestions, getFilteredSuggestions } from './utils/filter';
import {
  booleanOptions,
  FieldOption,
  GroupMenu,
  groupOperatorOptions,
  Item,
  numberTypes,
  Operator,
} from './shared';
import {
  JoinOperator,
  QueryBuilderContextProvider,
  useQueryBuilderContext,
} from './context';

interface QueryBuilderProps {
  groupFieldOptions: GroupMenu<FieldOption>[];
}

export function Inner({ groupFieldOptions }: QueryBuilderProps) {
  const [inputValue, setInputValue] = useState('');
  const {
    items,
    setItems,
    removeLast,
    addItem,
    setSelectedItem,
    joinOperator,
    setJoinOperator,
  } = useQueryBuilderContext();
  const lastItem: Item | undefined = items[items.length - 1];
  const [inputFocus, setInputFocus] = useState(false);
  const previousLength = useRef(items.length);
  const showDateContainer =
    lastItem?.type === 'operator' && lastItem?.fieldType === 'TIMESTAMP';

  const [textExpression, setTextExpression] = useState('');
  const [mode, setMode] = useState<'visual' | 'text'>('visual');

  const wrapperRef = useRef<HTMLDivElement>(null);

  const type = items[items.length - 1]?.type;

  const suggestions =
    type === undefined || type === 'value'
      ? groupFieldOptions
      : type === 'field'
      ? groupOperatorOptions
      : lastItem?.fieldType === 'BOOLEAN'
      ? booleanOptions
      : [];

  const filteredSuggestions = getFilteredSuggestions(
    suggestions,
    inputValue,
    lastItem,
  );

  useEffect(() => {
    if (mode === 'visual') {
      setTextExpression(filterObjectToString(items, joinOperator));
    }
  }, [items, joinOperator, mode]);

  const [transformError, setTransformError] = useState('');

  useEffect(() => {
    if (mode === 'text') {
      try {
        const { conjunction, expressions } = stringParser(
          textExpression,
          groupFieldOptions,
        );
        setItems(expressions);
        setJoinOperator(conjunction);
        setTransformError('');
      } catch (error) {
        console.log(error);
        setTransformError(error.message);
      }
    }
  }, [textExpression, mode, setItems, setJoinOperator, groupFieldOptions]);

  const flatSuggestions = flattenSuggestions(filteredSuggestions);

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    openMenu,
    closeMenu,
    selectItem,
    setHighlightedIndex,
  } = useCombobox<Item>({
    inputValue,
    items: flatSuggestions,
    onStateChange: ({ inputValue, type, selectedItem }) => {
      switch (type) {
        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(inputValue || '');
          break;

        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.FunctionSelectItem:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          let nextItem = selectedItem;
          // if selectedItem is undefined, set [0] as fallback
          // as the result of onKeyDown in getInputProps
          if (
            !nextItem &&
            lastItem?.type === 'field' &&
            type === useCombobox.stateChangeTypes.InputKeyDownEnter
          ) {
            nextItem = flatSuggestions[0];
          }

          if (nextItem) {
            if (!lastItem || lastItem?.type === 'value') {
              addItem({
                type: 'field',
                value: nextItem.value,
                isArray: nextItem.isArray,
                // @ts-ignore
                fieldType: nextItem.type,
              });
              openMenu();
            } else if (lastItem?.type === 'field') {
              const operatorSelectedItem = nextItem as Operator;
              addItem({
                type: 'operator',
                value: nextItem.value as string,
                field: lastItem.value,
                fieldType: lastItem.fieldType,
                isAdvanced: operatorSelectedItem.isAdvanced,
                advancedJoinOperator: operatorSelectedItem.advancedJoinOperator,
                isArray: lastItem.isArray,
              });
              openMenu();

              const isAdvanced = operatorSelectedItem.isAdvanced;
              if (isAdvanced) {
                const item: Item = {
                  type: 'value',
                  value: [],
                  component: 'tags',
                  field: lastItem.value,
                  fieldType: lastItem.fieldType,
                  isArray: lastItem.isArray,
                };
                addItem(item);
                setSelectedItem(item);
              }
            } else if (lastItem?.type === 'operator') {
              if (lastItem.isAdvanced && inputValue) {
                addItem({
                  type: 'value',
                  value: [inputValue],
                  component: 'tags',
                  field: lastItem.field,
                  fieldType: lastItem.fieldType,
                  isArray: lastItem.isArray,
                });
              } else if (lastItem?.fieldType === 'BOOLEAN') {
                openMenu();
                addItem({
                  type: 'value',
                  value: nextItem.value as string,
                  component: 'boolean',
                  isArray: lastItem.isArray,
                  field: lastItem.field,
                  fieldType: lastItem.fieldType,
                });
              }
            }
            setInputValue('');
          }

          break;
        default:
          break;
      }
    },
  });
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (wrapperRef.current && items.length > previousLength.current) {
      wrapperRef.current.scrollLeft = wrapperRef.current?.scrollWidth;
    }

    previousLength.current = items.length;
  }, [items.length]);

  const { popper, update, reference } = usePopper({
    forceUpdate: isOpen,
    gutter: 8,
    placement: 'bottom-start',
  });

  useEffect(() => {
    setHighlightedIndex(-1);
    update();
  }, [isOpen, update, setHighlightedIndex, items.length]);

  const isNumberInput =
    numberTypes.includes(lastItem?.fieldType) && lastItem.type === 'operator';

  return (
    <>
      <Box padding={['p-10', 'pt-20']} maxWidth="max-w-7xl" margin="mx-auto">
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
          {transformError ? (
            <Tooltip
              label={
                transformError === 'undefined'
                  ? 'The query is not supported by the Visual mode'
                  : transformError
              }
            >
              <Flex
                justifyContent="justify-center"
                alignItems="items-center"
                flex="flex-none"
                width="w-8"
              >
                <Icon
                  name="warning"
                  color={
                    transformError === 'undefined'
                      ? 'text-gray-400'
                      : 'text-red-500'
                  }
                />
              </Flex>
            </Tooltip>
          ) : (
            <IconButton
              width="w-8"
              flex="flex-none"
              icon={mode === 'text' ? 'pencil' : 'small-filter'}
              onClick={() => {
                setMode(mode === 'text' ? 'visual' : 'text');
              }}
              label={mode === 'text' ? 'Text mode' : 'Visual mode'}
              size="sm"
              borderWidth="border-0"
            />
          )}

          <Box
            width="w-px"
            backgroundColor="bg-gray-200"
            margin="m-1"
            height="h-6"
          />
          {mode === 'text' ? (
            <TextInput
              outline="outline-none"
              boxShadow="focus:shadow-none"
              borderRadius="rounded-none"
              value={textExpression}
              onChange={(e) => setTextExpression(e.target.value)}
              onFocus={() => setInputFocus(true)}
              onBlur={() => setInputFocus(false)}
              borderWidth="border-0"
              height="h-8"
            />
          ) : (
            <Box
              ref={wrapperRef}
              overflow="overflow-auto"
              onScroll={() => {
                closeMenu();
              }}
              width="w-auto"
              display="flex"
              flex="flex-1"
              flexWrap="flex-no-wrap"
            >
              {items.map((item, index) => (
                <React.Fragment key={index}>
                  <Pill
                    key={index}
                    index={index}
                    item={item}
                    onFocusLast={() => {
                      inputRef.current?.focus();
                      openMenu();
                    }}
                    onScrollEnd={() => {
                      setTimeout(() => {
                        wrapperRef.current?.scroll({
                          left: wrapperRef.current.scrollWidth,
                        });
                      });
                    }}
                  />
                  {index === 2 && items.length > 3 && (
                    <Select
                      borderRadius="rounded-none"
                      width="w-20"
                      flex="flex-none"
                      borderWidth="border-0"
                      padding={['p-0', 'pl-3']}
                      value={joinOperator}
                      onChange={(e) =>
                        setJoinOperator(e.target.value as JoinOperator)
                      }
                    >
                      <option value="AND">AND</option>
                      <option value="OR">OR</option>
                    </Select>
                  )}

                  {index > 2 && index % 3 === 2 && index !== items.length - 1 && (
                    <Flex
                      height="h-8"
                      justifyContent="justify-center"
                      flex="flex-none"
                      width="w-14"
                      textColor="text-gray-500"
                      lineHeight="leading-none"
                      alignItems="items-center"
                    >
                      {joinOperator}
                    </Flex>
                  )}
                </React.Fragment>
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
                <Box position="relative">
                  <Box
                    style={{ minWidth: 150 }}
                    padding="px-2"
                    textColor="text-transparent"
                    userSelect="select-none"
                    whitespace="whitespace-no-wrap"
                  >
                    {inputValue}
                  </Box>
                  <Box
                    height="h-8"
                    as="input"
                    type={isNumberInput ? 'number' : 'text'}
                    placeholder={isNumberInput ? 'Enter a number' : ''}
                    textColor="text-gray-600"
                    outline="outline-none"
                    padding="p-0"
                    position="absolute"
                    width="w-full"
                    backgroundColor="bg-transparent"
                    maxWidth="max-w-full"
                    inset="inset-0"
                    {...getInputProps({
                      value: inputValue,
                      onChange: (e) =>
                        setInputValue((e.target as HTMLInputElement).value),
                      ref: (ref) => {
                        inputRef.current = ref;
                        // Consider fixing this since reference.ref points to HTMLButtonElement
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
                          (e.key === 'Enter' || e.key === 'Tab') &&
                          inputValue !== '' &&
                          flatSuggestions.length > 0 &&
                          highlightedIndex === -1
                        ) {
                          e.preventDefault();
                          setHighlightedIndex(0);
                          return;
                        }

                        if (e.key === 'Enter' && highlightedIndex === 0) {
                          selectItem(flatSuggestions[0]);
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
                              isArray: lastItem.isArray,
                            });
                          } else if (lastItem.fieldType === 'TIMESTAMP') {
                            addItem({
                              type: 'value',
                              value: formatDate(inputValue),
                              component: 'text',
                              isArray: lastItem.isArray,
                              field: lastItem.field,
                              fieldType: lastItem.fieldType,
                            });
                          } else {
                            addItem({
                              type: 'value',
                              value: inputValue.trim(),
                              component: 'text',
                              isArray: lastItem.isArray,
                              field: lastItem.field,
                              fieldType: lastItem.fieldType,
                            });
                          }
                          setInputValue('');
                        }
                      },
                    })}
                  />
                </Box>
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
                      {filteredSuggestions[0]?.title
                        ? (
                            filteredSuggestions as GroupMenu<FieldOption>[]
                          ).reduce(
                            (result, section, sectionIndex) => {
                              result.sections.push(
                                <Box as="li" key={sectionIndex}>
                                  {sectionIndex > 0 && <Divider />}
                                  <Heading margin={['ml-1', 'my-1']} as="h6">
                                    {section.title}
                                  </Heading>
                                  <Box as="ul">
                                    {section.items.map((item) => {
                                      const index = result.itemIndex;
                                      result.itemIndex = result.itemIndex + 1;
                                      return (
                                        <DropdownItem
                                          key={`${item.value}${index}`}
                                          item={item}
                                          highlightedIndex={highlightedIndex}
                                          index={index}
                                          openMenu={openMenu}
                                          setInputValue={setInputValue}
                                          getItemProps={getItemProps}
                                        />
                                      );
                                    })}
                                  </Box>
                                </Box>,
                              );

                              return result;
                            },
                            { sections: [] as JSX.Element[], itemIndex: 0 },
                          ).sections
                        : filteredSuggestions.map((item, index) => (
                            <DropdownItem
                              key={`${item.value}${index}`}
                              item={item}
                              highlightedIndex={highlightedIndex}
                              index={index}
                              openMenu={openMenu}
                              setInputValue={setInputValue}
                              getItemProps={getItemProps}
                            />
                          ))}
                    </Box>
                  </Box>
                  <Box
                    style={popper.style}
                    ref={popper.ref}
                    display={isOpen && showDateContainer ? undefined : 'hidden'}
                    backgroundColor="bg-white"
                    borderRadius="rounded-lg"
                    padding="p-2"
                    zIndex="z-50"
                    borderWidth="border"
                    borderColor="border-gray-200"
                    boxShadow="shadow-menu"
                  >
                    <DatePicker
                      inputValue={inputValue}
                      onChange={(date) => {
                        openMenu();
                        addItem({
                          type: 'value',
                          value: formatDate(date),
                          component: 'text',
                          isArray: lastItem.isArray,
                          field: (lastItem as Operator).field,
                          fieldType: lastItem.fieldType,
                        });
                        setInputValue('');
                        inputRef.current?.focus();
                      }}
                    />
                  </Box>
                </Portal>
              </Box>
            </Box>
          )}
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

      <Result textExpression={textExpression} />
    </>
  );
}

export const QueryBuilder = ({ groupFieldOptions }: QueryBuilderProps) => {
  return (
    <QueryBuilderContextProvider>
      <Inner groupFieldOptions={groupFieldOptions} />
    </QueryBuilderContextProvider>
  );
};
