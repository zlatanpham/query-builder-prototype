import { useState } from 'react';
import { Item, defaultItems } from './shared';
import { createContext } from './utils/react-helpers';

interface ContextValues {
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
}

const [Provider, useContextProvider] = createContext<ContextValues>();

export const ContextProvider: React.FC<any> = ({ children }) => {
  const [items, setItems] = useState([...defaultItems]);

  return <Provider value={{ items, setItems }}>{children}</Provider>;
};

export { useContextProvider };
