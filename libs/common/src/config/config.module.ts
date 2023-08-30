import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
@Module({
  imports: [
    NestConfigModule.forRoot({
      //envFilePath:'./.'
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        // set other env validation rules
      }),
    }),
  ],
})
export class ConfigModule {}
