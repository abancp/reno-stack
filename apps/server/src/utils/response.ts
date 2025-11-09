export function ok<T>(data: T, status = 200) {
  return new Response(JSON.stringify({ data }), {
    status,
    headers: { "Content-type": "application/json" },
  });
}

export function err(message: string, status = 400) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-type": "application/json" },
  });
}
