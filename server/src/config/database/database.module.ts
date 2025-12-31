import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import dayjs from 'dayjs';
import { RequestContext } from 'nestjs-request-context';
import { join } from 'path';

export const IGCAMPANHAS_DB_CONNECTION_NAME = 'igcampanhas';
export const IGCAMPANHAS_DB_CONNECTION = IGCAMPANHAS_DB_CONNECTION_NAME + 'Connection';
@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: () => ({
        dialect: 'mariadb',
        host: process.env.DB_HOST,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        timezone: process.env.APP_TIMEZONE,
        logging: process.env.NODE_ENV !== 'production' ? console.log : false,
        models: [join(__dirname, '../../models/*.model{.ts,.js}')],

        sincronize: process.env.NODE_ENV !== 'production' || false,

        autoLoadModels: false,
        dialectOptions: {
          connectTimeout: 15000,
          options: {
            useUTC: false,
            requestTimeout: 30000,

          },
          typeCast(field: any, next: any) {
            if (['DATE', 'DATETIME'].includes(field.type)) {
              return field.string();
            } else if (field.type === 'NEWDECIMAL') {
              return field.float();
            }

            return next();
          },
        },
        pool: {
          max: 20,
          min: 5,
          acquire: 30000,
          idle: 10000,
        },
        define: {
          defaultScope: {
            attributes: {
              exclude: ['createdBy', 'createdAt', 'updatedBy', 'updatedAt', 'deletedBy', 'deletedAt'],
            },
          },
          updatedAt: false,
          timestamps: false,
          underscored: true,
          paranoid: true,
          freezeTableName: true,
        },
        hooks: {
          beforeCreate(instances) {
            const req: any = RequestContext.currentContext ? RequestContext.currentContext.req : {};
            const loginAuth = req.user ? req.user.login : null;
            const loginHeader = req.headers ? req.headers['x-login'] : null;

            instances.dataValues.createdBy = loginHeader || loginAuth;
          },
          beforeBulkDestroy(options: any) {
            options.individualHooks = true;
          },
          beforeBulkUpdate(options) {
            options.individualHooks = true;
          },
          beforeDestroy(instances, { transaction }) {
            const req: any = RequestContext.currentContext ? RequestContext.currentContext.req : {};
            const loginAuth = req.user ? req.user.login : null;
            const loginHeader = req.headers ? req.headers['x-login'] : null;

            instances
              .update(
                {
                  deletedBy: loginHeader || loginAuth,
                  // deletedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                },
                { transaction }
              )
              .catch((err) => {
                console.error('Erro ao atualizar o registro:', err);
              });
          },
          beforeUpdate(instances, options) {
            const req: any = RequestContext.currentContext ? RequestContext.currentContext.req : {};

            const loginAuth = req.user ? req.user.login : null;
            const loginHeader = req.headers ? req.headers['x-login'] : null;

            instances.dataValues.updatedBy = loginHeader || loginAuth;
            instances.dataValues.updatedAt = dayjs().format('YYYY-MM-DD HH:mm:ss.SSS');

            options?.fields?.push('updatedBy', 'updatedAt');
          },
        },
      }),
    }),
  ],
})
export class DatabaseModule {}
