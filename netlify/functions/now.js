exports.handler = async () => {
  const now = new Date();

  // Formata como: 2025-07-01 14:23:45
  const formatted = now.toISOString().replace('T', ' ').substring(0, 19);

  return {
    statusCode: 200,
    body: `Now is: ${formatted}`
  };
};
