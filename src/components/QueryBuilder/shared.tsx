import { SchemaFieldType } from '../../schema';
export type JoinOperator = 'OR' | 'AND';

export interface FieldOption {
  text: string;
  value: string;
  type: SchemaFieldType;
  isArray: boolean;
}

export interface GroupMenu<T> {
  title: string;
  items: T[];
}

export interface OperatorOption {
  text: string;
  value: keyof typeof operatorMapping;
  types: SchemaFieldType[];
  isAdvanced?: boolean;
  supportIsArray?: boolean;
  advancedJoinOperator?: 'AND' | 'OR';
}

export interface Option {
  text: string;
  value: string;
}

export type Suggestion = Option | OperatorOption | FieldOption;

export interface Field {
  type: 'field';
  value: string;
  fieldType: FieldOption['type'];
  isArray: boolean;
}

export interface Operator {
  type: 'operator';
  value: string;
  field: string;
  fieldType: FieldOption['type'];
  isAdvanced?: boolean;
  advancedJoinOperator?: 'OR' | 'AND';
  isArray: boolean;
}

export type Value =
  | {
      type: 'value';
      value: string | number;
      component: 'text' | 'boolean' | 'tags';
      field: string;
      fieldType: FieldOption['type'];
      isArray: boolean;
    }
  | {
      type: 'value';
      value: string[];
      component: 'tags';
      field: string;
      fieldType: FieldOption['type'];
      isArray: boolean;
    };

export type Item = Field | Operator | Value;

export const numberTypes: SchemaFieldType[] = ['INTEGER', 'FLOAT', 'DOUBLE'];

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
        types: ['STRING', 'BOOLEAN', 'FLOAT', 'INTEGER', 'DOUBLE'],
      },
      {
        value: '~',
        text: 'contains',
        types: ['STRING'],
        supportIsArray: true,
      },
      {
        value: '!=',
        text: 'is not',
        types: ['STRING', 'BOOLEAN', 'FLOAT', 'INTEGER', 'DOUBLE'],
      },
      {
        value: '!~',
        text: 'does not contain',
        types: ['STRING'],
        supportIsArray: true,
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
        types: ['FLOAT', 'INTEGER', 'DOUBLE', 'TIMESTAMP'],
      },
      {
        value: '<',
        text: 'less than',
        types: ['FLOAT', 'INTEGER', 'DOUBLE', 'TIMESTAMP'],
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

export const booleanOptions = [
  { text: 'TRUE', value: 'TRUE' },
  { text: 'FALSE', value: 'FALSE' },
];
