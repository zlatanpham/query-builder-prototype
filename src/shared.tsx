export interface FieldOption {
  text: string;
  value: string;
  type: 'INTEGER' | 'BOOLEAN' | 'STRING' | 'FLOAT';
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
  { value: '=', text: 'is' },
  { value: '~', text: 'contains' },
  { value: '!=', text: 'is not' },
  { value: '!~', text: 'does not contain' },
  { value: '$', text: 'ends with' },
  { value: '^', text: 'begins with' },
];

export const booleanOptions = [
  { text: 'TRUE', value: 'TRUE' },
  { text: 'FALSE', value: 'FALSE' },
];

export interface OperatorOption {
  text: string;
  value: keyof typeof operatorMapping;
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
}

interface Value {
  type: 'value';
  value: string;
  component: 'text' | 'boolean';
}

export type Item = Field | Operator | Value;

const items: Item[] = [
  { type: 'field', value: 'category', fieldType: 'STRING' },
  { type: 'operator', value: '=' },
  { type: 'value', value: 'television', component: 'text' },
];

export { items };
