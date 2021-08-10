import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Portal,
  Tooltip,
  usePopper,
} from '@sajari-ui/core';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useContextProvider } from '../ContextProvider';
import { advancedOperatorMapping, Item, operatorMapping } from '../shared';
import { formatDate } from '../utils/dateUtils';
import { DatePicker } from './DatePicker';
import { TagContainer } from './TagContainer';

interface Props {
  index: number;
  item: Item;
  onFocusLast: () => void;
}

export const Pill = ({ index, item, onFocusLast }: Props) => {
  const {
    hoverIndexes,
    setHoverIndexes,
    removeBlock,
    selectedItem,
    setSelectedItem,
    items,
    replaceItem,
  } = useContextProvider();
  const [tempValue, setTempValue] = useState('');

  let innerRender: JSX.Element | null = null;
  let inputRef = useRef<HTMLInputElement | null>(null);

  const hasDateContainer =
    item.type === 'value' && item.fieldType === 'TIMESTAMP';
  const showDateContainer = hasDateContainer && item === selectedItem;

  const { popper, reference } = usePopper({
    forceUpdate: showDateContainer,
    gutter: 8,
    placement: 'bottom-start',
  });

  if (item.type === 'field') {
    innerRender = (
      <Box as="span" textColor="text-gray-500">
        {item.value}
      </Box>
    );
  } else if (item.type === 'operator') {
    innerRender = (
      <Box as="span" textColor="text-gray-700">
        {item.value}
      </Box>
    );
  } else if (item.type === 'value') {
    innerRender = (
      <Box as="span" textColor="text-gray-700">
        {Array.isArray(item.value) ? item.value.join(', ') : item.value}
      </Box>
    );
  }

  useEffect(() => {
    if (selectedItem?.type === 'value' && selectedItem.fieldType === 'STRING') {
      inputRef.current?.focus();
    }
    if (selectedItem) {
      if (typeof selectedItem.value === 'string') {
        setTempValue(selectedItem.value);
      } else if (Array.isArray(selectedItem.value)) {
        setTempValue(selectedItem.value.join(','));
      }
    }
  }, [selectedItem]);

  const onMouseEnter = () => {
    const p = index + 1;
    if (p % 3 === 0) {
      setHoverIndexes([index, index - 1, index - 2]);
    } else if (p % 3 === 2) {
      setHoverIndexes([index - 1, index, index + 1]);
    } else {
      setHoverIndexes([index, index + 1, index + 2]);
    }
  };

  const onMouseLeave = () => {
    setHoverIndexes([]);
  };

  if (
    item === selectedItem &&
    selectedItem.type === 'value' &&
    selectedItem.component === 'tags'
  ) {
    return (
      <Box
        margin={item.type === 'field' && index !== 0 ? 'ml-0' : 'ml-0.5'}
        position="relative"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <TagContainer
          index={index}
          item={item}
          hovered={hoverIndexes.includes(index)}
          onFocusLast={onFocusLast}
        />
      </Box>
    );
  }

  if (item === selectedItem && selectedItem.fieldType === 'TIMESTAMP') {
    return (
      <Box
        margin={item.type === 'field' && index !== 0 ? 'ml-0' : 'ml-0.5'}
        position="relative"
      >
        <Box
          position="absolute"
          width="w-full"
          backgroundColor="bg-transparent"
          maxWidth="max-w-full"
          inset="inset-0"
          padding="px-1"
          ref={(ref) => {
            inputRef.current = ref as HTMLInputElement;
            // @ts-ignore
            reference.ref.current = ref;
          }}
          onBlur={() => {
            if (tempValue !== '') {
              replaceItem(index, { ...item, value: tempValue });
              setTempValue('');
            }
            setSelectedItem(null);
          }}
          as="input"
          textColor="text-gray-600"
          outline="outline-none"
          value={tempValue}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setTempValue(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key !== 'Enter') {
              return;
            }
            if (tempValue !== '') {
              replaceItem(index, { ...item, value: formatDate(tempValue) });
              setTempValue('');
            }
            setSelectedItem(null);
          }}
        />
        <Box
          style={{ minWidth: 50 }}
          padding="px-2"
          textColor="text-transparent"
          userSelect="select-none"
          whitespace="whitespace-no-wrap"
        >
          {tempValue}
        </Box>
        <Portal>
          <Box
            style={popper.style}
            ref={popper.ref}
            display={showDateContainer ? undefined : 'hidden'}
            backgroundColor="bg-white"
            borderRadius="rounded-lg"
            padding="p-2"
            zIndex="z-50"
            borderWidth="border"
            borderColor="border-gray-200"
            boxShadow="shadow-menu"
          >
            <DatePicker
              inputValue={tempValue}
              onChange={(date) => {
                replaceItem(index, { ...item, value: formatDate(date) });
                setTempValue('');
              }}
            />
          </Box>
        </Portal>
      </Box>
    );
  }

  if (item === selectedItem && selectedItem.fieldType === 'BOOLEAN') {
    return (
      <Box
        margin={item.type === 'field' && index !== 0 ? 'ml-0' : 'ml-0.5'}
        position="relative"
      >
        <ButtonGroup attached>
          <Button
            size="sm"
            appearance={tempValue === 'TRUE' ? 'primary' : undefined}
            onClick={() => {
              if (tempValue !== 'TRUE') {
                replaceItem(index, { ...item, value: 'TRUE' });
              }
              setSelectedItem(null);
              setTempValue('');
            }}
          >
            TRUE
          </Button>
          <Button
            size="sm"
            appearance={tempValue === 'FALSE' ? 'primary' : undefined}
            onClick={() => {
              if (tempValue !== 'FALSE') {
                replaceItem(index, { ...item, value: 'FALSE' });
              }
              setSelectedItem(null);
              setTempValue('');
            }}
          >
            FALSE
          </Button>
        </ButtonGroup>
      </Box>
    );
  }

  if (item === selectedItem) {
    const isNumber = selectedItem.fieldType !== 'STRING';
    return (
      <Box
        margin={item.type === 'field' && index !== 0 ? 'ml-0' : 'ml-0.5'}
        position="relative"
      >
        <Box
          position="absolute"
          width="w-full"
          backgroundColor="bg-transparent"
          maxWidth="max-w-full"
          inset="inset-0"
          padding="px-1"
          ref={inputRef}
          onBlur={() => {
            if (tempValue !== '') {
              replaceItem(index, { ...item, value: tempValue });
              setTempValue('');
            }
            setSelectedItem(null);
          }}
          as="input"
          type={isNumber ? 'number' : 'text'}
          textColor="text-gray-600"
          outline="outline-none"
          value={tempValue}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setTempValue(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key !== 'Enter') {
              return;
            }
            if (tempValue !== '') {
              replaceItem(index, { ...item, value: tempValue.trim() });
              setTempValue('');
            }
            setSelectedItem(null);
          }}
        />
        <Box
          style={{ minWidth: 50 }}
          padding="px-2"
          textColor="text-transparent"
          userSelect="select-none"
          whitespace="whitespace-no-wrap"
        >
          {tempValue}
        </Box>
      </Box>
    );
  }

  const hovered = hoverIndexes.includes(index);

  const renderPill = (
    <Box
      height="h-8"
      key={`selected-item-${index}`}
      onClick={() => {
        if (index % 3 === 2) {
          setSelectedItem(item);
        } else if (index % 3 === 1 && items[index + 1]) {
          setSelectedItem(items[index + 1]);
        } else if (index % 3 === 0 && items[index + 2]) {
          setSelectedItem(items[index + 2]);
        }
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      margin={item.type === 'field' && index !== 0 ? 'ml-0' : 'ml-0.5'}
      padding={[item.type === 'value' ? 'pl-2' : 'px-2', 'py-0.5']}
      whitespace="whitespace-no-wrap"
      borderRadius={
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
      backgroundColor={hovered ? 'bg-gray-300' : 'bg-gray-100'}
    >
      {innerRender}
      {item.type === 'value' && (
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
            removeBlock(index);
          }}
        />
      )}
    </Box>
  );

  if (item.type === 'operator' && items[index + 1] && !selectedItem) {
    return (
      <Tooltip
        whitespace="whitespace-no-wrap"
        open={hovered}
        label={
          <Box maxWidth="max-w-lg" truncate="truncate">
            {getExpression(items, index)}
          </Box>
        }
        placement="top"
      >
        {renderPill}
      </Tooltip>
    );
  }

  return <>{renderPill}</>;
};

function getExpression(items: Item[], index: number) {
  const field = items[index - 1];
  const operator = items[index];
  const value = items[index + 1];

  if (
    operator.type === 'operator' &&
    operator.isAdvanced &&
    Array.isArray(value.value)
  ) {
    const operatorText =
      advancedOperatorMapping[
        `${operator.value}${operator.advancedJoinOperator}`
      ];

    if (value.value.length === 0) {
      return `${field.value} ${operatorText} `;
    }

    return `${field.value} ${operatorText} ${value.value
      .map((v) => `'${v}'`)
      .join(', ')}`;
  }

  return `${field.value} ${
    operatorMapping[operator.value as keyof typeof operatorMapping]
  } ${
    ['INTEGER', 'DOUBLE', 'FLOAT'].includes(field.fieldType)
      ? value.value
      : `'${value.value}'`
  }`;
}
