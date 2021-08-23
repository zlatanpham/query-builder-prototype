import { stringParser } from './parser';
import { groupFieldOptions } from './__stubs__';

test('AND joinOperator', () => {
  expect(
    stringParser(
      "category ~ 'application' AND onSale = 'TRUE'",
      groupFieldOptions,
    ),
  ).toStrictEqual({
    joinOperator: 'AND',
    expressions: [
      { type: 'field', value: 'category', fieldType: 'STRING', isArray: false },
      {
        type: 'operator',
        value: '~',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
      },
      {
        type: 'value',
        value: 'application',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
        component: 'text',
      },
      { type: 'field', value: 'onSale', fieldType: 'BOOLEAN', isArray: false },
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
        field: 'onSale',
        fieldType: 'BOOLEAN',
        component: 'boolean',
        isArray: false,
      },
    ],
  });
});

test('OR joinOperator', () => {
  expect(
    stringParser(
      "category ~ 'application' OR onSale = 'TRUE'",
      groupFieldOptions,
    ),
  ).toStrictEqual({
    joinOperator: 'OR',
    expressions: [
      { type: 'field', value: 'category', fieldType: 'STRING', isArray: false },
      {
        type: 'operator',
        value: '~',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
      },
      {
        type: 'value',
        value: 'application',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
        component: 'text',
      },
      { type: 'field', value: 'onSale', fieldType: 'BOOLEAN', isArray: false },
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
        field: 'onSale',
        fieldType: 'BOOLEAN',
        component: 'boolean',
        isArray: false,
      },
    ],
  });
});

test('OR advanced', () => {
  expect(
    stringParser(
      "category = 'application' AND (image ~ 'a' OR image ~ 'b' OR image ~ 'c')",
      groupFieldOptions,
    ),
  ).toStrictEqual({
    joinOperator: 'AND',
    expressions: [
      { type: 'field', value: 'category', fieldType: 'STRING', isArray: false },
      {
        type: 'operator',
        value: '=',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
      },
      {
        type: 'value',
        value: 'application',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
        component: 'text',
      },
      { type: 'field', value: 'image', fieldType: 'STRING', isArray: false },
      {
        type: 'operator',
        value: '~',
        field: 'image',
        fieldType: 'STRING',
        isArray: false,
        isAdvanced: true,
        advancedJoinOperator: 'OR',
      },
      {
        type: 'value',
        value: ['a', 'b', 'c'],
        field: 'image',
        fieldType: 'STRING',
        isArray: false,
        component: 'tags',
      },
    ],
  });
});

test('OR advanced with OR joinOperator', () => {
  expect(
    stringParser(
      "category = 'application' OR (image ~ 'a' OR image ~ 'b' OR image ~ 'c')",
      groupFieldOptions,
    ),
  ).toStrictEqual({
    joinOperator: 'OR',
    expressions: [
      { type: 'field', value: 'category', fieldType: 'STRING', isArray: false },
      {
        type: 'operator',
        value: '=',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
      },
      {
        type: 'value',
        value: 'application',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
        component: 'text',
      },
      { type: 'field', value: 'image', fieldType: 'STRING', isArray: false },
      {
        type: 'operator',
        value: '~',
        field: 'image',
        fieldType: 'STRING',
        isArray: false,
        isAdvanced: true,
        advancedJoinOperator: 'OR',
      },
      {
        type: 'value',
        value: ['a', 'b', 'c'],
        field: 'image',
        fieldType: 'STRING',
        isArray: false,
        component: 'tags',
      },
    ],
  });
});

test('AND advanced', () => {
  expect(
    stringParser(
      "category = 'application' AND (image ~ 'a' AND image ~ 'b' AND image ~ 'c')",
      groupFieldOptions,
    ),
  ).toStrictEqual({
    joinOperator: 'AND',
    expressions: [
      { type: 'field', value: 'category', fieldType: 'STRING', isArray: false },
      {
        type: 'operator',
        value: '=',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
      },
      {
        type: 'value',
        value: 'application',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
        component: 'text',
      },
      { type: 'field', value: 'image', fieldType: 'STRING', isArray: false },
      {
        type: 'operator',
        value: '~',
        field: 'image',
        fieldType: 'STRING',
        isArray: false,
        isAdvanced: true,
        advancedJoinOperator: 'AND',
      },
      {
        type: 'value',
        value: ['a', 'b', 'c'],
        field: 'image',
        fieldType: 'STRING',
        isArray: false,
        component: 'tags',
      },
    ],
  });
});

test('AND advanced with OR joinOperator', () => {
  expect(
    stringParser(
      "category = 'application' OR (image ~ 'a' AND image ~ 'b' AND image ~ 'c')",
      groupFieldOptions,
    ),
  ).toStrictEqual({
    joinOperator: 'OR',
    expressions: [
      { type: 'field', value: 'category', fieldType: 'STRING', isArray: false },
      {
        type: 'operator',
        value: '=',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
      },
      {
        type: 'value',
        value: 'application',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
        component: 'text',
      },
      { type: 'field', value: 'image', fieldType: 'STRING', isArray: false },
      {
        type: 'operator',
        value: '~',
        field: 'image',
        fieldType: 'STRING',
        isArray: false,
        isAdvanced: true,
        advancedJoinOperator: 'AND',
      },
      {
        type: 'value',
        value: ['a', 'b', 'c'],
        field: 'image',
        fieldType: 'STRING',
        isArray: false,
        component: 'tags',
      },
    ],
  });
});

test('number', () => {
  expect(stringParser('page = 99999', groupFieldOptions)).toStrictEqual({
    joinOperator: 'AND',
    expressions: [
      { type: 'field', value: 'page', fieldType: 'INTEGER', isArray: false },
      {
        type: 'operator',
        value: '=',
        field: 'page',
        fieldType: 'INTEGER',
        isArray: false,
      },
      {
        type: 'value',
        value: 99999,
        field: 'page',
        fieldType: 'INTEGER',
        isArray: false,
        component: 'text',
      },
    ],
  });

  expect(
    stringParser(
      "page = 12345 AND category = 'application'",
      groupFieldOptions,
    ),
  ).toStrictEqual({
    joinOperator: 'AND',
    expressions: [
      { type: 'field', value: 'page', fieldType: 'INTEGER', isArray: false },
      {
        type: 'operator',
        value: '=',
        field: 'page',
        fieldType: 'INTEGER',
        isArray: false,
      },
      {
        type: 'value',
        value: 12345,
        field: 'page',
        fieldType: 'INTEGER',
        isArray: false,
        component: 'text',
      },
      { type: 'field', value: 'category', fieldType: 'STRING', isArray: false },
      {
        type: 'operator',
        value: '=',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
      },
      {
        type: 'value',
        value: 'application',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
        component: 'text',
      },
    ],
  });
});

test('TIMESTAMP', () => {
  expect(
    stringParser(
      "category = 'application' AND createdAt > '2021-08-03'",
      groupFieldOptions,
    ),
  ).toStrictEqual({
    joinOperator: 'AND',
    expressions: [
      { type: 'field', value: 'category', fieldType: 'STRING', isArray: false },
      {
        type: 'operator',
        value: '=',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
      },
      {
        type: 'value',
        value: 'application',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
        component: 'text',
      },
      {
        type: 'field',
        value: 'createdAt',
        fieldType: 'TIMESTAMP',
        isArray: false,
      },
      {
        type: 'operator',
        value: '>',
        field: 'createdAt',
        fieldType: 'TIMESTAMP',
        isArray: false,
      },
      {
        type: 'value',
        value: '2021-08-03',
        field: 'createdAt',
        fieldType: 'TIMESTAMP',
        isArray: false,
        component: 'text',
      },
    ],
  });
});

test('OR advanced with TIMESTAMP', () => {
  expect(
    stringParser(
      "category = 'application' AND (image ~ 'a' OR image ~ 'b' OR image ~ 'c') AND createdAt > '2021-08-03'",
      groupFieldOptions,
    ),
  ).toStrictEqual({
    joinOperator: 'AND',
    expressions: [
      { type: 'field', value: 'category', fieldType: 'STRING', isArray: false },
      {
        type: 'operator',
        value: '=',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
      },
      {
        type: 'value',
        value: 'application',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
        component: 'text',
      },
      { type: 'field', value: 'image', fieldType: 'STRING', isArray: false },
      {
        type: 'operator',
        value: '~',
        field: 'image',
        fieldType: 'STRING',
        isArray: false,
        isAdvanced: true,
        advancedJoinOperator: 'OR',
      },
      {
        type: 'value',
        value: ['a', 'b', 'c'],
        field: 'image',
        fieldType: 'STRING',
        isArray: false,
        component: 'tags',
      },
      {
        type: 'field',
        value: 'createdAt',
        fieldType: 'TIMESTAMP',
        isArray: false,
      },
      {
        type: 'operator',
        value: '>',
        field: 'createdAt',
        fieldType: 'TIMESTAMP',
        isArray: false,
      },
      {
        type: 'value',
        value: '2021-08-03',
        field: 'createdAt',
        fieldType: 'TIMESTAMP',
        isArray: false,
        component: 'text',
      },
    ],
  });
});

test('OR advanced with TIMESTAMP and OR joinOperator', () => {
  expect(
    stringParser(
      "category = 'application' OR (image ~ 'a' OR image ~ 'b' OR image ~ 'c') OR createdAt > '2021-08-03'",
      groupFieldOptions,
    ),
  ).toStrictEqual({
    joinOperator: 'OR',
    expressions: [
      { type: 'field', value: 'category', fieldType: 'STRING', isArray: false },
      {
        type: 'operator',
        value: '=',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
      },
      {
        type: 'value',
        value: 'application',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
        component: 'text',
      },
      { type: 'field', value: 'image', fieldType: 'STRING', isArray: false },
      {
        type: 'operator',
        value: '~',
        field: 'image',
        fieldType: 'STRING',
        isArray: false,
        isAdvanced: true,
        advancedJoinOperator: 'OR',
      },
      {
        type: 'value',
        value: ['a', 'b', 'c'],
        field: 'image',
        fieldType: 'STRING',
        isArray: false,
        component: 'tags',
      },
      {
        type: 'field',
        value: 'createdAt',
        fieldType: 'TIMESTAMP',
        isArray: false,
      },
      {
        type: 'operator',
        value: '>',
        field: 'createdAt',
        fieldType: 'TIMESTAMP',
        isArray: false,
      },
      {
        type: 'value',
        value: '2021-08-03',
        field: 'createdAt',
        fieldType: 'TIMESTAMP',
        isArray: false,
        component: 'text',
      },
    ],
  });
});

test('AND advanced with TIMESTAMP', () => {
  expect(
    stringParser(
      "category = 'application' AND (image ~ 'a' AND image ~ 'b' AND image ~ 'c') AND createdAt > '2021-08-03'",
      groupFieldOptions,
    ),
  ).toStrictEqual({
    joinOperator: 'AND',
    expressions: [
      { type: 'field', value: 'category', fieldType: 'STRING', isArray: false },
      {
        type: 'operator',
        value: '=',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
      },
      {
        type: 'value',
        value: 'application',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
        component: 'text',
      },
      { type: 'field', value: 'image', fieldType: 'STRING', isArray: false },
      {
        type: 'operator',
        value: '~',
        field: 'image',
        fieldType: 'STRING',
        isArray: false,
        isAdvanced: true,
        advancedJoinOperator: 'AND',
      },
      {
        type: 'value',
        value: ['a', 'b', 'c'],
        field: 'image',
        fieldType: 'STRING',
        isArray: false,
        component: 'tags',
      },
      {
        type: 'field',
        value: 'createdAt',
        fieldType: 'TIMESTAMP',
        isArray: false,
      },
      {
        type: 'operator',
        value: '>',
        field: 'createdAt',
        fieldType: 'TIMESTAMP',
        isArray: false,
      },
      {
        type: 'value',
        value: '2021-08-03',
        field: 'createdAt',
        fieldType: 'TIMESTAMP',
        isArray: false,
        component: 'text',
      },
    ],
  });
});

test('AND advanced with TIMESTAMP with OR joinOperator', () => {
  expect(
    stringParser(
      "category = 'application' OR (image ~ 'a' AND image ~ 'b' AND image ~ 'c') OR createdAt > '2021-08-03'",
      groupFieldOptions,
    ),
  ).toStrictEqual({
    joinOperator: 'OR',
    expressions: [
      { type: 'field', value: 'category', fieldType: 'STRING', isArray: false },
      {
        type: 'operator',
        value: '=',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
      },
      {
        type: 'value',
        value: 'application',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
        component: 'text',
      },
      { type: 'field', value: 'image', fieldType: 'STRING', isArray: false },
      {
        type: 'operator',
        value: '~',
        field: 'image',
        fieldType: 'STRING',
        isArray: false,
        isAdvanced: true,
        advancedJoinOperator: 'AND',
      },
      {
        type: 'value',
        value: ['a', 'b', 'c'],
        field: 'image',
        fieldType: 'STRING',
        isArray: false,
        component: 'tags',
      },
      {
        type: 'field',
        value: 'createdAt',
        fieldType: 'TIMESTAMP',
        isArray: false,
      },
      {
        type: 'operator',
        value: '>',
        field: 'createdAt',
        fieldType: 'TIMESTAMP',
        isArray: false,
      },
      {
        type: 'value',
        value: '2021-08-03',
        field: 'createdAt',
        fieldType: 'TIMESTAMP',
        isArray: false,
        component: 'text',
      },
    ],
  });
});

test('value contain OR', () => {
  expect(
    stringParser(
      "category = 'application' AND (image ~ 'a' OR image ~ 'b' OR image ~ ' OR ')",
      groupFieldOptions,
    ),
  ).toStrictEqual({
    joinOperator: 'AND',
    expressions: [
      { type: 'field', value: 'category', fieldType: 'STRING', isArray: false },
      {
        type: 'operator',
        value: '=',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
      },
      {
        type: 'value',
        value: 'application',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
        component: 'text',
      },
      { type: 'field', value: 'image', fieldType: 'STRING', isArray: false },
      {
        type: 'operator',
        value: '~',
        field: 'image',
        fieldType: 'STRING',
        isArray: false,
        isAdvanced: true,
        advancedJoinOperator: 'OR',
      },
      {
        type: 'value',
        value: ['a', 'b', ' OR '],
        field: 'image',
        fieldType: 'STRING',
        isArray: false,
        component: 'tags',
      },
    ],
  });
});

test('incomplete query with field and operator', () => {
  const expected = {
    joinOperator: 'AND',
    expressions: [
      { type: 'field', value: 'category', fieldType: 'STRING', isArray: false },
      {
        type: 'operator',
        value: '~',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
      },
    ],
  };

  expect(stringParser('category ~ ', groupFieldOptions)).toStrictEqual(
    expected,
  );
  expect(stringParser('category~', groupFieldOptions)).toStrictEqual(expected);
  expect(stringParser('category~ ', groupFieldOptions)).toStrictEqual(expected);
});

test('incomplete query with only field', () => {
  expect(stringParser('category', groupFieldOptions)).toStrictEqual({
    joinOperator: 'AND',
    expressions: [
      { type: 'field', value: 'category', fieldType: 'STRING', isArray: false },
    ],
  });
});

test('incomplete query with joinOperator', () => {
  expect(
    stringParser("category ~ 'application' AND onSale =", groupFieldOptions),
  ).toStrictEqual({
    joinOperator: 'AND',
    expressions: [
      { type: 'field', value: 'category', fieldType: 'STRING', isArray: false },
      {
        type: 'operator',
        value: '~',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
      },
      {
        type: 'value',
        value: 'application',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
        component: 'text',
      },
      { type: 'field', value: 'onSale', fieldType: 'BOOLEAN', isArray: false },
      {
        type: 'operator',
        value: '=',
        field: 'onSale',
        fieldType: 'BOOLEAN',
        isArray: false,
      },
    ],
  });
});

test('is Array', () => {
  expect(
    stringParser(
      "category = 'application' AND brand ~ ['red']",
      groupFieldOptions,
    ),
  ).toStrictEqual({
    joinOperator: 'AND',
    expressions: [
      {
        type: 'field',
        value: 'category',
        fieldType: 'STRING',
        isArray: false,
      },
      {
        type: 'operator',
        value: '=',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
      },
      {
        type: 'value',
        value: 'application',
        field: 'category',
        fieldType: 'STRING',
        component: 'text',
        isArray: false,
      },
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
        value: 'red',
        field: 'brand',
        fieldType: 'STRING',
        component: 'text',
        isArray: true,
      },
    ],
  });
});

test('without spacing', () => {
  const expected = {
    joinOperator: 'AND',
    expressions: [
      { type: 'field', value: 'category', fieldType: 'STRING', isArray: false },
      {
        type: 'operator',
        value: '~',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
      },
      {
        type: 'value',
        value: 'application',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
        component: 'text',
      },
    ],
  };

  expect(
    stringParser("category~'application'", groupFieldOptions),
  ).toStrictEqual(expected);

  expect(
    stringParser("category~ 'application'", groupFieldOptions),
  ).toStrictEqual(expected);

  expect(
    stringParser("category ~'application'", groupFieldOptions),
  ).toStrictEqual(expected);
});

test('without spacing has joinOperator', () => {
  const expected = {
    joinOperator: 'AND',
    expressions: [
      {
        type: 'field',
        value: 'category',
        fieldType: 'STRING',
        isArray: false,
      },
      {
        type: 'operator',
        value: '=',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
      },
      {
        type: 'value',
        value: 'application',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
        component: 'text',
      },
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
        value: 'red',
        field: 'brand',
        fieldType: 'STRING',
        component: 'text',
        isArray: true,
      },
    ],
  };

  expect(
    stringParser(
      "category = 'application' AND brand~['red']",
      groupFieldOptions,
    ),
  ).toStrictEqual(expected);

  expect(
    stringParser(
      "category='application' AND brand ~ ['red']",
      groupFieldOptions,
    ),
  ).toStrictEqual(expected);

  expect(
    stringParser(
      "category ='application' AND brand~ ['red']",
      groupFieldOptions,
    ),
  ).toStrictEqual(expected);
});

test('without spacing has joinOperator contain OR', () => {
  const expected = {
    joinOperator: 'AND',
    expressions: [
      { type: 'field', value: 'category', fieldType: 'STRING', isArray: false },
      {
        type: 'operator',
        value: '=',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
      },
      {
        type: 'value',
        value: 'application',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
        component: 'text',
      },
      { type: 'field', value: 'image', fieldType: 'STRING', isArray: false },
      {
        type: 'operator',
        value: '~',
        field: 'image',
        fieldType: 'STRING',
        isArray: false,
        isAdvanced: true,
        advancedJoinOperator: 'OR',
      },
      {
        type: 'value',
        value: ['a', 'b', ' OR '],
        field: 'image',
        fieldType: 'STRING',
        isArray: false,
        component: 'tags',
      },
    ],
  };
  expect(
    stringParser(
      "category = 'application' AND (image~'a' OR image~'b' OR image ~ ' OR ')",
      groupFieldOptions,
    ),
  ).toStrictEqual(expected);
  expect(
    stringParser(
      "category='application' AND (image ~ 'a' OR image ~ 'b' OR image ~ ' OR ')",
      groupFieldOptions,
    ),
  ).toStrictEqual(expected);
  expect(
    stringParser(
      "category ='application' AND (image ~ 'a' OR image ~ 'b' OR image~' OR ')",
      groupFieldOptions,
    ),
  ).toStrictEqual(expected);
});

test('malicious symbols ()', () => {
  expect(
    stringParser("category = 'application()'", groupFieldOptions),
  ).toStrictEqual({
    joinOperator: 'AND',
    expressions: [
      { type: 'field', value: 'category', fieldType: 'STRING', isArray: false },
      {
        type: 'operator',
        value: '=',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
      },
      {
        type: 'value',
        value: 'application()',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
        component: 'text',
      },
    ],
  });
  expect(
    stringParser("category = '(application)'", groupFieldOptions),
  ).toStrictEqual({
    joinOperator: 'AND',
    expressions: [
      { type: 'field', value: 'category', fieldType: 'STRING', isArray: false },
      {
        type: 'operator',
        value: '=',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
      },
      {
        type: 'value',
        value: '(application)',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
        component: 'text',
      },
    ],
  });
  expect(stringParser("category = '()'", groupFieldOptions)).toStrictEqual({
    joinOperator: 'AND',
    expressions: [
      { type: 'field', value: 'category', fieldType: 'STRING', isArray: false },
      {
        type: 'operator',
        value: '=',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
      },
      {
        type: 'value',
        value: '()',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
        component: 'text',
      },
    ],
  });
});

test('Unfinished statement', () => {
  expect(stringParser('category =', groupFieldOptions)).toStrictEqual({
    joinOperator: 'AND',
    expressions: [
      { type: 'field', value: 'category', fieldType: 'STRING', isArray: false },
      {
        type: 'operator',
        value: '=',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
      },
    ],
  });

  expect(stringParser('category', groupFieldOptions)).toStrictEqual({
    joinOperator: 'AND',
    expressions: [
      { type: 'field', value: 'category', fieldType: 'STRING', isArray: false },
    ],
  });

  expect(
    stringParser("category = 'application' OR category", groupFieldOptions),
  ).toStrictEqual({
    joinOperator: 'OR',
    expressions: [
      { type: 'field', value: 'category', fieldType: 'STRING', isArray: false },
      {
        type: 'operator',
        value: '=',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
      },
      {
        type: 'value',
        value: 'application',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
        component: 'text',
      },
      { type: 'field', value: 'category', fieldType: 'STRING', isArray: false },
    ],
  });

  expect(
    stringParser("category = 'application' OR category !=", groupFieldOptions),
  ).toStrictEqual({
    joinOperator: 'OR',
    expressions: [
      { type: 'field', value: 'category', fieldType: 'STRING', isArray: false },
      {
        type: 'operator',
        value: '=',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
      },
      {
        type: 'value',
        value: 'application',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
        component: 'text',
      },
      { type: 'field', value: 'category', fieldType: 'STRING', isArray: false },
      {
        type: 'operator',
        value: '!=',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
      },
    ],
  });
});

test('malicious symbols []', () => {
  expect(
    stringParser(
      "category = 'application' AND (image ~ '[a]' OR image ~ '(b)' OR image ~ ' OR ')",
      groupFieldOptions,
    ),
  ).toStrictEqual({
    joinOperator: 'AND',
    expressions: [
      { type: 'field', value: 'category', fieldType: 'STRING', isArray: false },
      {
        type: 'operator',
        value: '=',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
      },
      {
        type: 'value',
        value: 'application',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
        component: 'text',
      },
      { type: 'field', value: 'image', fieldType: 'STRING', isArray: false },
      {
        type: 'operator',
        value: '~',
        field: 'image',
        fieldType: 'STRING',
        isArray: false,
        isAdvanced: true,
        advancedJoinOperator: 'OR',
      },
      {
        type: 'value',
        value: ['[a]', '(b)', ' OR '],
        field: 'image',
        fieldType: 'STRING',
        isArray: false,
        component: 'tags',
      },
    ],
  });
});

test('malicious symbols - []', () => {
  expect(
    stringParser(
      "category = '[(application)]' AND brand ~ ['(red)']",
      groupFieldOptions,
    ),
  ).toStrictEqual({
    joinOperator: 'AND',
    expressions: [
      {
        type: 'field',
        value: 'category',
        fieldType: 'STRING',
        isArray: false,
      },
      {
        type: 'operator',
        value: '=',
        field: 'category',
        fieldType: 'STRING',
        isArray: false,
      },
      {
        type: 'value',
        value: '[(application)]',
        field: 'category',
        fieldType: 'STRING',
        component: 'text',
        isArray: false,
      },
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
        value: '(red)',
        field: 'brand',
        fieldType: 'STRING',
        component: 'text',
        isArray: true,
      },
    ],
  });
});
