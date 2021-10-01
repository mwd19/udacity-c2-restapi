import {Sequelize} from 'sequelize-typescript';
import { config } from './config/config';


const c = config.dev;

// console.log("MWD");
// console.log(c.username);
// console.log(c.password);
// console.log(c.database);
// console.log(c.host);
// console.log(c.aws_region);
// console.log(c.aws_profile);
// console.log(c.aws_media_bucket);


// Instantiate new Sequelize instance!
export const sequelize = new Sequelize({
  "username": c.username,
  "password": c.password,
  "database": c.database,
  "host":     c.host,

  dialect: 'postgres',
  storage: ':memory:',
});

