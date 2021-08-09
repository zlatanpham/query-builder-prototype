import { Box, Code } from '@sajari-ui/core';

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
