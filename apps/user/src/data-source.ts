import { DataSource } from 'typeorm';
import {config} from 'dotenv';
import * as path from 'path';


const __dirname = path.resolve();

config();


import { DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  database: process.env.DB_NAME,
  entities: [path.join(__dirname, './src/**/*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, './src/migrations/*{.ts,.js}')],
  logging: true,
  synchronize: false,
};



export const datasource = new DataSource(dataSourceOptions);

