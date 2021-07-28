import { Box, Code } from '@sajari-ui/core';
import { useContextProvider } from '../ContextProvider';
import { Item, Operator } from '../shared';

export const Result = () => {
  const { items, joinOperator } = useContextProvider();

  const getValue = () => {
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
          valueItem?.value ? `'${valueItem?.value}'` : undefined,
        ].join(' ');
        result.push(exp);
      }
    }
    return result.join(` ${joinOperator} `);
  };

  return (
    <Box padding="p-10" maxWidth="max-w-7xl" margin="mx-auto">
      <Code
        theme="dark"
        language="bash"
        value={getValue()}
        showCopyButton={false}
        flex="flex-1"
        wrap={true}
      />
    </Box>
  );
};
