import {
  advancedOperatorMapping,
  Field,
  FieldOption,
  FieldType,
  GroupMenu,
  groupOperatorOptions,
  Item,
  Operator,
  operatorMapping,
  Value,
} from '../shared';

type Block = [string, string, string | string[]];

const _regex = /(?:[^_(']|\([^)]*\)|'[^']*')+/g;

const isOrExpression = (expression: string) => {
  return expression
    .match(/(?:[^\s(']+|\([^)]*\)|'[^']*')+/g)
    ?.some((text) => text === 'OR');
};

const toBlock = (expression: string) => {
  const [a, b, c, ...rest] = expression.match(/(?:[^\s']+|'[^']*')+/g) || [];
  if (!a || !b || !c || rest.length) return;
  return [a, b, c.replace(/'/g, '')] as Block;
};

const handleExpression = (expression: string) => {
  if (!expression.trim().startsWith('(')) {
    return toBlock(expression.trim());
  }
  const newExpression = expression.trim().replace(/[()]/g, '');
  const conjunction = isOrExpression(newExpression) ? ' OR ' : ' AND ';
  const regex = new RegExp(conjunction, 'g');
  return newExpression
    .replace(/[()]/g, '')
    .replace(regex, '_')
    .match(_regex)
    ?.map((value) => toBlock(value.replace(/_/g, conjunction)))
    .reduce((result, value) => {
      if (!value || !result) {
        return undefined;
      }
      if (
        value[0] !== result[0] ||
        value[1] !== result[1].replace(/AND|OR/g, '')
      ) {
        return undefined;
      }

      return [
        value[0],
        value[1] + conjunction.trim(),
        Array.isArray(result[2])
          ? [...result[2], value[2]]
          : [result[2], value[2]],
      ] as Block;
    });
};

export const stringParser = (
  expressionString: string,
  groupFieldOptions: GroupMenu<FieldOption>[],
) => {
  let isError = false;
  let error = '';
  const expressions: Item[] = [];
  const conjunction = isOrExpression(expressionString) ? ' OR ' : ' AND ';
  const regex = new RegExp(conjunction, 'g');
  const blockList = expressionString
    .replace(regex, '_')
    .match(_regex)
    ?.map((expression) =>
      handleExpression(expression.replace(/_/g, conjunction)),
    );

  if (!blockList) {
    throw new Error(error);
  }

  for (let index = 0; index < blockList.length; index += 1) {
    const [f, o, v] = blockList[index] || [];
    if (!blockList[index] || !f || !o || !v) {
      isError = true;
      error = 'undefined';
      break;
    }
    const {
      text: name,
      isArray,
      type: fieldType,
    } = groupFieldOptions
      .map((group) => group.items)
      .flat()
      .find((field) => field.text === f) || {};
    const isBooleanSelect = fieldType === 'BOOLEAN';
    // check field
    if (
      name === undefined ||
      isArray === undefined ||
      fieldType === undefined
    ) {
      isError = true;
      error = `field ${f} is not found`;
      break;
    }
    // check operator
    if (!operatorMapping[o] && !advancedOperatorMapping[o]) {
      isError = true;
      error = `operator ${o} is not found`;
      break;
    }
    const availableTypes = groupOperatorOptions
      .map((group) => group.items)
      .flat()
      .find((operator) =>
        operator.advancedJoinOperator
          ? operator.value + operator.advancedJoinOperator === o
          : operator.value === o,
      )?.types;
    if (!availableTypes?.includes(fieldType)) {
      isError = true;
      error = `operator ${o} is only able to use with type ${availableTypes}`;
      break;
    }
    // check value
    if (isBooleanSelect && v !== 'TRUE' && v !== 'FALSE') {
      isError = true;
      error = `value ${v} is only able to be TRUE or FALSE`;
      break;
    }

    const field: Field = {
      type: 'field',
      value: f,
      fieldType: fieldType as FieldType,
    };
    const advancedJoinOperator = o.includes('OR')
      ? 'OR'
      : o.includes('AND')
      ? 'AND'
      : undefined;
    const operator: Operator = {
      type: 'operator',
      value: advancedJoinOperator ? o.replace(advancedJoinOperator, '') : o,
      field: f,
      fieldType: fieldType as FieldType,
      ...(advancedJoinOperator
        ? { isAdvanced: true, advancedJoinOperator }
        : {}),
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

  if (isError) {
    throw new Error(error);
  }

  return { expressions, conjunction: conjunction.trim() };
};
