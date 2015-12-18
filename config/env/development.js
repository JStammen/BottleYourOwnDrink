'use strict';

module.exports = {
  db: 'mongodb://' + (process.env.DB_PORT_27017_TCP_ADDR || 'localhost') + '/byod-dev',
  debug: true,
  logging: {
    format: 'tiny'
  },
  //  aggregate: 'whatever that is not false, because boolean false value turns aggregation off', //false
  aggregate: false,
  mongoose: {
    debug: false
  },
  app: {
    name: 'BYOD - Bottle your own Drink'
  },
  facebook: {
    clientID: '1601111536767519',
    clientSecret: '1fcd55b0ba8237f8f5079054d12f8127',
    callbackURL: 'http://localhost:3000/auth/facebook/callback'
  },
  twitter: {
    clientID: '1601111536767519',
    clientSecret: '1fcd55b0ba8237f8f5079054d12f8127',
    callbackURL: 'http://localhost:3000/auth/twitter/callback'
  },
  github: {
    clientID: 'DEFAULT_APP_ID',
    clientSecret: 'APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/github/callback'
  },
  google: {
    clientID: 'DEFAULT_APP_ID',
    clientSecret: 'APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  linkedin: {
    clientID: 'DEFAULT_API_KEY',
    clientSecret: 'SECRET_KEY',
    callbackURL: 'http://localhost:3000/auth/linkedin/callback'
  },
  emailFrom: 'bottleyourowndrink@gmail.com', // sender address like ABC <abc@example.com>
  mailer: {
    service: 'Gmail', // Gmail, SMTP
    auth: {
      user: 'bottleyourowndrink@gmail.com',
      pass: 'Banaan@123'
    }
  }
};
