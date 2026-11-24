import { envSchema } from './env.schema.js';

const required = {
  DB_USERNAME: 'app',
  DB_PASSWORD: 'app',
  DB_DATABASE: 'app',
};

describe('envSchema', () => {
  it('applies defaults and coerces numbers', () => {
    const env = envSchema.parse({ ...required, DB_PORT: '3307' });

    expect(env).toMatchObject({
      NODE_ENV: 'development',
      PORT: 3000,
      DB_HOST: 'localhost',
      DB_PORT: 3307,
    });
  });

  it('rejects missing database credentials', () => {
    const result = envSchema.safeParse({});

    expect(result.success).toBe(false);
    expect(result.error?.issues.map((i) => i.path[0])).toEqual(
      expect.arrayContaining(['DB_USERNAME', 'DB_PASSWORD', 'DB_DATABASE']),
    );
  });

  it('rejects a non-numeric port', () => {
    expect(envSchema.safeParse({ ...required, DB_PORT: 'abc' }).success).toBe(
      false,
    );
  });
});
