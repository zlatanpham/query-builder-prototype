import { render } from 'react-dom';
import { QueryBuilder } from './components/QueryBuilder';
import { schema } from './schema';
import './index.css';
import { useState } from 'react';
import { Box, Button, ButtonGroup, Code, Flex } from '@sajari-ui/core';

const Result = ({ textExpression }: { textExpression: string }) => {
  return (
    <Code
      theme="dark"
      language="bash"
      margin="mt-10"
      value={textExpression}
      showCopyButton={false}
      flex="flex-1"
      wrap={true}
    />
  );
};

const App = () => {
  const [query, setQuery] = useState('');
  const [condensed, setConsdensed] = useState(true);

  return (
    <Flex flexDirection="flex-col">
      <Flex
        justifyContent="justify-center"
        padding="p-3"
        borderWidth="border-b"
        borderColor="border-gray-200"
        backgroundColor="bg-white"
      >
        <ButtonGroup attached>
          <Button
            appearance={!condensed ? 'primary' : undefined}
            onClick={() => setConsdensed(false)}
            width="w-32"
          >
            Inline
          </Button>
          <Button
            width="w-32"
            appearance={condensed ? 'primary' : undefined}
            onClick={() => setConsdensed(true)}
          >
            Condensed
          </Button>
        </ButtonGroup>
      </Flex>
      {condensed ? (
        <Flex>
          <Box
            height="h-screen"
            borderWidth="border-r"
            padding="p-5"
            width="w-96"
            borderColor="border-gray-200"
            backgroundColor="bg-white"
          >
            <QueryBuilder
              schema={schema}
              value={query}
              onChange={setQuery}
              condensed
              condensedPlaceholder="Click to edit"
            />
          </Box>
        </Flex>
      ) : (
        <Box
          padding={['p-10', 'pt-20']}
          maxWidth="max-w-7xl"
          margin="mx-auto"
          width="w-full"
        >
          <QueryBuilder schema={schema} value={query} onChange={setQuery} />
          <Result textExpression={query} />
        </Box>
      )}
    </Flex>
  );
};

render(<App />, document.getElementById('root'));
