import { Box, Code } from '@sajari-ui/core';

export const Result = ({ textExpression }: { textExpression: string }) => {
  return (
    <Box margin="mt-10">
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
