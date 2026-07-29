/**
 * Generic Zod Validation Middleware Factory
 * Usage: validate(loginSchema, 'body')
 *
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @param {'body' | 'params' | 'query'} source - Where to read data from
 */
export function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join('.') || 'unknown',
        message: issue.message,
      }));

      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details,
      });
    }

    // Replace req[source] with parsed (and possibly transformed) data
    req[source] = result.data;
    next();
  };
}
