import { BasePropertyProps, RecordJSON } from "adminjs";

export const getRecordImagePath = (
  record: RecordJSON,
  fileField: string,
  key: string,
  baseUrl: string
) => `${baseUrl}${record.populated[fileField]!.params[key]}`;

export const isEmptyObject = <T extends object>(object: T): boolean =>
  Object.keys(object).length === 0;

export type CustomProps<T extends BasePropertyProps, C> = T & {
  property: Omit<T["property"], "custom"> & { custom: C };
};
