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
        text: 'createdAt',
        value: 'createdAt',
        isArray: false,
        type: 'TIMESTAMP',
      },
    ],
  },
];
