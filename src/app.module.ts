import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthTokenModule } from './modules/auth/auth-token.module';
import { AuthModule } from './modules/auth/auth.module';
import { CourseModule } from './modules/course/course.module';
import { EnvModule } from './modules/env/env.module';
import { LessonModule } from './modules/lesson/lesson.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    EnvModule,
    AuthModule,
    AuthTokenModule,
    UserModule,
    CourseModule,
    LessonModule,
  ],
  providers: [
    EnvModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {
}
