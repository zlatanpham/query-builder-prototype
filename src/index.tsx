import { useEffect, useRef, useState } from 'react';
import { render } from 'react-dom';
import { useCombobox } from 'downshift';
import { JoinOperator } from './ContextProvider';
import {
  Item,
  groupFieldOptions,
  groupOperatorOptions,
  booleanOptions,
  Operator,
  GroupMenu,
  FieldOption,
} from './shared';
import './index.css';
import {
  Box,
  IconButton,
  usePopper,
  Portal,
  Select,
  Heading,
  Divider,
} from '@sajari-ui/core';
import { ContextProvider, useContextProvider } from './ContextProvider';
import { Pill, Result, DropdownItem } from './components';
import { DatePicker } from './components/DatePicker';
import { formatDate } from './utils/dateUtils';

// TODO: cannot infer because the type of the suggestions is different from the type of items
const getFilteredSuggestions = (
  items: any[],
  inputValue: string,
  activeItem: Item,
) => {
  const filterFunc = (item) =>
    item?.text?.toLowerCase().startsWith(inputValue.toLowerCase()) &&
    (activeItem?.type !== 'field' ||
      (activeItem?.type === 'field' &&
        'types' in item &&
        item?.types.includes(activeItem.fieldType)));

  // Group case
  if (items[0]?.title) {
    return items
      .map((group) => {
        return { ...group, items: group.items.filter(filterFunc) };
      })
      .filter(({ items }) => items.length > 0);
  }

  return items.filter(filterFunc);
};

const flattenSuggestions = (items: any[]) => {
  if (items[0]?.items) {
    return items.reduce((a, c) => {
      return [...a, ...c.items];
    }, []);
  }

  return items;
};

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
  const showDateContainer =
    lastItem?.type === 'operator' && lastItem?.fieldType === 'TIMESTAMP';

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

  const flatSuggestions = flattenSuggestions(filteredSuggestions);

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
                advancedJoinOperator: (selectedItem as Operator)
                  .advancedJoinOperator,
              });
              openMenu();

              const isAdvanced = (selectedItem as Operator).isAdvanced;
              if (isAdvanced) {
                const item: Item = {
                  type: 'value',
                  value: [],
                  component: 'tags',
                  field: lastItem.value,
                  fieldType: lastItem.fieldType,
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
                });
              } else if (lastItem?.fieldType === 'BOOLEAN') {
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
    placement: 'bottom-start',
  });

  useEffect(() => {
    setHighlightedIndex(-1);
    update();
  }, [isOpen, update, setHighlightedIndex, items.length]);

  const isNumberInput =
    ['INTEGER', 'FLOAT', 'DOUBLE'].includes(lastItem?.fieldType) &&
    lastItem.type === 'operator';

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
              <Pill
                key={index}
                item={item}
                index={index}
                onFocusLast={() => {
                  inputRef.current?.focus();
                  openMenu();
                }}
              />
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
                type={isNumberInput ? 'number' : 'text'}
                placeholder={isNumberInput ? 'Enter a number' : ''}
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
                      (e.key === 'Enter' || e.key === 'Tab') &&
                      inputValue !== '' &&
                      flatSuggestions.length > 0 &&
                      highlightedIndex === -1
                    ) {
                      e.preventDefault();
                      setHighlightedIndex(0);
                      return;
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
                      } else if (lastItem.fieldType === 'TIMESTAMP') {
                        addItem({
                          type: 'value',
                          value: formatDate(inputValue),
                          component: 'text',
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
                    {filteredSuggestions[0]?.title
                      ? (
                          filteredSuggestions as GroupMenu<FieldOption>[]
                        ).reduce(
                          (result, section, sectionIndex) => {
                            result.sections.push(
                              // @ts-ignore
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
                          { sections: [], itemIndex: 0 },
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
