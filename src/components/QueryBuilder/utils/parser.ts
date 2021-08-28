/* eslint-disable no-loop-func */
import { SchemaFieldType } from '../../../schema';
import {
  advancedOperatorMapping,
  Field,
  FieldOption,
  GroupMenu,
  groupOperatorOptions,
  Item,
  JoinOperator,
  numberTypes,
  Operator,
  operatorMapping,
  Value,
} from '../shared';

type Block = [string, string | undefined, string | string[] | undefined];

const getField = (
  expressionString: string,
  groupFieldOptions: GroupMenu<FieldOption>[],
) => {
  const field = groupFieldOptions
    .map((group) => group.items)
    .flat()
    .find((field) => expressionString.startsWith(field.value))?.value;
  return field
    ? { itemValue: field, isError: false, error: '' }
    : {
        itemValue: '',
        isError: true,
        error: `Field error at ${expressionString}`,
      };
};

const getOperator = (expressionString: string) => {
  const operator =
    Object.keys(advancedOperatorMapping).find((operator) =>
      expressionString.startsWith(operator),
    ) ||
    Object.keys(operatorMapping).find((operator) =>
      expressionString.startsWith(operator),
    );
  return operator
    ? { itemValue: operator, isError: false, error: '' }
    : {
        itemValue: '',
        isError: true,
        error: `Operator error at ${expressionString}`,
      };
};

const getValue = (expressionString: string) => {
  const valueWrapper = expressionString.startsWith('[')
    ? ']'
    : expressionString.startsWith("'")
    ? "'"
    : '';
  const value = valueWrapper
    ? expressionString.slice(0, expressionString.indexOf(valueWrapper, 1) + 1)
    : expressionString.slice(
        0,
        expressionString.indexOf(' ', 1) > -1
          ? expressionString.indexOf(' ', 1)
          : undefined,
      );
  return value
    ? { itemValue: value, isError: false, error: '' }
    : {
        itemValue: '',
        isError: true,
        error: `Value error at ${expressionString}`,
      };
};

const convertValue = (value: string) => {
  let result = value;
  if (result.startsWith("'")) result = result.slice(1, result.length - 1);
  else if (result.startsWith('[')) {
    result = result.slice(1, result.length - 1);
    if (result.startsWith("'")) result = result.slice(1, result.length - 1);
  }
  return result;
};

const handleBracketExpression = (
  expressionString: string,
  groupFieldOptions: GroupMenu<FieldOption>[],
) => {
  let temp = expressionString.trim();
  let field = '';
  let operator = '';
  let value: string[] = [];
  let index = 0;
  let isError = false;
  let error = '';
  let joinOperator = '';
  while (temp) {
    const handler = {
      0: () => getField(temp, groupFieldOptions),
      1: () => getOperator(temp),
      2: () => getValue(temp),
    }[index % 3];
    if (!handler) {
      break;
    }
    const { itemValue, isError: isItemError, error: itemError } = handler();
    temp = temp.replace(itemValue, '').trimStart();
    isError = isError || isItemError;
    error += itemError;
    if (isError) {
      break;
    }
    if (index % 3 === 0) {
      if (!field) {
        field = itemValue;
      } else if (field !== itemValue) {
        isError = true;
        error = `Field ${field} not matched at ${expressionString}`;
        break;
      }
    } else if (index % 3 === 1) {
      if (!operator) {
        operator = itemValue;
      } else if (operator !== itemValue) {
        isError = true;
        error = `Operator ${operator} not matched at ${expressionString}`;
        break;
      }
    } else {
      value.push(convertValue(itemValue));
      if (index === 2) {
        joinOperator = temp.startsWith('AND')
          ? 'AND'
          : temp.startsWith('OR')
          ? 'OR'
          : '';
      } else if (!joinOperator) {
        isError = true;
        error = 'joinOperator not found';
        break;
      } else if (temp && !temp.startsWith(joinOperator)) {
        isError = true;
        error = `joinOperator ${joinOperator} not matched at ${temp}`;
        break;
      }
      temp = temp.replace(joinOperator, '').trimStart();
    }
    index += 1;
  }
  return { field, operator: operator + joinOperator, value, isError, error };
};

const findClosingBracket = (str: string) => {
  let index = 0;
  const stack = ['('];
  for (let i = 1; i < str.length; i += 1) {
    if (str[i] === '(') {
      stack.push(str[i]);
    } else if (str[i] === ')') {
      stack.pop();
    }
    if (stack.length === 0) {
      index = i;
      break;
    }
  }
  return index;
};

const toArray = (
  expressionString: string,
  groupFieldOptions: GroupMenu<FieldOption>[],
) => {
  const result: (string | string[])[] = [];
  let temp = expressionString.trim();
  let index = 0;
  let isError = false;
  let error = '';
  let joinOperator = '';
  while (temp) {
    if (temp.startsWith('(')) {
      const toIndex = findClosingBracket(temp);
      if (!toIndex) {
        isError = true;
        error = `Closing bracket not found at ${temp}`;
        break;
      }
      const bracketExpression = temp.slice(1, toIndex);
      const {
        field,
        operator,
        value,
        isError: isBracketError,
        error: bracketError,
      } = handleBracketExpression(bracketExpression, groupFieldOptions);
      isError = isError || isBracketError;
      error += bracketError;
      if (isError) {
        break;
      }
      [field, operator, value].forEach((itemValue) => {
        result.push(itemValue);
      });
      temp = temp
        .replace('(', '')
        .replace(bracketExpression, '')
        .replace(')', '')
        .trimStart();
      index += 2;
    } else {
      const handler = {
        0: () => getField(temp, groupFieldOptions),
        1: () => getOperator(temp),
        2: () => getValue(temp),
      }[index % 3];
      if (!handler) {
        break;
      }
      const { itemValue, isError: isItemError, error: itemError } = handler();
      result.push(index % 3 === 2 ? convertValue(itemValue) : itemValue);
      temp = temp.replace(itemValue, '').trimStart();
      isError = isError || isItemError;
      error += itemError;
    }
    if (isError) {
      break;
    }
    if (index % 3 === 2) {
      if (index === 2) {
        joinOperator = temp.startsWith('AND')
          ? 'AND'
          : temp.startsWith('OR')
          ? 'OR'
          : '';
      } else if (!joinOperator) {
        isError = true;
        error = 'joinOperator not found';
        break;
      } else if (temp && !temp.startsWith(joinOperator)) {
        isError = true;
        error = 'joinOperator not matched';
        break;
      }
      temp = temp.replace(joinOperator, '').trimStart();
    }
    index += 1;
  }

  return { joinOperator, result, isError, error };
};

export const stringParser = (
  expressionString: string,
  groupFieldOptions: GroupMenu<FieldOption>[],
) => {
  let isError = false;
  let error = '';
  const expressions: Item[] = [];

  const {
    joinOperator,
    result,
    isError: isArrayError,
    error: arrayError,
  } = toArray(expressionString, groupFieldOptions);
  isError = isArrayError || false;
  error += arrayError;

  const blockList: Block[] = [];

  for (let i = 0; i < result.length; i += 3) {
    const block: Block = [
      result[i] as string,
      result[i + 1] as string | undefined,
      result[i + 2] as string | string[] | undefined,
    ];
    blockList.push(block);
  }

  if (!blockList) {
    throw new Error(error);
  }

  for (let index = 0; index < blockList.length; index += 1) {
    const [f, o, v] = blockList[index] || [];
    let internalValue: number | number[] | string | string[] | undefined = v;
    if (!blockList[index] || !f) {
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
      .find((field) => field.value === f) || {};
    const isBooleanSelect = fieldType === 'BOOLEAN';
    const isNumberSelect = numberTypes.includes(fieldType as SchemaFieldType);
    // check field
    if (
      name === undefined ||
      isArray === undefined ||
      fieldType === undefined
    ) {
      isError = true;
      error = `Field '${f}' is not found`;
      break;
    }
    // check operator
    if (o) {
      if (
        !operatorMapping[o as keyof typeof operatorMapping] &&
        !advancedOperatorMapping[o as keyof typeof advancedOperatorMapping]
      ) {
        isError = true;
        error = `Operator '${o}' is not found`;
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
        error = `Operator '${o}' must use with type ${availableTypes}`;
        break;
      }
    }
    // check value
    if (v) {
      if (isBooleanSelect && v !== 'TRUE' && v !== 'FALSE') {
        isError = true;
        error = `Value '${v}' must be TRUE or FALSE`;
        break;
      }

      if (isNumberSelect) {
        if (Array.isArray(v)) {
          if (v.some((each) => isNaN(Number(each)))) {
            isError = true;
            error = `Value '${v}' must be an array of numbers`;
            break;
          } else {
            internalValue = v.map((each) => Number(each));
          }
        } else {
          if (isNaN(Number(v))) {
            isError = true;
            error = `Value '${v}' must be a number`;
            break;
          } else {
            internalValue = Number(v);
          }
        }
      }
    }

    const field: Field = {
      type: 'field',
      value: f,
      fieldType: fieldType as SchemaFieldType,
      isArray,
    };

    const advancedJoinOperator = o?.includes('OR')
      ? 'OR'
      : o?.includes('AND')
      ? 'AND'
      : undefined;

    const operator: Operator | undefined = !o
      ? undefined
      : {
          type: 'operator',
          value: advancedJoinOperator ? o.replace(advancedJoinOperator, '') : o,
          field: f,
          fieldType: fieldType as SchemaFieldType,
          ...(advancedJoinOperator
            ? { isAdvanced: true, advancedJoinOperator }
            : {}),
          isArray,
        };

    const value: Value | undefined = !internalValue
      ? undefined
      : Array.isArray(internalValue)
      ? {
          type: 'value',
          value: internalValue,
          field: f,
          fieldType: fieldType as SchemaFieldType,
          component: 'tags',
          isArray,
        }
      : {
          type: 'value',
          value: internalValue,
          field: f,
          fieldType: fieldType as SchemaFieldType,
          component: isBooleanSelect ? 'boolean' : 'text',
          isArray,
        };

    [field, operator, value].forEach((item) => {
      if (item) {
        expressions.push(item);
      }
    });
  }

  if (isError) {
    throw new Error(error);
  }

  return { expressions, joinOperator: (joinOperator || 'AND') as JoinOperator };
};
