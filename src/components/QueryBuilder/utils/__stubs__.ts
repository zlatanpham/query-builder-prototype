import { FieldOption, GroupMenu } from '../shared';

export const groupFieldOptions: GroupMenu<FieldOption>[] = [
  {
    title: 'Params',
    items: [
      { text: 'q', value: 'q', isArray: false, type: 'STRING' },
      { text: 'page', value: 'page', isArray: false, type: 'INTEGER' },
    ],
  },
  {
    title: 'Fields',
    items: [
      { text: 'image', value: 'image', isArray: false, type: 'STRING' },
      { text: 'category', value: 'category', isArray: false, type: 'STRING' },
      { text: 'brand', value: 'brand', isArray: true, type: 'STRING' },
      { text: 'price', value: 'price', isArray: false, type: 'FLOAT' },
      { text: 'onSale', value: 'onSale', isArray: false, type: 'BOOLEAN' },
      {
        text: 'collection_ids',
        value: 'collection_ids',
        isArray: true,
        type: 'FLOAT',
      },
      {
        text: 'collection_titles',
        value: 'collection_titles',
        isArray: true,
        type: 'STRING',
      },
      {
        text: 'createdAt',
        value: 'createdAt',
        isArray: false,
        type: 'TIMESTAMP',
      },
    ],
  },
];
