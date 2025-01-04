import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ClassService } from './class.service';
import { Class } from './class.entity';
import { CreateClassInput } from './dto/create-class.input';
import { UpdateClassInput } from './dto/update-class.input';
import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { NameInput } from 'src/common/dto/name.input';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CustomExceptionFilter } from 'src/common/exceptions/custom-exception.filter';
import { RoleGuard } from 'src/common/guards/role.guard';
import { CustomValidationPipe } from 'src/common/pipes/custom-validation.pipe';
import { IdInput } from 'src/common/dto/id.input';

@Resolver(() => Class)
@UseFilters(CustomExceptionFilter)
@UseGuards(RoleGuard)
@Roles('principal')
export class ClassResolver {
  constructor(private readonly classService: ClassService) {}

  @Query(() => [Class], { name: 'classes' })
  @Roles('teacher')
  @UsePipes(CustomValidationPipe)
  async getClasses() {
    try {
      const data = this.classService.findAll();
      return data;
    } catch (error) {
      throw error;
    }
  }

  @Query(() => [Class], { name: 'classesByName' })
  @Roles('teacher')
  @UsePipes(CustomValidationPipe)
  async getClassesByName(@Args('nameInput') { keyword }: NameInput) {
    try {
      const data = this.classService.findByName(keyword);
      return data;
    } catch (error) {
      throw error;
    }
  }

  @Query(() => Class, { name: 'class' })
  @Roles('teacher')
  @UsePipes(CustomValidationPipe)
  async getClass(@Args('idInput', new CustomValidationPipe()) { id }: IdInput) {
    try {
      const data = this.classService.findOne(id);
      return data;
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => Class)
  @UsePipes(CustomValidationPipe)
  async createClass(
    @Args('createClassInput')
    createClassInput: CreateClassInput,
  ) {
    try {
      const data = this.classService.create(createClassInput);
      return data;
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => Class)
  @UsePipes(CustomValidationPipe)
  async updateClass(
    @Args('updateClassInput') updateClassInput: UpdateClassInput,
  ) {
    try {
      const data = this.classService.update(updateClassInput);
      return data;
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => Class)
  @UsePipes(CustomValidationPipe)
  async removeClass(@Args('idInput') { id }: IdInput) {
    try {
      const data = this.classService.remove(id);
      return data;
    } catch (error) {
      throw error;
    }
  }
}
