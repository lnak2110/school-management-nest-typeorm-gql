import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { ClassModule } from 'src/class/class.module';
import { StudentResolver } from './student.resolver';

@Module({
  imports: [ClassModule],
  providers: [StudentService, StudentResolver],
})
export class StudentModule {}
