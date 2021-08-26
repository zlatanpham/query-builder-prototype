import { flattenSuggestions, getFilteredSuggestions } from './filter';
import { groupOperatorOptions, booleanOptions, Item } from '../shared';
import { groupFieldOptions } from './__stubs__';

test.each([
  [
    groupFieldOptions,
    [
      { text: 'q', value: 'q', isArray: false, type: 'STRING' },
      { text: 'page', value: 'page', isArray: false, type: 'INTEGER' },
      { text: 'image', value: 'image', isArray: false, type: 'STRING' },
      { text: 'category', value: 'category', isArray: false, type: 'STRING' },
      { text: 'brand', value: 'brand', isArray: true, type: 'STRING' },
      { text: 'price', value: 'price', isArray: false, type: 'FLOAT' },
      { text: 'onSale', value: 'onSale', isArray: false, type: 'BOOLEAN' },
      {
        text: 'createdAt',
        value: 'createdAt',
        isArray: false,
        type: 'TIMESTAMP',
      },
    ],
  ],
  [booleanOptions, booleanOptions],
])('flattenSuggestions(%o)', (options, expected) => {
  expect(flattenSuggestions(options)).toStrictEqual(expected);
});

const fieldStringActiveItem: Item = {
  type: 'field',
  value: 'category',
  fieldType: 'STRING',
  isArray: false,
};

const fieldNumberActiveItem: Item = {
  type: 'field',
  value: 'price',
  isArray: false,
  fieldType: 'FLOAT',
};

const fieldBooleanActiveItem: Item = {
  type: 'field',
  value: 'onSale',
  isArray: false,
  fieldType: 'BOOLEAN',
};

const operatorActiveItem: Item = {
  type: 'operator',
  value: '=',
  field: 'onSale',
  fieldType: 'BOOLEAN',
  isArray: false,
};

const valueActiveItem: Item = {
  type: 'value',
  value: ['1', '2', '3'],
  component: 'tags',
  field: 'category',
  fieldType: 'STRING',
  isArray: false,
};

test.each<[any[], string, Item | undefined, any[]]>([
  // type = 'field'
  [
    groupOperatorOptions,
    '',
    fieldStringActiveItem,
    [
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
            types: ['STRING', 'FLOAT', 'INTEGER', 'DOUBLE'],
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
            types: ['STRING', 'FLOAT', 'INTEGER', 'DOUBLE'],
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
    ],
  ],
  [
    groupOperatorOptions,
    'CONTAIN',
    fieldStringActiveItem,
    [
      {
        title: 'Basic',
        items: [
          {
            value: '~',
            text: 'contains',
            types: ['STRING', 'FLOAT', 'INTEGER', 'DOUBLE'],
            supportIsArray: true,
          },
          {
            value: '!~',
            text: 'does not contain',
            types: ['STRING', 'FLOAT', 'INTEGER', 'DOUBLE'],
            supportIsArray: true,
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
        ],
      },
    ],
  ],
  [
    groupOperatorOptions,
    'is',
    fieldStringActiveItem,
    [
      {
        title: 'Basic',
        items: [
          {
            value: '=',
            text: 'is',
            types: ['STRING', 'BOOLEAN', 'FLOAT', 'INTEGER', 'DOUBLE'],
          },
          {
            value: '!=',
            text: 'is not',
            types: ['STRING', 'BOOLEAN', 'FLOAT', 'INTEGER', 'DOUBLE'],
          },
        ],
      },
      {
        title: 'Advanced',
        items: [
          {
            value: '!=',
            text: 'missing all of',
            types: ['STRING'],
            isAdvanced: true,
            advancedJoinOperator: 'AND',
          },
        ],
      },
    ],
  ],
  [
    groupOperatorOptions,
    '',
    fieldNumberActiveItem,
    [
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
            types: ['STRING', 'FLOAT', 'INTEGER', 'DOUBLE'],
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
            types: ['STRING', 'FLOAT', 'INTEGER', 'DOUBLE'],
            supportIsArray: true,
          },
          {
            value: '>',
            text: 'greater than',
            types: ['FLOAT', 'INTEGER', 'DOUBLE', 'TIMESTAMP'],
          },
          {
            value: '>=',
            text: 'greater than and equal',
            types: ['FLOAT', 'INTEGER', 'DOUBLE', 'TIMESTAMP'],
          },
          {
            value: '<',
            text: 'less than',
            types: ['FLOAT', 'INTEGER', 'DOUBLE', 'TIMESTAMP'],
          },
          {
            value: '<=',
            text: 'less than and equal',
            types: ['FLOAT', 'INTEGER', 'DOUBLE', 'TIMESTAMP'],
          },
        ],
      },
    ],
  ],
  [
    groupOperatorOptions,
    '!',
    fieldNumberActiveItem,
    [
      {
        title: 'Basic',
        items: [
          {
            value: '!=',
            text: 'is not',
            types: ['STRING', 'BOOLEAN', 'FLOAT', 'INTEGER', 'DOUBLE'],
          },
          {
            value: '!~',
            text: 'does not contain',
            types: ['STRING', 'FLOAT', 'INTEGER', 'DOUBLE'],
            supportIsArray: true,
          },
        ],
      },
    ],
  ],
  [
    groupOperatorOptions,
    '',
    fieldBooleanActiveItem,
    [
      {
        title: 'Basic',
        items: [
          {
            value: '=',
            text: 'is',
            types: ['STRING', 'BOOLEAN', 'FLOAT', 'INTEGER', 'DOUBLE'],
          },
          {
            value: '!=',
            text: 'is not',
            types: ['STRING', 'BOOLEAN', 'FLOAT', 'INTEGER', 'DOUBLE'],
          },
        ],
      },
    ],
  ],
  [groupOperatorOptions, 'no results', fieldStringActiveItem, []],
  // operator type
  [booleanOptions, '', operatorActiveItem, booleanOptions],
  [booleanOptions, 'tr', operatorActiveItem, [{ text: 'TRUE', value: 'TRUE' }]],
  [booleanOptions, 'x', operatorActiveItem, []],
  // value type or null
  [
    groupFieldOptions,
    '',
    valueActiveItem,
    [
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
          {
            text: 'category',
            value: 'category',
            isArray: false,
            type: 'STRING',
          },
          { text: 'brand', value: 'brand', isArray: true, type: 'STRING' },
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
    ],
  ],
  [
    groupFieldOptions,
    'c',
    valueActiveItem,
    [
      {
        title: 'Fields',
        items: [
          {
            text: 'category',
            value: 'category',
            isArray: false,
            type: 'STRING',
          },
          { text: 'price', value: 'price', isArray: false, type: 'FLOAT' },
          {
            text: 'createdAt',
            value: 'createdAt',
            isArray: false,
            type: 'TIMESTAMP',
          },
        ],
      },
    ],
  ],
  [groupFieldOptions, 'z', valueActiveItem, []],
  [
    groupFieldOptions,
    'IMAGE',
    undefined,
    [
      {
        title: 'Fields',
        items: [
          { text: 'image', value: 'image', isArray: false, type: 'STRING' },
        ],
      },
    ],
  ],
])(
  'getFilteredSuggestions(%o, %s, $o)',
  (options, inputValue, activeItem, expected) => {
    expect(
      getFilteredSuggestions(options, inputValue, activeItem),
    ).toStrictEqual(expected);
  },
);
