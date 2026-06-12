import 'dotenv/config';

const config = {
  datasource: {
    db: {
      provider: 'mysql',
      url: process.env.DATABASE_URL,
    },
  },
};

export default config;
