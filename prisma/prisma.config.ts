import 'dotenv/config';

const config = {
  datasource: {
    db: {
      provider: process.env.DATABASE_PROVIDER ?? 'postgresql',
      url: process.env.DATABASE_URL,
    },
  },
};

export default config;
