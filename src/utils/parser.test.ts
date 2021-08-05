import { stringParser } from './parser';

test('a simple test', () => {
  expect(stringParser("image ~ 'cdn' AND onSale = 'TRUE'")).toStrictEqual([
    { type: 'field', value: 'image', fieldType: 'STRING' },
    {
      type: 'operator',
      value: '~',
      field: 'image',
      fieldType: 'STRING',
      isAdvanced: false,
    },
    {
      type: 'value',
      value: 'cdn',
      field: 'image',
      fieldType: 'STRING',
      component: 'text',
    },
    { type: 'field', value: 'onSale', fieldType: 'BOOLEAN' },
    {
      type: 'operator',
      value: '=',
      field: 'onSale',
      fieldType: 'BOOLEAN',
      isAdvanced: false,
    },
    {
      type: 'value',
      value: 'TRUE',
      field: 'onSale',
      fieldType: 'BOOLEAN',
      component: 'boolean',
    },
  ]);
});

test('an advanced test', () => {
  expect(
    stringParser(
      "category = 'application' AND (image ~ 'a' OR image ~ 'b' OR image ~ 'c')",
    ),
  ).toStrictEqual([
    { type: 'field', value: 'category', fieldType: 'STRING' },
    {
      type: 'operator',
      value: '=',
      field: 'category',
      fieldType: 'STRING',
      isAdvanced: false,
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
    },
    {
      type: 'value',
      value: ['a', 'b', 'c'],
      field: 'image',
      fieldType: 'STRING',
      component: 'tags',
    },
  ]);
});
