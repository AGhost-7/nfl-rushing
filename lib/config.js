export default {
  port: Number(process.env.NR_PORT) || 8000,
  db: {
    client: 'pg',
    connection: 'postgresql://postgres@localhost:5432',
    migrations: {
      directory: './lib/migrations',
    },
    seeds: {
      directory: './lib/seeds',
      loadExtensions: ['.cjs', '.js'],
    },
  },
}
