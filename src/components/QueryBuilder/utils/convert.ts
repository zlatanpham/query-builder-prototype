import { SchemaField } from '../../../schema';
import {
  advancedOperatorMapping,
  FieldOption,
  Item,
  numberTypes,
  Operator,
  operatorMapping,
} from '../shared';

export function filterObjectToString(items: Item[], joinOperator: string) {
  const result: string[] = [];
  for (let index = 0; index < items.length; index += 3) {
    const fieldItem: Item | undefined = items[index];
    const operatorItem: Operator | undefined = items[index + 1] as Operator;
    const valueItem: Item | undefined = items[index + 2];
    if (valueItem && Array.isArray(valueItem.value)) {
      const exp = valueItem.value
        .map((value) => {
          let v = numberTypes.includes(fieldItem.fieldType)
            ? value
            : `'${value}'`;

          if (fieldItem.isArray) {
            v = `[${v}]`;
          }

          return [fieldItem?.value, operatorItem?.value, v].join(' ');
        })
        .join(` ${operatorItem.advancedJoinOperator} `);
      result.push(`(${exp})`);
    } else {
      const value = valueItem?.value
        ? numberTypes.includes(valueItem?.fieldType)
          ? valueItem?.value
          : `'${valueItem?.value}'`
        : undefined;

      const exp = [
        fieldItem?.value,
        operatorItem?.value,
        valueItem?.isArray ? `[${value}]` : value,
      ].join(' ');
      result.push(exp);
    }
  }
  return result.join(` ${joinOperator} `).trim();
}

export function getExpression(items: Item[], index: number) {
  const field = items[index - 1];
  const operator = items[index];
  const value = items[index + 1];

  if (
    operator.type === 'operator' &&
    operator.isAdvanced &&
    Array.isArray(value.value)
  ) {
    const operatorText =
      advancedOperatorMapping[
        `${operator.value}${operator.advancedJoinOperator}`
      ];

    if (value.value.length === 0) {
      return `${field.value} ${operatorText} `;
    }

    return `${field.value} ${operatorText} ${value.value
      .map((v) => (numberTypes.includes(field.fieldType) ? v : `'${v}'`))
      .join(', ')}`;
  }

  return `${field.value} ${
    operatorMapping[operator.value as keyof typeof operatorMapping]
  } ${
    numberTypes.includes(field.fieldType) ? value.value : `'${value.value}'`
  }`;
}

export function schemaToFieldOptions(schema: SchemaField[]): FieldOption[] {
  return schema.map(({ Name, Type, Repeated }) => ({
    text: Name,
    value: Name,
    type: Type,
    isArray: Repeated,
  }));
}
