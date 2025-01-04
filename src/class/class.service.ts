import { Injectable } from '@nestjs/common';
import { CreateClassInput } from './dto/create-class.input';
import { UpdateClassInput } from './dto/update-class.input';
import { Class } from './class.entity';
import { ErrorCodes } from 'src/common/exceptions/error-codes.enum';
import { DataSource, ILike, QueryFailedError } from 'typeorm';
import { CustomException } from 'src/common/exceptions/custom-exception';

@Injectable()
export class ClassService {
  constructor(private dataSource: DataSource) {}

  async create(createClassInput: CreateClassInput): Promise<Class> {
    const classFound = await this.findOneByName(createClassInput.name);
    if (classFound) {
      throw new CustomException(
        ErrorCodes.CONFLICT,
        'Class name already exists',
        {
          field: 'name',
          value: createClassInput.name,
        },
      );
    }

    const result = await this.dataSource.manager.insert(
      Class,
      createClassInput,
    );
    const classCreated = await this.findOne(result.identifiers[0].id);
    return classCreated;
  }

  async findAll(): Promise<Class[]> {
    const classes = await this.dataSource.manager.find(Class, {
      relations: ['students'],
      order: { id: 'ASC' },
    });
    return classes.map((c) => ({ ...c, studentsCount: c.students.length }));
  }

  async findByName(keyword: string): Promise<Class[]> {
    const classes = await this.dataSource.manager.find(Class, {
      where: { name: ILike(`%${keyword}%`) },
      relations: ['students'],
      order: { name: 'ASC' },
    });
    return classes.map((c) => ({ ...c, studentsCount: c.students.length }));
  }

  async findOne(id: number, field: string = 'id'): Promise<Class> {
    const classFound = await this.dataSource.manager.findOne(Class, {
      where: { id },
      relations: ['students'],
    });
    if (!classFound) {
      throw new CustomException(ErrorCodes.NOT_FOUND, 'Class not found', {
        field,
        value: id,
      });
    }
    return classFound;
  }

  async findOneByName(name: string): Promise<Class> {
    return await this.dataSource.manager.findOne(Class, {
      where: { name: ILike(name) },
    });
  }

  async update(updateClassInput: UpdateClassInput): Promise<Class> {
    const { id } = updateClassInput;
    const classToUpdate = await this.findOne(id);
    const classFound = await this.findOneByName(updateClassInput.name);
    if (classFound && classFound.id !== classToUpdate.id) {
      throw new CustomException(
        ErrorCodes.CONFLICT,
        'Class name already exists',
        {
          field: 'name',
          value: updateClassInput.name,
        },
      );
    }

    await this.dataSource.manager.update(Class, id, updateClassInput);
    const classUpdated = await this.findOne(id);
    return classUpdated;
  }

  async remove(id: number): Promise<Class> {
    const classFound = await this.findOne(id);
    if (classFound.students.length > 0) {
      throw new CustomException(
        ErrorCodes.BAD_REQUEST_INPUT,
        'Class cannot be removed because it has students',
        { field: 'id', value: id },
      );
    }
    await this.dataSource.manager.delete(Class, id);
    return classFound;
  }
}
