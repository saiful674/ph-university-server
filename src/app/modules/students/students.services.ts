import httpStatus from 'http-status';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { User } from '../users/users.models';
import { TStudent } from './students.interface';
import Student from './students.model';

const getAllStudentFromDb = async (query: Record<string, unknown>) => {
  const studentSearchableFields = ['email', 'name.firstName', 'address'];
  const studentQuery = new QueryBuilder(
    Student.find().populate(
      'admissionSemester academicDepartment academicFaculty user',
    ),
    query,
  )
    .search(studentSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const result = await studentQuery.modelQuery;
  const meta = await studentQuery.countTotal();
  return {
    meta,
    result,
  };
};

const getSingleStudentFromDb = async (id: string) => {
  const result = await Student.findById(id);
  return result;
};

const updateMyInfoIntoDb = async (userId: string, payload: TStudent) => {
  const isStudentExists = await Student.findOne({ id: userId });
  if (!isStudentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student not found!');
  }

  const { name, guardian, localGuardian, ...remaingStudentData } = payload;
  const modifiedStudent: Record<string, unknown> = { ...remaingStudentData };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedStudent[`name.${key}`] = value;
    }
  }
  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedStudent[`guardian.${key}`] = value;
    }
  }
  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedStudent[`localGuardian.${key}`] = value;
    }
  }

  const result = await Student.findByIdAndUpdate(
    isStudentExists._id,
    modifiedStudent,
    {
      new: true,
      runValidators: true,
    },
  );

  return result;
};

const updateSingleStudentintoDb = async (id: string, payload: TStudent) => {
  const { name, guardian, localGuardian, ...remaingStudentData } = payload;
  const modifiedStudent: Record<string, unknown> = { ...remaingStudentData };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedStudent[`name.${key}`] = value;
    }
  }
  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedStudent[`guardian.${key}`] = value;
    }
  }
  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedStudent[`localGuardian.${key}`] = value;
    }
  }

  const result = await Student.findByIdAndUpdate(id, modifiedStudent, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteStudentFronDb = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    await session.startTransaction();
    const deletedStudent = await Student.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Faild to delete student');
    }
    const deletedUser = await User.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Faild to delete user');
    }
    await session.commitTransaction();
    await session.endSession();
    return deletedStudent;
  } catch (err) {
    session.abortTransaction();
    session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Faild to delete student');
  }
};

export const studentServices = {
  getAllStudentFromDb,
  getSingleStudentFromDb,
  deleteStudentFronDb,
  updateSingleStudentintoDb,
  updateMyInfoIntoDb,
};
