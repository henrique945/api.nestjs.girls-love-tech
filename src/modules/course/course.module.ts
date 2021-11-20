import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthTokenModule } from '../auth/auth-token.module';
import { LessonModule } from '../lesson/lesson.module';
import { CourseController } from './controllers/course.controller';
import { CourseEntity } from './entities/course.entity';
import { CourseService } from './services/course.service';

@Module({
  imports: [
    AuthTokenModule,
    TypeOrmModule.forFeature([
      CourseEntity,
    ]),
    forwardRef(() => LessonModule),
  ],
  controllers: [
    CourseController,
  ],
  providers: [
    CourseService,
  ],
  exports: [
    CourseService,
  ],
})
export class CourseModule {}
