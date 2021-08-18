export type SchemaFieldMode = 'UNIQUE' | 'NULLABLE';

export type SchemaFieldType =
  | 'STRING'
  | 'INTEGER'
  | 'FLOAT'
  | 'DOUBLE'
  | 'BOOLEAN'
  | 'TIMESTAMP';

interface FieldIndex {
  Description: string;
  Spec: string;
}

export interface SchemaField {
  Name: string;
  Description: string;
  Type: SchemaFieldType;
  Mode: SchemaFieldMode;
  Repeated: boolean;
  Indexes: null | FieldIndex[];
}

export const schema: SchemaField[] = [
  {
    Name: '_id',
    Description: 'Unique identifier.',
    Type: 'STRING',
    Mode: 'UNIQUE',
    Repeated: false,
    Indexes: null,
  },
  {
    Name: 'body_html',
    Description: '',
    Type: 'STRING',
    Mode: 'NULLABLE',
    Repeated: false,
    Indexes: [
      {
        Spec: 'split=std,stop=en,stem=en',
        Description: '',
      },
    ],
  },
  {
    Name: 'collection_ids',
    Description: '',
    Type: 'INTEGER',
    Mode: 'NULLABLE',
    Repeated: true,
    Indexes: null,
  },
  {
    Name: 'collection_titles',
    Description: '',
    Type: 'STRING',
    Mode: 'NULLABLE',
    Repeated: true,
    Indexes: [
      {
        Spec: 'split=std,stop=en,stem=en',
        Description: '',
      },
      {
        Spec: '',
        Description: '',
      },
    ],
  },
  {
    Name: 'created_at',
    Description: '',
    Type: 'TIMESTAMP',
    Mode: 'NULLABLE',
    Repeated: false,
    Indexes: null,
  },
  {
    Name: 'handle',
    Description: '',
    Type: 'STRING',
    Mode: 'NULLABLE',
    Repeated: false,
    Indexes: null,
  },
  {
    Name: 'id',
    Description: '',
    Type: 'INTEGER',
    Mode: 'UNIQUE',
    Repeated: false,
    Indexes: null,
  },
  {
    Name: 'image_height',
    Description: '',
    Type: 'INTEGER',
    Mode: 'NULLABLE',
    Repeated: false,
    Indexes: null,
  },
  {
    Name: 'image_heights',
    Description: '',
    Type: 'INTEGER',
    Mode: 'NULLABLE',
    Repeated: true,
    Indexes: null,
  },
  {
    Name: 'image_ids',
    Description: '',
    Type: 'INTEGER',
    Mode: 'NULLABLE',
    Repeated: true,
    Indexes: null,
  },
  {
    Name: 'image_tags',
    Description: '',
    Type: 'STRING',
    Mode: 'NULLABLE',
    Repeated: true,
    Indexes: [
      {
        Spec: 'split=std,stop=en,stem=en',
        Description: '',
      },
      {
        Spec: '',
        Description: '',
      },
    ],
  },
  {
    Name: 'image_url',
    Description: '',
    Type: 'STRING',
    Mode: 'NULLABLE',
    Repeated: false,
    Indexes: null,
  },
  {
    Name: 'image_urls',
    Description: '',
    Type: 'STRING',
    Mode: 'NULLABLE',
    Repeated: true,
    Indexes: null,
  },
  {
    Name: 'image_width',
    Description: '',
    Type: 'INTEGER',
    Mode: 'NULLABLE',
    Repeated: false,
    Indexes: null,
  },
  {
    Name: 'image_widths',
    Description: '',
    Type: 'INTEGER',
    Mode: 'NULLABLE',
    Repeated: true,
    Indexes: null,
  },
  {
    Name: 'inventory_quantity',
    Description: '',
    Type: 'INTEGER',
    Mode: 'NULLABLE',
    Repeated: false,
    Indexes: null,
  },
  {
    Name: 'max_price',
    Description: '',
    Type: 'DOUBLE',
    Mode: 'NULLABLE',
    Repeated: false,
    Indexes: null,
  },
  {
    Name: 'min_price',
    Description: '',
    Type: 'DOUBLE',
    Mode: 'NULLABLE',
    Repeated: false,
    Indexes: null,
  },
  {
    Name: 'option_color',
    Description: '',
    Type: 'STRING',
    Mode: 'NULLABLE',
    Repeated: true,
    Indexes: null,
  },
  {
    Name: 'option_material',
    Description: '',
    Type: 'STRING',
    Mode: 'NULLABLE',
    Repeated: true,
    Indexes: null,
  },
  {
    Name: 'option_scent',
    Description: '',
    Type: 'STRING',
    Mode: 'NULLABLE',
    Repeated: true,
    Indexes: null,
  },
  {
    Name: 'option_size',
    Description: '',
    Type: 'STRING',
    Mode: 'NULLABLE',
    Repeated: true,
    Indexes: null,
  },
  {
    Name: 'option_title',
    Description: '',
    Type: 'STRING',
    Mode: 'NULLABLE',
    Repeated: true,
    Indexes: null,
  },
  {
    Name: 'product_type',
    Description: '',
    Type: 'STRING',
    Mode: 'NULLABLE',
    Repeated: false,
    Indexes: [
      {
        Spec: 'split=std,stop=en,stem=en',
        Description: '',
      },
    ],
  },
  {
    Name: 'published_at',
    Description: '',
    Type: 'TIMESTAMP',
    Mode: 'NULLABLE',
    Repeated: false,
    Indexes: null,
  },
  {
    Name: 'published_scope',
    Description: '',
    Type: 'STRING',
    Mode: 'NULLABLE',
    Repeated: false,
    Indexes: null,
  },
  {
    Name: 'requires_shipping',
    Description: '',
    Type: 'BOOLEAN',
    Mode: 'NULLABLE',
    Repeated: false,
    Indexes: null,
  },
  {
    Name: 'status',
    Description: '',
    Type: 'STRING',
    Mode: 'NULLABLE',
    Repeated: false,
    Indexes: null,
  },
  {
    Name: 'tags',
    Description: '',
    Type: 'STRING',
    Mode: 'NULLABLE',
    Repeated: true,
    Indexes: [
      {
        Spec: 'split=std,stop=en,stem=en',
        Description: '',
      },
    ],
  },
  {
    Name: 'taxable',
    Description: '',
    Type: 'BOOLEAN',
    Mode: 'NULLABLE',
    Repeated: false,
    Indexes: null,
  },
  {
    Name: 'template_suffix',
    Description: '',
    Type: 'STRING',
    Mode: 'NULLABLE',
    Repeated: false,
    Indexes: null,
  },
  {
    Name: 'title',
    Description: '',
    Type: 'STRING',
    Mode: 'NULLABLE',
    Repeated: false,
    Indexes: [
      {
        Spec: 'split=std,stop=en,stem=en',
        Description: '',
      },
    ],
  },
  {
    Name: 'updated_at',
    Description: '',
    Type: 'TIMESTAMP',
    Mode: 'NULLABLE',
    Repeated: false,
    Indexes: null,
  },
  {
    Name: 'variant_compare_at_prices',
    Description: '',
    Type: 'DOUBLE',
    Mode: 'NULLABLE',
    Repeated: true,
    Indexes: null,
  },
  {
    Name: 'variant_ids',
    Description: '',
    Type: 'INTEGER',
    Mode: 'NULLABLE',
    Repeated: true,
    Indexes: null,
  },
  {
    Name: 'variant_image_ids',
    Description: '',
    Type: 'INTEGER',
    Mode: 'NULLABLE',
    Repeated: true,
    Indexes: null,
  },
  {
    Name: 'variant_options_1',
    Description: '',
    Type: 'STRING',
    Mode: 'NULLABLE',
    Repeated: true,
    Indexes: [
      {
        Spec: 'split=std,stop=en,stem=en',
        Description: '',
      },
    ],
  },
  {
    Name: 'variant_options_1_in_stock',
    Description: '',
    Type: 'STRING',
    Mode: 'NULLABLE',
    Repeated: true,
    Indexes: null,
  },
  {
    Name: 'variant_options_2',
    Description: '',
    Type: 'STRING',
    Mode: 'NULLABLE',
    Repeated: true,
    Indexes: [
      {
        Spec: 'split=std,stop=en,stem=en',
        Description: '',
      },
    ],
  },
  {
    Name: 'variant_options_2_in_stock',
    Description: '',
    Type: 'STRING',
    Mode: 'NULLABLE',
    Repeated: true,
    Indexes: null,
  },
  {
    Name: 'variant_options_3',
    Description: '',
    Type: 'STRING',
    Mode: 'NULLABLE',
    Repeated: true,
    Indexes: [
      {
        Spec: 'split=std,stop=en,stem=en',
        Description: '',
      },
    ],
  },
  {
    Name: 'variant_options_3_in_stock',
    Description: '',
    Type: 'STRING',
    Mode: 'NULLABLE',
    Repeated: true,
    Indexes: null,
  },
  {
    Name: 'variant_positions',
    Description: '',
    Type: 'INTEGER',
    Mode: 'NULLABLE',
    Repeated: true,
    Indexes: null,
  },
  {
    Name: 'variant_prices',
    Description: '',
    Type: 'DOUBLE',
    Mode: 'NULLABLE',
    Repeated: true,
    Indexes: null,
  },
  {
    Name: 'variant_quantities',
    Description: '',
    Type: 'INTEGER',
    Mode: 'NULLABLE',
    Repeated: true,
    Indexes: null,
  },
  {
    Name: 'variant_skus',
    Description: '',
    Type: 'STRING',
    Mode: 'NULLABLE',
    Repeated: true,
    Indexes: null,
  },
  {
    Name: 'variant_tax_codes',
    Description: '',
    Type: 'STRING',
    Mode: 'NULLABLE',
    Repeated: true,
    Indexes: null,
  },
  {
    Name: 'variant_titles',
    Description: '',
    Type: 'STRING',
    Mode: 'NULLABLE',
    Repeated: true,
    Indexes: [
      {
        Spec: 'split=std,stop=en,stem=en',
        Description: '',
      },
    ],
  },
  {
    Name: 'variant_titles_in_stock',
    Description: '',
    Type: 'STRING',
    Mode: 'NULLABLE',
    Repeated: true,
    Indexes: null,
  },
  {
    Name: 'variant_weights',
    Description: '',
    Type: 'DOUBLE',
    Mode: 'NULLABLE',
    Repeated: true,
    Indexes: null,
  },
  {
    Name: 'vendor',
    Description: '',
    Type: 'STRING',
    Mode: 'NULLABLE',
    Repeated: false,
    Indexes: [
      {
        Spec: 'split=std,stop=en,stem=en',
        Description: '',
      },
    ],
  },
];
