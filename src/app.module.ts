import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsModule } from './tags/tags.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRESQL_DB_HOST,
      port: Number(process.env.POSTGRESQL_DB_PORT),
      username: process.env.POSTGRESQL_DB_USERNAME,
      password: process.env.POSTGRESQL_DB_PASSWORD,
      database: process.env.POSTGRESQL_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TagsModule,
    TasksModule,
  ],
})
export class AppModule {}
