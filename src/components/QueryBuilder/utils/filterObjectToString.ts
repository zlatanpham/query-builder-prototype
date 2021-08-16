import { Item, numberTypes, Operator } from '../shared';

export const filterObjectToString = (items: Item[], joinOperator: string) => {
  const result: string[] = [];
  for (let index = 0; index < items.length; index += 3) {
    const fieldItem: Item | undefined = items[index];
    const operatorItem: Operator | undefined = items[index + 1] as Operator;
    const valueItem: Item | undefined = items[index + 2];
    if (valueItem && Array.isArray(valueItem.value)) {
      const exp = valueItem.value
        .map((value) =>
          [fieldItem?.value, operatorItem?.value, `'${value}'`].join(' '),
        )
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
};
