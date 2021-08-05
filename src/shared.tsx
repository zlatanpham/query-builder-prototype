export type FieldType =
  | 'INTEGER'
  | 'BOOLEAN'
  | 'STRING'
  | 'FLOAT'
  | 'DOUBLE'
  | 'TIMESTAMP';
export interface FieldOption {
  text: string;
  value: string;
  type: FieldType;
  isArray: boolean;
}

export interface GroupMenu<T> {
  title: string;
  items: T[];
}

export const groupFieldOptions: GroupMenu<FieldOption>[] = [
  {
    title: 'Params',
    items: [
      { text: 'q', value: 'q', isArray: false, type: 'STRING' },
      { text: 'page', value: 'page', isArray: false, type: 'INTEGER' },
    ],
  },
  {
    title: 'Fields',
    items: [
      { text: 'image', value: 'image', isArray: false, type: 'STRING' },
      { text: 'category', value: 'category', isArray: false, type: 'STRING' },
      { text: 'price', value: 'price', isArray: false, type: 'FLOAT' },
      { text: 'onSale', value: 'onSale', isArray: false, type: 'BOOLEAN' },
      {
        text: 'createdAt',
        value: 'createdAt',
        isArray: false,
        type: 'TIMESTAMP',
      },
    ],
  },
];

export const operatorMapping = {
  '=': 'is',
  '~': 'contains',
  '!=': 'is not',
  '!~': 'does not contain',
  $: 'ends with',
  '^': 'begins with',
  '>': 'greater than',
  '<': 'less than',
};

export const advancedOperatorMapping = {
  '~AND': 'contains all of',
  '~OR': 'contains any of',
  '!~OR': 'contains none of',
  '=OR': 'equals any of',
  '!=AND': 'missing all of',
};

export const groupOperatorOptions: GroupMenu<OperatorOption>[] = [
  {
    title: 'Basic',
    items: [
      {
        value: '=',
        text: 'is',
        types: ['STRING', 'BOOLEAN', 'FLOAT', 'INTEGER', 'TIMESTAMP'],
      },
      {
        value: '~',
        text: 'contains',
        types: ['STRING'],
      },
      {
        value: '!=',
        text: 'is not',
        types: ['STRING', 'BOOLEAN', 'FLOAT', 'INTEGER', 'TIMESTAMP'],
      },
      {
        value: '!~',
        text: 'does not contain',
        types: ['STRING'],
      },
      {
        value: '$',
        text: 'ends with',
        types: ['STRING'],
      },
      {
        value: '^',
        text: 'begins with',
        types: ['STRING'],
      },
      {
        value: '>',
        text: 'greater than',
        types: ['FLOAT', 'INTEGER', 'TIMESTAMP'],
      },
      {
        value: '<',
        text: 'less than',
        types: ['FLOAT', 'INTEGER', 'TIMESTAMP'],
      },
    ],
  },
  {
    title: 'Advanced',
    items: [
      {
        value: '~',
        text: 'contains all',
        types: ['STRING'],
        isAdvanced: true,
        advancedJoinOperator: 'AND',
      },
      {
        value: '~',
        text: 'contains any',
        types: ['STRING'],
        isAdvanced: true,
        advancedJoinOperator: 'OR',
      },
      {
        value: '!~',
        text: 'contains none of',
        types: ['STRING'],
        isAdvanced: true,
        advancedJoinOperator: 'OR',
      },
      {
        value: '=',
        text: 'equals any',
        types: ['STRING'],
        isAdvanced: true,
        advancedJoinOperator: 'OR',
      },
      {
        value: '!=',
        text: 'missing all of',
        types: ['STRING'],
        isAdvanced: true,
        advancedJoinOperator: 'AND',
      },
    ],
  },
];

export interface OperatorOption {
  text: string;
  value: keyof typeof operatorMapping;
  types: FieldType[];
  isAdvanced?: boolean;
  advancedJoinOperator?: 'AND' | 'OR';
}

export interface Option {
  text: string;
  value: string;
}

export type Suggestion = Option | OperatorOption | FieldOption;

export const booleanOptions = [
  { text: 'TRUE', value: 'TRUE' },
  { text: 'FALSE', value: 'FALSE' },
];

export interface Field {
  type: 'field';
  value: string;
  fieldType: FieldOption['type'];
}

export interface Operator {
  type: 'operator';
  value: string;
  field: string;
  fieldType: FieldOption['type'];
  isAdvanced?: boolean;
  advancedJoinOperator?: 'OR' | 'AND';
}

export type Value =
  | {
      type: 'value';
      value: string;
      component: 'text' | 'boolean' | 'tags';
      field: string;
      fieldType: FieldOption['type'];
    }
  | {
      type: 'value';
      value: string[];
      component: 'tags';
      field: string;
      fieldType: FieldOption['type'];
    };

export type Item = Field | Operator | Value;

export const defaultItems: Item[] = [
  { type: 'field', value: 'category', fieldType: 'STRING' },
  { type: 'operator', value: '=', fieldType: 'STRING', field: 'category' },
  {
    type: 'value',
    value: 'application',
    component: 'text',
    fieldType: 'STRING',
    field: 'category',
  },
];
