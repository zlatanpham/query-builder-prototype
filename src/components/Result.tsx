import { Box, Code } from '@sajari-ui/core';
import { Item, Operator } from '../shared';

export const objectToString = (items: Item[], joinOperator: string) => {
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
      const exp = [
        fieldItem?.value,
        operatorItem?.value,
        valueItem?.value
          ? ['INTEGER', 'DOUBLE', 'FLOAT'].includes(valueItem?.fieldType)
            ? valueItem?.value
            : `'${valueItem?.value}'`
          : undefined,
      ].join(' ');
      result.push(exp);
    }
  }
  return result.join(` ${joinOperator} `);
};

export const Result = ({ textExpression }: { textExpression: string }) => {
  return (
    <Box padding="p-10" maxWidth="max-w-7xl" margin="mx-auto">
      <Code
        theme="dark"
        language="bash"
        value={textExpression}
        showCopyButton={false}
        flex="flex-1"
        wrap={true}
      />
    </Box>
  );
};
