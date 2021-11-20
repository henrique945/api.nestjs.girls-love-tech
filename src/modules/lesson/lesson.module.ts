import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthTokenModule } from '../auth/auth-token.module';
import { CourseModule } from '../course/course.module';
import { LessonController } from './controllers/lesson.controller';
import { LessonEntity } from './entities/lesson.entity';
import { LessonService } from './services/lesson.service';

@Module({
  imports: [
    AuthTokenModule,
    TypeOrmModule.forFeature([
      LessonEntity,
    ]),
    forwardRef(() => CourseModule),
  ],
  controllers: [
    LessonController,
  ],
  providers: [
    LessonService,
  ],
  exports: [
    LessonService,
  ],
})
export class LessonModule {}
