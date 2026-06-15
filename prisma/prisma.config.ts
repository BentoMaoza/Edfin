import 'dotenv/config';

const config = {
  datasource: {
    db: {
      provider: 'sqlite',
      url: process.env.DATABASE_URL,
    },
  },
};

export default config;
