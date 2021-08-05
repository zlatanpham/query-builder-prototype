import { Field, FieldType, Item, Operator, Value } from '../shared';

const schema = [
  { name: 'image', isArray: false, type: 'STRING' },
  { name: 'category', isArray: false, type: 'STRING' },
  { name: 'price', isArray: false, type: 'FLOAT' },
  { name: 'onSale', isArray: false, type: 'BOOLEAN' },
];

const operationMapping: { [key: string]: string } = {
  '=': 'is',
  '~': 'contains', // only STRING
  '!=': 'is not',
  '!~': 'does not contain', // only STRING
  $: 'ends with', // only STRING
  '^': 'begins with', // only STRING
  '>': 'greater than', // only FLOAT
  '<': 'less than', // only FLOAT
};

type Block = [string, string, string | string[]];

const toBlock = (expression: string) => {
  const [a, b, c, ...rest] = expression.match(/(?:[^\s']+|'[^']*')+/g) || [];
  if (!a || !b || !c || rest.length) return;
  return [a, b, c.replace(/'/g, '')] as Block;
};

const handleExpression = (expression: string) => {
  return expression.startsWith('(')
    ? expression
        .replace(/[()]/g, '')
        .split(' OR ')
        .map((value) => toBlock(value))
        .reduce((result, value) => {
          if (!value || !result) return;
          if (value[0] !== result[0] || value[1] !== result[1]) return;
          return [
            result[0],
            result[1],
            Array.isArray(result[2])
              ? [...result[2], value[2]]
              : [result[2], value[2]],
          ] as Block;
        })
    : toBlock(expression);
};

export const stringParser = (expressionString: string) => {
  let isError = false;
  const expressions: Item[] = [];
  const blockList = expressionString
    .split(' AND ')
    .map((expression) => handleExpression(expression));

  for (let index = 0; index < blockList.length; index += 1) {
    const [f, o, v] = blockList[index] || [];
    if (!blockList[index] || !f || !o || !v) {
      isError = true;
      break;
    }
    const {
      name,
      isArray,
      type: fieldType,
    } = schema.find((field) => field.name === f) || {};
    const isBooleanSelect = fieldType === 'BOOLEAN';
    // check field
    if (
      name === undefined ||
      isArray === undefined ||
      fieldType === undefined
    ) {
      isError = true;
      break;
    }
    // check operator
    if (!operationMapping[o]) {
      isError = true;
      break;
    }
    if (fieldType !== 'STRING' && ['~', '!~', '$', '^'].includes(o)) {
      isError = true;
      break;
    }
    if (fieldType !== 'FLOAT' && ['>', '<'].includes(o)) {
      isError = true;
      break;
    }
    // check value
    if (isBooleanSelect && v !== 'TRUE' && v !== 'FALSE') {
      isError = true;
      break;
    }

    const field: Field = {
      type: 'field',
      value: f,
      fieldType: fieldType as FieldType,
    };
    const operator: Operator = {
      type: 'operator',
      value: o,
      field: f,
      fieldType: fieldType as FieldType,
      isAdvanced: Array.isArray(v),
    };
    const value: Value = Array.isArray(v)
      ? {
          type: 'value',
          value: v,
          field: f,
          fieldType: fieldType as FieldType,
          component: 'tags',
        }
      : {
          type: 'value',
          value: v.replace(/'/g, ''),
          field: f,
          fieldType: fieldType as FieldType,
          component: isBooleanSelect ? 'boolean' : 'text',
        };
    expressions.push(field, operator, value);
  }

  return isError ? undefined : expressions;
};
