import { useCallback, useMemo, useState } from 'react';
import { SchemaField } from '../../schema';
import { Item, JoinOperator, GroupMenu, FieldOption } from './shared';
import { schemaToFieldOptions } from './utils/filterObjectToString';
import { createContext } from './utils/react-helpers';

interface QueryBuilderContextValues {
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
  joinOperator: JoinOperator;
  setJoinOperator: (operator: JoinOperator) => void;
  groupFieldOptions: GroupMenu<FieldOption>[];
}

const [Provider, useQueryBuilderContext] =
  createContext<QueryBuilderContextValues>();

export const QueryBuilderContextProvider: React.FC<{ schema: SchemaField[] }> =
  ({ children, schema }) => {
    const [items, setItems] = useState<Item[]>([]);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [hoverIndexes, setHoverIndexes] = useState<number[]>([]);
    const [joinOperator, setJoinOperator] = useState<JoinOperator>('AND');

    const groupFieldOptions: GroupMenu<FieldOption>[] = useMemo(() => {
      return [
        {
          title: 'Params',
          items: [
            { text: 'q', value: 'q', isArray: false, type: 'STRING' },
            { text: 'page', value: 'page', isArray: false, type: 'INTEGER' },
          ],
        },
        {
          title: 'Fields',
          items: schemaToFieldOptions(schema),
        },
      ];
    }, [schema]);

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
        return prev.map((eItem, eIndex) =>
          eIndex === index ? newItem : eItem,
        );
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
          joinOperator,
          setJoinOperator,
          groupFieldOptions,
        }}
      >
        {children}
      </Provider>
    );
  };

export { useQueryBuilderContext };
