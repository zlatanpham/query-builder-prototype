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

const ControllerButton = styled('button')({
  backgroundColor: 'transparent',
  border: 'none',
  position: 'absolute',
  right: 0,
  top: 0,
  cursor: 'pointer',
  width: 47,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
});

// @ts-ignore
function ArrowIcon({ isOpen }) {
  return (
    <svg
      viewBox="0 0 20 20"
      preserveAspectRatio="none"
      width={16}
      fill="transparent"
      stroke="#979797"
      strokeWidth="1.1px"
      transform={isOpen ? 'rotate(180)' : undefined}
    >
      <path d="M1,6 L10,15 L19,6" />
    </svg>
  );
}

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

interface FieldOption {
  text: string;
  type: 'INTEGER' | 'BOOLEAN' | 'STRING';
  value: string;
  isArray: boolean;
}

const fieldOptions: FieldOption[] = [
  { text: 'Image', isArray: false, type: 'STRING', value: 'image' },
  { text: 'Category', isArray: false, type: 'STRING', value: 'category' },
  { text: 'onSale', isArray: false, type: 'BOOLEAN', value: 'onSlae' },
];

interface Operation {
  text: string;
  value: string;
}

const operationOptions: Operation[] = [
  { text: 'equal', value: '=' },
  { text: 'consist', value: '~' },
];

type Item =
  | {
      type: 'field';
      value: string;
      options: FieldOption[];
    }
  | {
      type: 'operation';
      value: string;
      options: Operation[];
    }
  | {
      type: 'value';
      value: string;
      options?: string[];
      component: 'text' | 'select';
    };

const items: Item[] = [
  { type: 'field', value: '', options: fieldOptions },
  { type: 'operation', value: 'equal', options: operationOptions },
  { type: 'value', value: '', component: 'text' },
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

const selectedItemStyles = {
  marginLeft: '5px',
  backgroundColor: 'aliceblue',
  borderRadius: '10px',
};

const selectedItemIconStyles = { cursor: 'pointer' };

const comboboxStyles = { display: 'inline-block', marginLeft: '5px' };

export {
  items,
  menuStyles,
  comboboxStyles,
  selectedItemIconStyles,
  selectedItemStyles,
  Menu,
  ControllerButton,
  ArrowIcon,
  XIcon,
  Label,
  css,
  itemToString,
  getItems,
  getStringItems,
  getItemsAsync,
};
