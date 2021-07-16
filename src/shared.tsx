import React from 'react';
import { css as emoCSS } from '@emotion/css';
import styled from '@emotion/styled';
import starWarsNames from 'starwars-names';
import { matchSorter } from 'match-sorter';

const allItems = starWarsNames.all.map((s) => ({
  name: s,
  id: s.toLowerCase(),
}));

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

function XIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      preserveAspectRatio="none"
      width={12}
      fill="transparent"
      stroke="#979797"
      strokeWidth="1.1px"
    >
      <path d="M1,1 L19,19" />
      <path d="M19,1 L1,19" />
    </svg>
  );
}

// @ts-ignore
function getItems(filter) {
  return filter
    ? matchSorter(allItems, filter, {
        keys: ['name'],
      })
    : allItems;
}

function getStringItems(filter) {
  return getItems(filter).map(({ name }) => name);
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function getItemsAsync(filter, { reject }) {
  await sleep(Math.random() * 2000);
  if (reject) {
    // this is just so we can have examples that show what happens
    // when there's a request failure.
    // @ts-ignore
    throw new Error({ error: 'request rejected' });
  }
  return getItems(filter);
}

const itemToString = (i) => (i ? i.name : '');

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
  { type: 'field', value: 'image', fieldType: 'STRING' },
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

const selectedItemIconStyles = {
  cursor: 'pointer',
  marginLeft: '10px',
  display: 'inline-flex',
};

const comboboxStyles = { display: 'inline-block', marginLeft: '5px' };

export {
  items,
  menuStyles,
  comboboxStyles,
  selectedItemIconStyles,
  Menu,
  XIcon,
  Label,
  css,
  itemToString,
  getItems,
  getStringItems,
  getItemsAsync,
};
