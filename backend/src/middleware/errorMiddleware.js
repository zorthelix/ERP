export function notFound(_req, res) {
  return res.status(404).json({ error: 'The requested API route was not found.' });
}

export function errorHandler(error, _req, res, _next) {
  console.error(error);
  if (error.code === '23505') return res.status(409).json({ error: 'That record conflicts with an existing value.' });
  if (error.code === '23503') return res.status(409).json({ error: 'This record cannot be changed because related records exist.' });
  if (error.code === '23514') return res.status(422).json({ error: 'The submitted data violates a business rule.' });
  return res.status(error.status || 500).json({ error: error.expose ? error.message : 'An unexpected server error occurred.' });
}

