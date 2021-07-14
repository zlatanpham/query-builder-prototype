import { useState } from 'react';
import { render } from 'react-dom';
import { useCombobox, useMultipleSelection } from 'downshift';
import { items, selectedItemStyles, selectedItemIconStyles } from './shared';
import { Container, Wrapper, InputContainer, Dropdown, Input } from './styled';

function DropdownMultipleCombobox() {
  const [inputValue, setInputValue] = useState('');
  const {
    getSelectedItemProps,
    getDropdownProps,
    addSelectedItem,
    removeSelectedItem,
    selectedItems,
  } = useMultipleSelection({
    initialSelectedItems: [items[0], items[1], items[2]],
  });
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
  return (
    <Container>
      <Wrapper>
        {selectedItems.map((selectedItem, index) => (
          <span
            style={selectedItemStyles}
            key={`selected-item-${index}`}
            {...getSelectedItemProps({ selectedItem, index })}
          >
            {selectedItem}
            <span
              style={selectedItemIconStyles}
              onClick={() => removeSelectedItem(selectedItem)}
            >
              &#10005;
            </span>
          </span>
        ))}
        <InputContainer {...getComboboxProps()}>
          <Input
            {...getInputProps(getDropdownProps({ preventKeyAction: isOpen }))}
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
