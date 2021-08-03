import { Box, Flex } from '@sajari-ui/core';
import { UseComboboxGetItemPropsOptions } from 'downshift';
import { useContextProvider } from '../../ContextProvider';
import { FieldOption, Item, Operator, Suggestion } from '../../shared';

interface DropdownItemProps {
  item: Suggestion;
  index: number;
  highlightedIndex: number;
  getItemProps: (options: UseComboboxGetItemPropsOptions<Item>) => any;
  openMenu: () => void;
  setInputValue: (value: string) => void;
}

export const DropdownItem = ({
  getItemProps,
  index,
  item,
  highlightedIndex,
  openMenu,
  setInputValue,
}: DropdownItemProps) => {
  const { items, addItem, setSelectedItem, selectedItem } =
    useContextProvider();
  const lastItem = items[items.length - 1];
  console.log({ selectedItem });

  return (
    <Flex
      justifyContent="justify-between"
      alignItems="items-center"
      as="li"
      padding={['px-3', 'py-1']}
      borderRadius="rounded-md"
      backgroundColor={highlightedIndex === index ? 'bg-blue-500' : 'bg-white'}
      textColor={highlightedIndex === index ? 'text-white' : 'text-gray-500'}
      key={`${item.value}${index}`}
      {...getItemProps({
        // @ts-ignore
        item,
        index,
        onClick: () => {
          if (lastItem) {
            if (lastItem?.type === 'value') {
              addItem({
                type: 'field',
                value: item.value,
                fieldType: (item as FieldOption).type,
              });
              openMenu();
            } else if (lastItem?.type === 'field') {
              addItem({
                type: 'operator',
                value: item.value,
                field: lastItem.value,
                fieldType: lastItem.fieldType,
                // @ts-ignore
                isAdvanced: (item as Operator).isAdvanced,
                // @ts-ignore
                advancedJoinOperator: (item as Operator).advancedJoinOperator,
              });

              // @ts-ignore
              const isAdvanced = (item as Operator).isAdvanced;
              if (isAdvanced) {
                console.log(123456);
                const newItem: Item = {
                  type: 'value',
                  value: [],
                  component: 'tags',
                  field: lastItem.value,
                  fieldType: lastItem.fieldType,
                };
                addItem(newItem);
                // FIXME: look like a race condition happens here. Temporarily use setTimeout to make sure the selectedItem is set correctly
                setTimeout(() => {
                  setSelectedItem(newItem);
                });
                return;
              } else {
                openMenu();
              }
            } else if (
              lastItem?.type === 'operator' &&
              lastItem?.fieldType === 'BOOLEAN'
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
              fieldType: (item as FieldOption).type,
            });
            openMenu();
          }
          setInputValue('');
        },
      })}
    >
      {lastItem?.type === 'field' && <Box as="span">{item.value}</Box>}
      <Box
        as="span"
        fontSize={lastItem?.type === 'field' ? 'text-sm' : 'text-base'}
      >
        {item.text}
      </Box>
    </Flex>
  );
};
