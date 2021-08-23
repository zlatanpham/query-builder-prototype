import { SchemaFieldType } from '../../../schema';
import {
  advancedOperatorMapping,
  Field,
  FieldOption,
  GroupMenu,
  groupOperatorOptions,
  Item,
  JoinOperator,
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
    .find((field) => expressionString.startsWith(field.text))?.text;
  return field
    ? { itemValue: field, isError: false, error: '' }
    : {
        itemValue: '',
        isError: true,
        error: `field error at ${expressionString}`,
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
        error: `operator error at ${expressionString}`,
      };
};

const getValue = (expressionString: string) => {
  const valueWrapper = expressionString.startsWith('[') ? ']' : "'";
  const value = expressionString.slice(
    0,
    expressionString.indexOf(valueWrapper, 1) + 1,
  );
  return value
    ? { itemValue: value, isError: false, error: '' }
    : {
        itemValue: '',
        isError: true,
        error: `value error at ${expressionString}`,
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
  let conjunction = '';
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
        error = `field ${field} not matched at ${expressionString}`;
        break;
      }
    } else if (index % 3 === 1) {
      if (!operator) {
        operator = itemValue;
      } else if (operator !== itemValue) {
        isError = true;
        error = `operator ${operator} not matched at ${expressionString}`;
        break;
      }
    } else {
      value.push(convertValue(itemValue));
      if (index === 2) {
        conjunction = temp.startsWith('AND')
          ? 'AND'
          : temp.startsWith('OR')
          ? 'OR'
          : '';
      } else if (!conjunction) {
        isError = true;
        error = 'conjunction not found';
        break;
      } else if (temp && !temp.startsWith(conjunction)) {
        isError = true;
        error = `conjunction ${conjunction} not matched at ${temp}`;
        break;
      }
      temp = temp.replace(conjunction, '').trimStart();
    }
    index += 1;
  }
  return { field, operator: operator + conjunction, value, isError, error };
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
  const result: string[] = [];
  let temp = expressionString.trim();
  let index = 0;
  let isError = false;
  let error = '';
  let conjunction = '';
  while (temp) {
    if (temp.startsWith('(')) {
      const toIndex = findClosingBracket(temp);
      if (!toIndex) {
        isError = true;
        error = `closing bracket not found at ${temp}`;
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
      // FIXME:
      // @ts-ignore
      result.push(field, operator, value);
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
        conjunction = temp.startsWith('AND')
          ? 'AND'
          : temp.startsWith('OR')
          ? 'OR'
          : '';
      } else if (!conjunction) {
        isError = true;
        error = 'conjunction not found';
        break;
      } else if (temp && !temp.startsWith(conjunction)) {
        isError = true;
        error = 'conjunction not matched';
        break;
      }
      temp = temp.replace(conjunction, '').trimStart();
    }
    index += 1;
  }

  return { conjunction, result, isError, error };
};

export const stringParser = (
  expressionString: string,
  groupFieldOptions: GroupMenu<FieldOption>[],
) => {
  let isError = false;
  let error = '';
  const expressions: Item[] = [];

  const {
    conjunction,
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
    if (o) {
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
    }
    // check value
    if (v) {
      if (isBooleanSelect && v !== 'TRUE' && v !== 'FALSE') {
        isError = true;
        error = `value ${v} is only able to be TRUE or FALSE`;
        break;
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

    const value: Value | undefined = !v
      ? undefined
      : Array.isArray(v)
      ? {
          type: 'value',
          value: v,
          field: f,
          fieldType: fieldType as SchemaFieldType,
          component: 'tags',
          isArray,
        }
      : {
          type: 'value',
          value: v,
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

  return { expressions, joinOperator: (conjunction || 'AND') as JoinOperator };
};
