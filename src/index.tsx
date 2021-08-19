import { render } from 'react-dom';
import { QueryBuilder } from './components/QueryBuilder';
import { schema } from './schema';
import './index.css';
import { useState } from 'react';
import { Box, Code } from '@sajari-ui/core';

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

  return (
    <Box padding={['p-10', 'pt-20']} maxWidth="max-w-7xl" margin="mx-auto">
      <QueryBuilder schema={schema} value={query} onChange={setQuery} />
      <Result textExpression={query} />
    </Box>
  );
};

render(<App />, document.getElementById('root'));
