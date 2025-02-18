import { FormatRegistry, SchemaOptions, Type } from '@sinclair/typebox';

FormatRegistry.Set('email', value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));

const CustomTypes = {
  Numeric: (options: SchemaOptions) =>
    Type.String({
      ...options,
      pattern: '^[0-9]+$',
    }),
};

export default {
  ...Type,
  ...CustomTypes,
};
