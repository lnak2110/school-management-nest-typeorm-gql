import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { NameInput } from 'src/common/dto/name.input';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CustomExceptionFilter } from 'src/common/exceptions/custom-exception.filter';
import { RoleGuard } from 'src/common/guards/role.guard';
import { CustomValidationPipe } from 'src/common/pipes/custom-validation.pipe';
import { CreateStudentInput } from './dto/create-student.input';
import { UpdateStudentInput } from './dto/update-student.input';
import { Student } from './student.entity';
import { StudentService } from './student.service';
import { ClassNameInput } from '../common/dto/class-name.input';
import { IdInput } from 'src/common/dto/id.input';

@Resolver(() => Student)
@UseFilters(CustomExceptionFilter)
@UseGuards(RoleGuard)
@Roles('teacher')
export class StudentResolver {
  constructor(private readonly studentService: StudentService) {}

  @Query(() => [Student], { name: 'students' })
  @Roles('principal')
  async getStudents() {
    try {
      const data = this.studentService.findAll();
      return data;
    } catch (error) {
      throw error;
    }
  }

  @Query(() => [Student], { name: 'studentsByName' })
  @Roles('principal')
  async getStudentsByName(@Args('nameInput') { keyword }: NameInput) {
    try {
      const data = this.studentService.findByName(keyword);
      return data;
    } catch (error) {
      throw error;
    }
  }

  @Query(() => [Student], { name: 'studentsByClassName' })
  @Roles('principal')
  @UsePipes(CustomValidationPipe)
  async getStudentsByClassName(
    @Args('classNameInput') { className }: ClassNameInput,
  ) {
    try {
      const data = this.studentService.findByClassName(className);
      return data;
    } catch (error) {
      throw error;
    }
  }

  @Query(() => Student, { name: 'student' })
  @Roles('principal')
  @UsePipes(CustomValidationPipe)
  async getStudent(@Args('idInput') { id }: IdInput) {
    try {
      const data = this.studentService.findOne(id);
      return data;
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => Student)
  @UsePipes(CustomValidationPipe)
  async createStudent(
    @Args('createStudentInput') createStudentInput: CreateStudentInput,
  ) {
    try {
      const data = this.studentService.create(createStudentInput);
      return data;
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => Student)
  @UsePipes(CustomValidationPipe)
  async updateStudent(
    @Args('updateStudentInput') updateStudentInput: UpdateStudentInput,
  ) {
    try {
      const data = this.studentService.update(updateStudentInput);
      return data;
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => Student)
  @UsePipes(CustomValidationPipe)
  async removeStudent(@Args('idInput') { id }: IdInput) {
    try {
      const data = this.studentService.remove(id);
      return data;
    } catch (error) {
      throw error;
    }
  }
}
