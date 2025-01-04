import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassResolver } from './class.resolver';

@Module({
  providers: [ClassService, ClassResolver],
  exports: [ClassService],
})
export class ClassModule {}
