import { excludeKeys } from '@helpers/object';
import { TypeCheck, TypeCompiler } from '@sinclair/typebox/compiler';

import { headersToObject } from '@helpers/request';
import { NextResponse } from 'next/server';
import { Record, TSchema } from '@sinclair/typebox';
import { ValueError } from '@sinclair/typebox/value';

const validationFields = ['headers', 'body', 'query', 'params', 'cookie'];

type ValidationSchema = Record<
  'headers' | 'body' | 'query' | 'params' | 'cookie',
  TSchema
>;

type ValidationErrorsResponse = Record<string, { errors: Array<ValueError> }>;

export default function withValidation<T = unknown>(
  handler: NextVoidHandler<T>,
  schema: Partial<ValidationSchema>,
): NextHandler<unknown | void> {
  const validateParamsArrayEntries = Object.entries(schema)
    .filter(([schemaKey]) => validationFields.includes(schemaKey))
    .map(([validateKey, validateSchema]) => [
      validateKey,
      TypeCompiler.Compile(validateSchema),
    ]);

  /** @type {Record<keyof ValidationSchema, TypeCheck<import('@sinclair/typebox').TSchema>>} */
  let validateParams = {};

  if (validateParamsArrayEntries.length !== 0)
    validateParams = Object.fromEntries(validateParamsArrayEntries);

  return async (req: Request, res: NextResponse<T>) => {
    const { json, headers, url } = req;

    const { searchParams: reqQuery } = new URL(url);
    const params = await (
      res as NextResponse<T> & { params: Record<string, string> }
    ).params;

    const requestParams: Record<string, unknown> = {
      body: await json(),
      query: Object.fromEntries(reqQuery),
      headers: headersToObject(headers),
      params,
      cookie: '',
    };

    // run validation
    const validationErrors: ValidationErrorsResponse = {};

    if (Object.keys(validateParams).length !== 0) {
      Object.entries(
        validateParams as Record<string, TypeCheck<TSchema>>,
      ).forEach(([validateKey, validate]) => {
        const currentRequestParam = requestParams[validateKey];

        const isValidate = validate.Check(currentRequestParam);

        if (!isValidate)
          validationErrors[validateKey] = {
            errors: [...validate.Errors(currentRequestParam)],
          };
      });
    }
    if (Object.keys(validationErrors).length !== 0) {
      const errorJSON: Record<string, Array<ValueError>> = {};

      Object.entries(validationErrors).forEach(([erroredField, errorsData]) => {
        const { errors } = errorsData;

        const finalErrors = errors.map(errorObject => {
          return excludeKeys(errorObject, ['type', 'schema']);
        });

        errorJSON[erroredField] = finalErrors;
      });

      return NextResponse.json(errorJSON, {
        status: 400,
      });
    }

    return await handler(req, res);
  };
}
