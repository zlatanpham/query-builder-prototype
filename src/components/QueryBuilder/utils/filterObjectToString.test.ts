import { JoinOperator } from '../ContextProvider';
import { Item } from '../shared';
import { filterObjectToString } from './filterObjectToString';

test.each<[Item[], JoinOperator, string]>([
  [[], 'OR', ''],
  [[], 'AND', ''],
  [
    [
      { type: 'field', value: 'category', fieldType: 'STRING', isArray: false },
      {
        type: 'operator',
        value: '=',
        fieldType: 'STRING',
        field: 'category',
        isArray: false,
      },
      {
        type: 'value',
        value: 'application',
        component: 'text',
        fieldType: 'STRING',
        field: 'category',
        isArray: false,
      },
    ],
    'AND',
    `category = 'application'`,
  ],
  [
    [
      {
        type: 'field',
        value: 'page',
        isArray: false,
        fieldType: 'INTEGER',
      },
      {
        type: 'operator',
        value: '>',
        field: 'page',
        fieldType: 'INTEGER',
        isArray: false,
      },
      {
        type: 'value',
        value: '2.3',
        component: 'text',
        isArray: false,
        field: 'page',
        fieldType: 'INTEGER',
      },
    ],
    'AND',
    'page > 2.3',
  ],
  [
    [
      {
        type: 'field',
        value: 'price',
        isArray: false,
        fieldType: 'FLOAT',
      },
      {
        type: 'operator',
        value: '!=',
        field: 'price',
        fieldType: 'FLOAT',
        isArray: false,
      },
    ],
    'AND',
    'price !=',
  ],
  [
    [
      {
        type: 'field',
        value: 'price',
        isArray: false,
        fieldType: 'FLOAT',
      },
    ],
    'AND',
    'price',
  ],
  [
    [
      {
        type: 'field',
        value: 'brand',
        fieldType: 'STRING',
        isArray: true,
      },
      {
        type: 'operator',
        value: '~',
        field: 'brand',
        fieldType: 'STRING',
        isArray: true,
      },
      {
        type: 'value',
        value: 'samsung',
        field: 'brand',
        fieldType: 'STRING',
        component: 'text',
        isArray: true,
      },
      {
        type: 'field',
        value: 'brand',
        fieldType: 'STRING',
        isArray: true,
      },
      {
        type: 'operator',
        value: '!~',
        field: 'brand',
        fieldType: 'STRING',
        isArray: true,
      },
      {
        type: 'value',
        value: 'mobile',
        field: 'brand',
        fieldType: 'STRING',
        component: 'text',
        isArray: true,
      },
    ],
    'OR',
    `brand ~ ['samsung'] OR brand !~ ['mobile']`,
  ],
  [
    [
      {
        type: 'field',
        value: 'q',
        isArray: false,
        fieldType: 'STRING',
      },
      {
        type: 'operator',
        value: '$',
        field: 'q',
        fieldType: 'STRING',
        isArray: false,
      },
      {
        type: 'value',
        value: 'apple',
        component: 'text',
        isArray: false,
        field: 'q',
        fieldType: 'STRING',
      },
      {
        type: 'field',
        value: 'onSale',
        isArray: false,
        fieldType: 'BOOLEAN',
      },
      {
        type: 'operator',
        value: '=',
        field: 'onSale',
        fieldType: 'BOOLEAN',
        isArray: false,
      },
      {
        type: 'value',
        value: 'TRUE',
        component: 'boolean',
        isArray: false,
        field: 'onSale',
        fieldType: 'BOOLEAN',
      },
      {
        type: 'field',
        value: 'category',
        isArray: false,
        fieldType: 'STRING',
      },
      {
        type: 'operator',
        value: '~',
        field: 'category',
        fieldType: 'STRING',
        isAdvanced: true,
        advancedJoinOperator: 'OR',
        isArray: false,
      },
      {
        type: 'value',
        value: ['1', '2', '3'],
        component: 'tags',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
      },
    ],
    'AND',
    `q $ 'apple' AND onSale = 'TRUE' AND (category ~ '1' OR category ~ '2' OR category ~ '3')`,
  ],
])('filterObjectToString(%o, %s)', (items, joinOperator, expected) => {
  expect(filterObjectToString(items, joinOperator)).toBe(expected);
});
