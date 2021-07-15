import { useEffect, useMemo, useRef, useState } from 'react';
import { render } from 'react-dom';
import { useCombobox, useMultipleSelection } from 'downshift';
import {
  items,
  selectedItemStyles,
  selectedItemIconStyles,
  Item,
} from './shared';
import { Container, Wrapper, InputContainer, Dropdown, Input } from './styled';

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
  const selectRef = useRef<HTMLSelectElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (shouldFocus) {
      inputRef.current?.focus();
    }
  }, [shouldFocus]);

  if (item.type === 'field') {
    return (
      <select ref={selectRef} value={item.value}>
        {item.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.text}
          </option>
        ))}
      </select>
    );
  }

  if (item.type === 'operation') {
    return (
      <select ref={selectRef} value={item.value}>
        {item.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.text}
          </option>
        ))}
      </select>
    );
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

    if (item.component === 'select') {
      return (
        <select ref={selectRef} value={item.value}>
          {item.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.text}
            </option>
          ))}
        </select>
      );
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
  const getFilteredItems = (items) =>
    items.filter(
      (item) =>
        selectedItems.indexOf(item) < 0 &&
        item.value.toLowerCase().startsWith(inputValue.toLowerCase()),
    );
  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    selectItem,
  } = useCombobox({
    inputValue,
    items: getFilteredItems(items),
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
            setInputValue('');
            // @ts-ignore
            addSelectedItem(selectedItem);
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
  const lastItem = useMemo(
    () => selectedItems[selectedItems.length - 1],
    [selectedItems.length],
  );

  useEffect(() => {
    setInputValue(lastItem.value.substring(0, lastItem.value.length - 2));
    inputRef.current?.focus();
  }, [lastItem]);

  const changeItem = (index: number) => (item: Item) => {
    setSelectedItems((prev) => {
      return prev.map((eItem, eIndex) => (eIndex === index ? item : eItem));
    });
  };

  return (
    <Container>
      <Wrapper>
        {selectedItems.map((selectedItem, index) => {
          return (
            <div style={selectedItemStyles} key={`selected-item-${index}`}>
              <ItemRender
                item={selectedItem}
                shouldFocus={focusIndex === index}
                onChange={changeItem(index)}
                onRemove={() => {
                  setFocusIndex(index - 1);

                  setSelectedItems((prev) =>
                    prev.filter((_, i) => i !== selectedItems.length - 1),
                  );
                }}
              />
              {selectedItem.type === 'value' && (
                <span
                  style={selectedItemIconStyles}
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
                >
                  &#10005;
                </span>
              )}
            </div>
          );
        })}
        <InputContainer {...getComboboxProps()}>
          <Input
            {...getInputProps({
              ref: inputRef,
              onKeyDown: (e) => {
                if (e.key === 'Backspace' && inputValue === '') {
                  setFocusIndex(items.length - 1);
                  setTimeout(() => {
                    setFocusIndex(-1);
                  }, 500);
                }
              },
            })}
          />
          {isOpen && (
            <Dropdown {...getMenuProps()}>
              {isOpen &&
                getFilteredItems(items).map((item, index) => (
                  <li
                    style={
                      highlightedIndex === index
                        ? { backgroundColor: '#bde4ff' }
                        : {}
                    }
                    key={`${item.value}${index}`}
                    {...getItemProps({ item, index })}
                  >
                    {item.value}
                  </li>
                ))}
            </Dropdown>
          )}
        </InputContainer>
      </Wrapper>
    </Container>
  );
}

render(<DropdownMultipleCombobox />, document.getElementById('root'));
