import { stringParser } from './parser';

test('AND conjunction test', () => {
  expect(
    stringParser("category ~ 'application' AND onSale = 'TRUE'"),
  ).toStrictEqual({
    conjunction: 'AND',
    expressions: [
      { type: 'field', value: 'category', fieldType: 'STRING' },
      {
        type: 'operator',
        value: '~',
        field: 'category',
        fieldType: 'STRING',
      },
      {
        type: 'value',
        value: 'application',
        field: 'category',
        fieldType: 'STRING',
        component: 'text',
      },
      { type: 'field', value: 'onSale', fieldType: 'BOOLEAN' },
      {
        type: 'operator',
        value: '=',
        field: 'onSale',
        fieldType: 'BOOLEAN',
      },
      {
        type: 'value',
        value: 'TRUE',
        field: 'onSale',
        fieldType: 'BOOLEAN',
        component: 'boolean',
      },
    ],
  });
});

test('OR conjunction test', () => {
  expect(
    stringParser("category ~ 'application' OR onSale = 'TRUE'"),
  ).toStrictEqual({
    conjunction: 'OR',
    expressions: [
      { type: 'field', value: 'category', fieldType: 'STRING' },
      {
        type: 'operator',
        value: '~',
        field: 'category',
        fieldType: 'STRING',
      },
      {
        type: 'value',
        value: 'application',
        field: 'category',
        fieldType: 'STRING',
        component: 'text',
      },
      { type: 'field', value: 'onSale', fieldType: 'BOOLEAN' },
      {
        type: 'operator',
        value: '=',
        field: 'onSale',
        fieldType: 'BOOLEAN',
      },
      {
        type: 'value',
        value: 'TRUE',
        field: 'onSale',
        fieldType: 'BOOLEAN',
        component: 'boolean',
      },
    ],
  });
});

test('OR advanced test', () => {
  expect(
    stringParser(
      "category = 'application' AND (image ~ 'a' OR image ~ 'b' OR image ~ 'c')",
    ),
  ).toStrictEqual({
    conjunction: 'AND',
    expressions: [
      { type: 'field', value: 'category', fieldType: 'STRING' },
      {
        type: 'operator',
        value: '=',
        field: 'category',
        fieldType: 'STRING',
      },
      {
        type: 'value',
        value: 'application',
        field: 'category',
        fieldType: 'STRING',
        component: 'text',
      },
      { type: 'field', value: 'image', fieldType: 'STRING' },
      {
        type: 'operator',
        value: '~',
        field: 'image',
        fieldType: 'STRING',
        isAdvanced: true,
        advancedJoinOperator: 'OR',
      },
      {
        type: 'value',
        value: ['a', 'b', 'c'],
        field: 'image',
        fieldType: 'STRING',
        component: 'tags',
      },
    ],
  });
});

test('OR advanced with OR conjunction test', () => {
  expect(
    stringParser(
      "category = 'application' OR (image ~ 'a' OR image ~ 'b' OR image ~ 'c')",
    ),
  ).toStrictEqual({
    conjunction: 'OR',
    expressions: [
      { type: 'field', value: 'category', fieldType: 'STRING' },
      {
        type: 'operator',
        value: '=',
        field: 'category',
        fieldType: 'STRING',
      },
      {
        type: 'value',
        value: 'application',
        field: 'category',
        fieldType: 'STRING',
        component: 'text',
      },
      { type: 'field', value: 'image', fieldType: 'STRING' },
      {
        type: 'operator',
        value: '~',
        field: 'image',
        fieldType: 'STRING',
        isAdvanced: true,
        advancedJoinOperator: 'OR',
      },
      {
        type: 'value',
        value: ['a', 'b', 'c'],
        field: 'image',
        fieldType: 'STRING',
        component: 'tags',
      },
    ],
  });
});

test('AND advanced test', () => {
  expect(
    stringParser(
      "category = 'application' AND (image ~ 'a' AND image ~ 'b' AND image ~ 'c')",
    ),
  ).toStrictEqual({
    conjunction: 'AND',
    expressions: [
      { type: 'field', value: 'category', fieldType: 'STRING' },
      {
        type: 'operator',
        value: '=',
        field: 'category',
        fieldType: 'STRING',
      },
      {
        type: 'value',
        value: 'application',
        field: 'category',
        fieldType: 'STRING',
        component: 'text',
      },
      { type: 'field', value: 'image', fieldType: 'STRING' },
      {
        type: 'operator',
        value: '~',
        field: 'image',
        fieldType: 'STRING',
        isAdvanced: true,
        advancedJoinOperator: 'AND',
      },
      {
        type: 'value',
        value: ['a', 'b', 'c'],
        field: 'image',
        fieldType: 'STRING',
        component: 'tags',
      },
    ],
  });
});

test('AND advanced with OR conjunction test', () => {
  expect(
    stringParser(
      "category = 'application' OR (image ~ 'a' AND image ~ 'b' AND image ~ 'c')",
    ),
  ).toStrictEqual({
    conjunction: 'OR',
    expressions: [
      { type: 'field', value: 'category', fieldType: 'STRING' },
      {
        type: 'operator',
        value: '=',
        field: 'category',
        fieldType: 'STRING',
      },
      {
        type: 'value',
        value: 'application',
        field: 'category',
        fieldType: 'STRING',
        component: 'text',
      },
      { type: 'field', value: 'image', fieldType: 'STRING' },
      {
        type: 'operator',
        value: '~',
        field: 'image',
        fieldType: 'STRING',
        isAdvanced: true,
        advancedJoinOperator: 'AND',
      },
      {
        type: 'value',
        value: ['a', 'b', 'c'],
        field: 'image',
        fieldType: 'STRING',
        component: 'tags',
      },
    ],
  });
});

test('TIMESTAMP test', () => {
  expect(
    stringParser("category = 'application' AND createdAt > '03/08/2021'"),
  ).toStrictEqual({
    conjunction: 'AND',
    expressions: [
      { type: 'field', value: 'category', fieldType: 'STRING' },
      {
        type: 'operator',
        value: '=',
        field: 'category',
        fieldType: 'STRING',
      },
      {
        type: 'value',
        value: 'application',
        field: 'category',
        fieldType: 'STRING',
        component: 'text',
      },
      { type: 'field', value: 'createdAt', fieldType: 'TIMESTAMP' },
      {
        type: 'operator',
        value: '>',
        field: 'createdAt',
        fieldType: 'TIMESTAMP',
      },
      {
        type: 'value',
        value: '03/08/2021',
        field: 'createdAt',
        fieldType: 'TIMESTAMP',
        component: 'text',
      },
    ],
  });
});

test('OR advanced with TIMESTAMP test', () => {
  expect(
    stringParser(
      "category = 'application' AND (image ~ 'a' OR image ~ 'b' OR image ~ 'c') AND createdAt > '03/08/2021'",
    ),
  ).toStrictEqual({
    conjunction: 'AND',
    expressions: [
      { type: 'field', value: 'category', fieldType: 'STRING' },
      {
        type: 'operator',
        value: '=',
        field: 'category',
        fieldType: 'STRING',
      },
      {
        type: 'value',
        value: 'application',
        field: 'category',
        fieldType: 'STRING',
        component: 'text',
      },
      { type: 'field', value: 'image', fieldType: 'STRING' },
      {
        type: 'operator',
        value: '~',
        field: 'image',
        fieldType: 'STRING',
        isAdvanced: true,
        advancedJoinOperator: 'OR',
      },
      {
        type: 'value',
        value: ['a', 'b', 'c'],
        field: 'image',
        fieldType: 'STRING',
        component: 'tags',
      },
      { type: 'field', value: 'createdAt', fieldType: 'TIMESTAMP' },
      {
        type: 'operator',
        value: '>',
        field: 'createdAt',
        fieldType: 'TIMESTAMP',
      },
      {
        type: 'value',
        value: '03/08/2021',
        field: 'createdAt',
        fieldType: 'TIMESTAMP',
        component: 'text',
      },
    ],
  });
});

test('OR advanced with TIMESTAMP and OR conjunction test', () => {
  expect(
    stringParser(
      "category = 'application' OR (image ~ 'a' OR image ~ 'b' OR image ~ 'c') OR createdAt > '03/08/2021'",
    ),
  ).toStrictEqual({
    conjunction: 'OR',
    expressions: [
      { type: 'field', value: 'category', fieldType: 'STRING' },
      {
        type: 'operator',
        value: '=',
        field: 'category',
        fieldType: 'STRING',
      },
      {
        type: 'value',
        value: 'application',
        field: 'category',
        fieldType: 'STRING',
        component: 'text',
      },
      { type: 'field', value: 'image', fieldType: 'STRING' },
      {
        type: 'operator',
        value: '~',
        field: 'image',
        fieldType: 'STRING',
        isAdvanced: true,
        advancedJoinOperator: 'OR',
      },
      {
        type: 'value',
        value: ['a', 'b', 'c'],
        field: 'image',
        fieldType: 'STRING',
        component: 'tags',
      },
      { type: 'field', value: 'createdAt', fieldType: 'TIMESTAMP' },
      {
        type: 'operator',
        value: '>',
        field: 'createdAt',
        fieldType: 'TIMESTAMP',
      },
      {
        type: 'value',
        value: '03/08/2021',
        field: 'createdAt',
        fieldType: 'TIMESTAMP',
        component: 'text',
      },
    ],
  });
});

test('AND advanced with TIMESTAMP test', () => {
  expect(
    stringParser(
      "category = 'application' AND (image ~ 'a' AND image ~ 'b' AND image ~ 'c') AND createdAt > '03/08/2021'",
    ),
  ).toStrictEqual({
    conjunction: 'AND',
    expressions: [
      { type: 'field', value: 'category', fieldType: 'STRING' },
      {
        type: 'operator',
        value: '=',
        field: 'category',
        fieldType: 'STRING',
      },
      {
        type: 'value',
        value: 'application',
        field: 'category',
        fieldType: 'STRING',
        component: 'text',
      },
      { type: 'field', value: 'image', fieldType: 'STRING' },
      {
        type: 'operator',
        value: '~',
        field: 'image',
        fieldType: 'STRING',
        isAdvanced: true,
        advancedJoinOperator: 'AND',
      },
      {
        type: 'value',
        value: ['a', 'b', 'c'],
        field: 'image',
        fieldType: 'STRING',
        component: 'tags',
      },
      { type: 'field', value: 'createdAt', fieldType: 'TIMESTAMP' },
      {
        type: 'operator',
        value: '>',
        field: 'createdAt',
        fieldType: 'TIMESTAMP',
      },
      {
        type: 'value',
        value: '03/08/2021',
        field: 'createdAt',
        fieldType: 'TIMESTAMP',
        component: 'text',
      },
    ],
  });
});

test('AND advanced with TIMESTAMP with OR conjunction test', () => {
  expect(
    stringParser(
      "category = 'application' OR (image ~ 'a' AND image ~ 'b' AND image ~ 'c') OR createdAt > '03/08/2021'",
    ),
  ).toStrictEqual({
    conjunction: 'OR',
    expressions: [
      { type: 'field', value: 'category', fieldType: 'STRING' },
      {
        type: 'operator',
        value: '=',
        field: 'category',
        fieldType: 'STRING',
      },
      {
        type: 'value',
        value: 'application',
        field: 'category',
        fieldType: 'STRING',
        component: 'text',
      },
      { type: 'field', value: 'image', fieldType: 'STRING' },
      {
        type: 'operator',
        value: '~',
        field: 'image',
        fieldType: 'STRING',
        isAdvanced: true,
        advancedJoinOperator: 'AND',
      },
      {
        type: 'value',
        value: ['a', 'b', 'c'],
        field: 'image',
        fieldType: 'STRING',
        component: 'tags',
      },
      { type: 'field', value: 'createdAt', fieldType: 'TIMESTAMP' },
      {
        type: 'operator',
        value: '>',
        field: 'createdAt',
        fieldType: 'TIMESTAMP',
      },
      {
        type: 'value',
        value: '03/08/2021',
        field: 'createdAt',
        fieldType: 'TIMESTAMP',
        component: 'text',
      },
    ],
  });
});

test('value contain OR', () => {
  expect(
    stringParser(
      "category = 'application' AND (image ~ 'a' OR image ~ 'b' OR image ~ ' OR ')",
    ),
  ).toStrictEqual({
    conjunction: 'AND',
    expressions: [
      { type: 'field', value: 'category', fieldType: 'STRING' },
      {
        type: 'operator',
        value: '=',
        field: 'category',
        fieldType: 'STRING',
      },
      {
        type: 'value',
        value: 'application',
        field: 'category',
        fieldType: 'STRING',
        component: 'text',
      },
      { type: 'field', value: 'image', fieldType: 'STRING' },
      {
        type: 'operator',
        value: '~',
        field: 'image',
        fieldType: 'STRING',
        isAdvanced: true,
        advancedJoinOperator: 'OR',
      },
      {
        type: 'value',
        value: ['a', 'b', ' OR '],
        field: 'image',
        fieldType: 'STRING',
        component: 'tags',
      },
    ],
  });
});
