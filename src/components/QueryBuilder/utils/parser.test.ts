import { groupFieldOptions } from '../shared';
import { stringParser } from './parser';

// test('AND conjunction test', () => {
//   expect(
//     stringParser(
//       "category ~ 'application' AND onSale = 'TRUE'",
//       groupFieldOptions,
//     ),
//   ).toStrictEqual({
//     conjunction: 'AND',
//     expressions: [
//       { type: 'field', value: 'category', fieldType: 'STRING' },
//       {
//         type: 'operator',
//         value: '~',
//         field: 'category',
//         fieldType: 'STRING',
//       },
//       {
//         type: 'value',
//         value: 'application',
//         field: 'category',
//         fieldType: 'STRING',
//         component: 'text',
//       },
//       { type: 'field', value: 'onSale', fieldType: 'BOOLEAN' },
//       {
//         type: 'operator',
//         value: '=',
//         field: 'onSale',
//         fieldType: 'BOOLEAN',
//       },
//       {
//         type: 'value',
//         value: 'TRUE',
//         field: 'onSale',
//         fieldType: 'BOOLEAN',
//         component: 'boolean',
//       },
//     ],
//   });
// });

// test('OR conjunction test', () => {
//   expect(
//     stringParser(
//       "category ~ 'application' OR onSale = 'TRUE'",
//       groupFieldOptions,
//     ),
//   ).toStrictEqual({
//     conjunction: 'OR',
//     expressions: [
//       { type: 'field', value: 'category', fieldType: 'STRING' },
//       {
//         type: 'operator',
//         value: '~',
//         field: 'category',
//         fieldType: 'STRING',
//       },
//       {
//         type: 'value',
//         value: 'application',
//         field: 'category',
//         fieldType: 'STRING',
//         component: 'text',
//       },
//       { type: 'field', value: 'onSale', fieldType: 'BOOLEAN' },
//       {
//         type: 'operator',
//         value: '=',
//         field: 'onSale',
//         fieldType: 'BOOLEAN',
//       },
//       {
//         type: 'value',
//         value: 'TRUE',
//         field: 'onSale',
//         fieldType: 'BOOLEAN',
//         component: 'boolean',
//       },
//     ],
//   });
// });

// test('OR advanced test', () => {
//   expect(
//     stringParser(
//       "category = 'application' AND (image ~ 'a' OR image ~ 'b' OR image ~ 'c')",
//       groupFieldOptions,
//     ),
//   ).toStrictEqual({
//     conjunction: 'AND',
//     expressions: [
//       { type: 'field', value: 'category', fieldType: 'STRING' },
//       {
//         type: 'operator',
//         value: '=',
//         field: 'category',
//         fieldType: 'STRING',
//       },
//       {
//         type: 'value',
//         value: 'application',
//         field: 'category',
//         fieldType: 'STRING',
//         component: 'text',
//       },
//       { type: 'field', value: 'image', fieldType: 'STRING' },
//       {
//         type: 'operator',
//         value: '~',
//         field: 'image',
//         fieldType: 'STRING',
//         isAdvanced: true,
//         advancedJoinOperator: 'OR',
//       },
//       {
//         type: 'value',
//         value: ['a', 'b', 'c'],
//         field: 'image',
//         fieldType: 'STRING',
//         component: 'tags',
//       },
//     ],
//   });
// });

// test('OR advanced with OR conjunction test', () => {
//   expect(
//     stringParser(
//       "category = 'application' OR (image ~ 'a' OR image ~ 'b' OR image ~ 'c')",
//       groupFieldOptions,
//     ),
//   ).toStrictEqual({
//     conjunction: 'OR',
//     expressions: [
//       { type: 'field', value: 'category', fieldType: 'STRING' },
//       {
//         type: 'operator',
//         value: '=',
//         field: 'category',
//         fieldType: 'STRING',
//       },
//       {
//         type: 'value',
//         value: 'application',
//         field: 'category',
//         fieldType: 'STRING',
//         component: 'text',
//       },
//       { type: 'field', value: 'image', fieldType: 'STRING' },
//       {
//         type: 'operator',
//         value: '~',
//         field: 'image',
//         fieldType: 'STRING',
//         isAdvanced: true,
//         advancedJoinOperator: 'OR',
//       },
//       {
//         type: 'value',
//         value: ['a', 'b', 'c'],
//         field: 'image',
//         fieldType: 'STRING',
//         component: 'tags',
//       },
//     ],
//   });
// });

// test('AND advanced test', () => {
//   expect(
//     stringParser(
//       "category = 'application' AND (image ~ 'a' AND image ~ 'b' AND image ~ 'c')",
//       groupFieldOptions,
//     ),
//   ).toStrictEqual({
//     conjunction: 'AND',
//     expressions: [
//       { type: 'field', value: 'category', fieldType: 'STRING' },
//       {
//         type: 'operator',
//         value: '=',
//         field: 'category',
//         fieldType: 'STRING',
//       },
//       {
//         type: 'value',
//         value: 'application',
//         field: 'category',
//         fieldType: 'STRING',
//         component: 'text',
//       },
//       { type: 'field', value: 'image', fieldType: 'STRING' },
//       {
//         type: 'operator',
//         value: '~',
//         field: 'image',
//         fieldType: 'STRING',
//         isAdvanced: true,
//         advancedJoinOperator: 'AND',
//       },
//       {
//         type: 'value',
//         value: ['a', 'b', 'c'],
//         field: 'image',
//         fieldType: 'STRING',
//         component: 'tags',
//       },
//     ],
//   });
// });

// test('AND advanced with OR conjunction test', () => {
//   expect(
//     stringParser(
//       "category = 'application' OR (image ~ 'a' AND image ~ 'b' AND image ~ 'c')",
//       groupFieldOptions,
//     ),
//   ).toStrictEqual({
//     conjunction: 'OR',
//     expressions: [
//       { type: 'field', value: 'category', fieldType: 'STRING' },
//       {
//         type: 'operator',
//         value: '=',
//         field: 'category',
//         fieldType: 'STRING',
//       },
//       {
//         type: 'value',
//         value: 'application',
//         field: 'category',
//         fieldType: 'STRING',
//         component: 'text',
//       },
//       { type: 'field', value: 'image', fieldType: 'STRING' },
//       {
//         type: 'operator',
//         value: '~',
//         field: 'image',
//         fieldType: 'STRING',
//         isAdvanced: true,
//         advancedJoinOperator: 'AND',
//       },
//       {
//         type: 'value',
//         value: ['a', 'b', 'c'],
//         field: 'image',
//         fieldType: 'STRING',
//         component: 'tags',
//       },
//     ],
//   });
// });

// test('TIMESTAMP test', () => {
//   expect(
//     stringParser(
//       "category = 'application' AND createdAt > '03/08/2021'",
//       groupFieldOptions,
//     ),
//   ).toStrictEqual({
//     conjunction: 'AND',
//     expressions: [
//       { type: 'field', value: 'category', fieldType: 'STRING' },
//       {
//         type: 'operator',
//         value: '=',
//         field: 'category',
//         fieldType: 'STRING',
//       },
//       {
//         type: 'value',
//         value: 'application',
//         field: 'category',
//         fieldType: 'STRING',
//         component: 'text',
//       },
//       { type: 'field', value: 'createdAt', fieldType: 'TIMESTAMP' },
//       {
//         type: 'operator',
//         value: '>',
//         field: 'createdAt',
//         fieldType: 'TIMESTAMP',
//       },
//       {
//         type: 'value',
//         value: '03/08/2021',
//         field: 'createdAt',
//         fieldType: 'TIMESTAMP',
//         component: 'text',
//       },
//     ],
//   });
// });

// test('OR advanced with TIMESTAMP test', () => {
//   expect(
//     stringParser(
//       "category = 'application' AND (image ~ 'a' OR image ~ 'b' OR image ~ 'c') AND createdAt > '03/08/2021'",
//       groupFieldOptions,
//     ),
//   ).toStrictEqual({
//     conjunction: 'AND',
//     expressions: [
//       { type: 'field', value: 'category', fieldType: 'STRING' },
//       {
//         type: 'operator',
//         value: '=',
//         field: 'category',
//         fieldType: 'STRING',
//       },
//       {
//         type: 'value',
//         value: 'application',
//         field: 'category',
//         fieldType: 'STRING',
//         component: 'text',
//       },
//       { type: 'field', value: 'image', fieldType: 'STRING' },
//       {
//         type: 'operator',
//         value: '~',
//         field: 'image',
//         fieldType: 'STRING',
//         isAdvanced: true,
//         advancedJoinOperator: 'OR',
//       },
//       {
//         type: 'value',
//         value: ['a', 'b', 'c'],
//         field: 'image',
//         fieldType: 'STRING',
//         component: 'tags',
//       },
//       { type: 'field', value: 'createdAt', fieldType: 'TIMESTAMP' },
//       {
//         type: 'operator',
//         value: '>',
//         field: 'createdAt',
//         fieldType: 'TIMESTAMP',
//       },
//       {
//         type: 'value',
//         value: '03/08/2021',
//         field: 'createdAt',
//         fieldType: 'TIMESTAMP',
//         component: 'text',
//       },
//     ],
//   });
// });

// test('OR advanced with TIMESTAMP and OR conjunction test', () => {
//   expect(
//     stringParser(
//       "category = 'application' OR (image ~ 'a' OR image ~ 'b' OR image ~ 'c') OR createdAt > '03/08/2021'",
//       groupFieldOptions,
//     ),
//   ).toStrictEqual({
//     conjunction: 'OR',
//     expressions: [
//       { type: 'field', value: 'category', fieldType: 'STRING' },
//       {
//         type: 'operator',
//         value: '=',
//         field: 'category',
//         fieldType: 'STRING',
//       },
//       {
//         type: 'value',
//         value: 'application',
//         field: 'category',
//         fieldType: 'STRING',
//         component: 'text',
//       },
//       { type: 'field', value: 'image', fieldType: 'STRING' },
//       {
//         type: 'operator',
//         value: '~',
//         field: 'image',
//         fieldType: 'STRING',
//         isAdvanced: true,
//         advancedJoinOperator: 'OR',
//       },
//       {
//         type: 'value',
//         value: ['a', 'b', 'c'],
//         field: 'image',
//         fieldType: 'STRING',
//         component: 'tags',
//       },
//       { type: 'field', value: 'createdAt', fieldType: 'TIMESTAMP' },
//       {
//         type: 'operator',
//         value: '>',
//         field: 'createdAt',
//         fieldType: 'TIMESTAMP',
//       },
//       {
//         type: 'value',
//         value: '03/08/2021',
//         field: 'createdAt',
//         fieldType: 'TIMESTAMP',
//         component: 'text',
//       },
//     ],
//   });
// });

// test('AND advanced with TIMESTAMP test', () => {
//   expect(
//     stringParser(
//       "category = 'application' AND (image ~ 'a' AND image ~ 'b' AND image ~ 'c') AND createdAt > '03/08/2021'",
//       groupFieldOptions,
//     ),
//   ).toStrictEqual({
//     conjunction: 'AND',
//     expressions: [
//       { type: 'field', value: 'category', fieldType: 'STRING' },
//       {
//         type: 'operator',
//         value: '=',
//         field: 'category',
//         fieldType: 'STRING',
//       },
//       {
//         type: 'value',
//         value: 'application',
//         field: 'category',
//         fieldType: 'STRING',
//         component: 'text',
//       },
//       { type: 'field', value: 'image', fieldType: 'STRING' },
//       {
//         type: 'operator',
//         value: '~',
//         field: 'image',
//         fieldType: 'STRING',
//         isAdvanced: true,
//         advancedJoinOperator: 'AND',
//       },
//       {
//         type: 'value',
//         value: ['a', 'b', 'c'],
//         field: 'image',
//         fieldType: 'STRING',
//         component: 'tags',
//       },
//       { type: 'field', value: 'createdAt', fieldType: 'TIMESTAMP' },
//       {
//         type: 'operator',
//         value: '>',
//         field: 'createdAt',
//         fieldType: 'TIMESTAMP',
//       },
//       {
//         type: 'value',
//         value: '03/08/2021',
//         field: 'createdAt',
//         fieldType: 'TIMESTAMP',
//         component: 'text',
//       },
//     ],
//   });
// });

// test('AND advanced with TIMESTAMP with OR conjunction test', () => {
//   expect(
//     stringParser(
//       "category = 'application' OR (image ~ 'a' AND image ~ 'b' AND image ~ 'c') OR createdAt > '03/08/2021'",
//       groupFieldOptions,
//     ),
//   ).toStrictEqual({
//     conjunction: 'OR',
//     expressions: [
//       { type: 'field', value: 'category', fieldType: 'STRING' },
//       {
//         type: 'operator',
//         value: '=',
//         field: 'category',
//         fieldType: 'STRING',
//       },
//       {
//         type: 'value',
//         value: 'application',
//         field: 'category',
//         fieldType: 'STRING',
//         component: 'text',
//       },
//       { type: 'field', value: 'image', fieldType: 'STRING' },
//       {
//         type: 'operator',
//         value: '~',
//         field: 'image',
//         fieldType: 'STRING',
//         isAdvanced: true,
//         advancedJoinOperator: 'AND',
//       },
//       {
//         type: 'value',
//         value: ['a', 'b', 'c'],
//         field: 'image',
//         fieldType: 'STRING',
//         component: 'tags',
//       },
//       { type: 'field', value: 'createdAt', fieldType: 'TIMESTAMP' },
//       {
//         type: 'operator',
//         value: '>',
//         field: 'createdAt',
//         fieldType: 'TIMESTAMP',
//       },
//       {
//         type: 'value',
//         value: '03/08/2021',
//         field: 'createdAt',
//         fieldType: 'TIMESTAMP',
//         component: 'text',
//       },
//     ],
//   });
// });

// test('value contain OR', () => {
//   expect(
//     stringParser(
//       "category = 'application' AND (image ~ 'a' OR image ~ 'b' OR image ~ ' OR ')",
//       groupFieldOptions,
//     ),
//   ).toStrictEqual({
//     conjunction: 'AND',
//     expressions: [
//       { type: 'field', value: 'category', fieldType: 'STRING' },
//       {
//         type: 'operator',
//         value: '=',
//         field: 'category',
//         fieldType: 'STRING',
//       },
//       {
//         type: 'value',
//         value: 'application',
//         field: 'category',
//         fieldType: 'STRING',
//         component: 'text',
//       },
//       { type: 'field', value: 'image', fieldType: 'STRING' },
//       {
//         type: 'operator',
//         value: '~',
//         field: 'image',
//         fieldType: 'STRING',
//         isAdvanced: true,
//         advancedJoinOperator: 'OR',
//       },
//       {
//         type: 'value',
//         value: ['a', 'b', ' OR '],
//         field: 'image',
//         fieldType: 'STRING',
//         component: 'tags',
//       },
//     ],
//   });
// });

test('is Array', () => {
  expect(
    stringParser(
      "category = 'application' AND brand ~ ['red']",
      groupFieldOptions,
    ),
  ).toStrictEqual({
    conjunction: 'AND',
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
        component: 'text',
        isArray: false,
      },
      { type: 'field', value: 'brand', fieldType: 'STRING', isArray: true },
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
