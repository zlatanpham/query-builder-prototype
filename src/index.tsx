import { render } from 'react-dom';
import { QueryBuilder } from './components/QueryBuilder';
import { groupFieldOptions } from './components/QueryBuilder/shared';
import './index.css';

render(
  <QueryBuilder groupFieldOptions={groupFieldOptions} />,
  document.getElementById('root'),
);
