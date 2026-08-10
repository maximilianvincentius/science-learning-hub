require('dotenv').config();

const config = {
  host: process.env.SERVICE_HOST,
  port: process.env.SERVICE_PORT,
  resources: {
    collection: process.env.DB_COLLECTION,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    cluster: process.env.DB_CLUSTER,
  },
  protocol: process.env.PROTOCOL,
  seederActive: process.env.SEEDER_ACTIVE || false,
  publicKey: process.env.JWTAUTH_PUBLICKEY,
  awsAccessKey: process.env.AWS_ACCESS_KEY_ID,
  awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  awsRegion: process.env.AWS_REGION,
  whitelistedOrigins: process.env.WHITELISTED_ORIGINS,
};

export default config;
