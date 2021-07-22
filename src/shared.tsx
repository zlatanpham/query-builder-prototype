type FieldType = 'INTEGER' | 'BOOLEAN' | 'STRING' | 'FLOAT';
export interface FieldOption {
  text: string;
  value: string;
  type: FieldType;
  isArray: boolean;
}

export const fieldOptions: FieldOption[] = [
  { text: 'image', value: 'image', isArray: false, type: 'STRING' },
  { text: 'category', value: 'category', isArray: false, type: 'STRING' },
  { text: 'price', value: 'price', isArray: false, type: 'FLOAT' },
  { text: 'onSale', value: 'onSale', isArray: false, type: 'BOOLEAN' },
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

export const operatorOptions: OperatorOption[] = [
  { value: '=', text: 'is', types: ['STRING', 'BOOLEAN', 'FLOAT', 'INTEGER'] },
  {
    value: '~',
    text: 'contains',
    types: ['STRING'],
  },
  {
    value: '!=',
    text: 'is not',
    types: ['STRING', 'BOOLEAN', 'FLOAT', 'INTEGER'],
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
    types: ['FLOAT', 'INTEGER'],
  },
  {
    value: '<',
    text: 'less than',
    types: ['FLOAT', 'INTEGER'],
  },
];

export const booleanOptions = [
  { text: 'TRUE', value: 'TRUE' },
  { text: 'FALSE', value: 'FALSE' },
];

export interface OperatorOption {
  text: string;
  value: keyof typeof operatorMapping;
  types: FieldType[];
}

export interface ValueOption {
  text: string;
  value: string;
}

interface Field {
  type: 'field';
  value: string;
  fieldType: FieldOption['type'];
}
interface Operator {
  type: 'operator';
  value: string;
  field: string;
  fieldType: FieldOption['type'];
}

interface Value {
  type: 'value';
  value: string;
  component: 'text' | 'boolean';
  field: string;
  fieldType: FieldOption['type'];
}

export type Item = Field | Operator | Value;

const items: Item[] = [
  { type: 'field', value: 'category', fieldType: 'STRING' },
  { type: 'operator', value: '=', fieldType: 'STRING', field: 'category' },
  {
    type: 'value',
    value: 'television',
    component: 'text',
    fieldType: 'STRING',
    field: 'category',
  },
];

export { items };
