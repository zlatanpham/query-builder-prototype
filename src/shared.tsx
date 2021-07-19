import React from 'react';
import { css as emoCSS } from '@emotion/css';
import styled from '@emotion/styled';

// @ts-ignore
const css = (...args) => ({ className: emoCSS(...args) });

const Label = styled('label')({
  fontWeight: 'bold',
  display: 'block',
  marginBottom: 10,
});

const BaseMenu = styled.ul``;

const Menu = React.forwardRef((props, ref) => {
  // @ts-ignore
  return <BaseMenu ref={ref} {...props} />;
});

export interface FieldOption {
  text: string;
  type: 'INTEGER' | 'BOOLEAN' | 'STRING';
  value: string;
  isArray: boolean;
}

export const fieldOptions: FieldOption[] = [
  { text: 'image', isArray: false, type: 'STRING', value: 'image' },
  { text: 'category', isArray: false, type: 'STRING', value: 'category' },
  { text: 'onSale', isArray: false, type: 'BOOLEAN', value: 'onSale' },
];

export const operationMapping = {
  '=': 'is',
  '~': 'contains',
  '!=': 'is not',
  '!~': 'does not contain',
  $: 'ends with',
  '^': 'begins with',
};

export const operationOptions: Operation[] = [
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

export interface Operation {
  text: string;
  value: keyof typeof operationMapping;
}

export interface ValueOption {
  text: string;
  value: string;
}

export type Item =
  | {
      type: 'field';
      value: string;
      fieldType: FieldOption['type'];
    }
  | {
      type: 'operation';
      value: string;
    }
  | {
      type: 'value';
      value: string;
      options?: ValueOption[];
      component: 'text' | 'boolean';
    };

const items: Item[] = [
  { type: 'field', value: 'category', fieldType: 'STRING' },
  { type: 'operation', value: '=' },
  { type: 'value', value: 'television', component: 'text' },
];

const menuStyles = {
  maxHeight: 80,
  maxWidth: 300,
  overflowY: 'scroll',
  backgroundColor: '#eee',
  padding: 0,
  listStyle: 'none',
  position: 'relative',
};

const comboboxStyles = { display: 'inline-block', marginLeft: '5px' };

export { items, menuStyles, comboboxStyles, Menu, Label, css };
