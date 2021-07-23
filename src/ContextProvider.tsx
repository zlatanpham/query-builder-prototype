import { useCallback, useState } from 'react';
import { Item, defaultItems } from './shared';
import { createContext } from './utils/react-helpers';

interface ContextValues {
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  removeBlock: (index: number) => void;
  removeLast: () => void;
  addItem: (item: Item) => void;
  replaceItem: (index: number, newItem: Item) => void;
  hoverIndexes: number[];
  setHoverIndexes: React.Dispatch<React.SetStateAction<number[]>>;
  selectedItem: Item | null;
  setSelectedItem: (item: Item | null) => void;
}

const [Provider, useContextProvider] = createContext<ContextValues>();

export const ContextProvider: React.FC<any> = ({ children }) => {
  const [items, setItems] = useState([...defaultItems]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [hoverIndexes, setHoverIndexes] = useState<number[]>([]);

  const removeBlock = useCallback((index: number) => {
    setItems((prev) => {
      if (prev[index].type !== 'value') {
        return prev;
      }
      return prev.filter((_, i) => {
        return i !== index - 2 && i !== index - 1 && i !== index;
      });
    });
  }, []);

  const removeLast = useCallback(() => {
    setItems((prev) => {
      const len = prev.length;
      if (len === 0) {
        return prev;
      }
      return prev.filter((_, i) => {
        return i !== len - 1;
      });
    });
  }, []);

  const addItem = useCallback((item: Item) => {
    setItems((prev) => {
      return [...prev, item];
    });
  }, []);

  const replaceItem = useCallback((index: number, newItem: Item) => {
    setItems((prev) => {
      return prev.map((eItem, eIndex) => (eIndex === index ? newItem : eItem));
    });
  }, []);

  return (
    <Provider
      value={{
        items,
        setItems,
        removeBlock,
        removeLast,
        addItem,
        replaceItem,
        hoverIndexes,
        setHoverIndexes,
        selectedItem,
        setSelectedItem,
      }}
    >
      {children}
    </Provider>
  );
};

export { useContextProvider };
