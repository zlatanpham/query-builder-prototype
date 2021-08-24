import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SchemaField } from '../../schema';
import { Item, JoinOperator, GroupMenu, FieldOption } from './shared';
import {
  filterObjectToString,
  schemaToFieldOptions,
} from './utils/filterObjectToString';
import { stringParser } from './utils/parser';
import { createContext } from './utils/react-helpers';

type EditorMode = 'visual' | 'text';

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
  onChange: (value: string) => void;
  value: string;
  mode?: EditorMode;
  setMode: (mode: EditorMode) => void;
  transformError?: string;
}

const [Provider, useQueryBuilderContext] =
  createContext<QueryBuilderContextValues>();

export const QueryBuilderContextProvider: React.FC<{
  schema: SchemaField[];
  value: string;
  onChange: (value: string) => void;
  condensed?: boolean;
}> = ({ children, onChange, value, schema, condensed }) => {
  const [internalValue, setInternalValueState] = useState(value);
  const prevValue = useRef(value);
  const setInternalValue = useCallback((value: string) => {
    setInternalValueState(value);
    prevValue.current = value;
  }, []);

  const groupFieldOptions: GroupMenu<FieldOption>[] = useMemo(() => {
    return [
      {
        title: 'Params',
        items: [
          { text: 'Search Query', value: 'q', isArray: false, type: 'STRING' },
          { text: 'page', value: 'page', isArray: false, type: 'INTEGER' },
        ],
      },
      {
        title: 'Fields',
        items: schemaToFieldOptions(schema),
      },
    ];
  }, [schema]);

  const {
    joinOperator: defaultJoinOperator,
    expressions: defaultItems,
  }: ReturnType<typeof stringParser> = useMemo(() => {
    try {
      return stringParser(internalValue, groupFieldOptions);
    } catch (e) {
      return { joinOperator: 'AND', expressions: [] };
    }
    // only need to calculate one
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupFieldOptions]);

  const isDefaultVisualMode =
    internalValue === '' || (internalValue !== '' && defaultItems.length > 0);

  const [mode, setMode] = useState<'visual' | 'text'>(
    isDefaultVisualMode ? 'visual' : 'text',
  );

  const [items, setItems] = useState<Item[]>(defaultItems);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [hoverIndexes, setHoverIndexes] = useState<number[]>([]);
  const [joinOperator, setJoinOperator] =
    useState<JoinOperator>(defaultJoinOperator);
  const [transformError, setTransformError] = useState('');

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

  useEffect(() => {
    if (!condensed) {
      onChange(internalValue);
    }
  }, [internalValue, onChange, condensed]);

  useEffect(() => {
    if (value !== prevValue.current) {
      const { joinOperator, expressions } = (() => {
        try {
          return stringParser(value, groupFieldOptions);
        } catch (e) {
          return { joinOperator: 'AND', expressions: [] };
        }
      })();
      setJoinOperator(joinOperator as JoinOperator);
      setItems(expressions);
      setInternalValue(value);
      if (value !== '' && expressions.length === 0) {
        setMode('text');
      }
    }
  }, [value, setInternalValue, groupFieldOptions]);

  useEffect(() => {
    if (mode === 'visual') {
      setInternalValue(filterObjectToString(items, joinOperator));
    }
  }, [items, joinOperator, mode, setInternalValue]);

  useEffect(() => {
    if (mode === 'text') {
      try {
        const { joinOperator, expressions } = stringParser(
          internalValue,
          groupFieldOptions,
        );
        setItems(expressions);
        setJoinOperator(joinOperator);
        setTransformError('');
      } catch (error) {
        setTransformError(error.message);
      }
    }
  }, [internalValue, mode, setItems, setJoinOperator, groupFieldOptions]);

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
        value: internalValue,
        onChange: setInternalValue,
        mode,
        setMode,
        transformError,
      }}
    >
      {children}
    </Provider>
  );
};

export { useQueryBuilderContext };
