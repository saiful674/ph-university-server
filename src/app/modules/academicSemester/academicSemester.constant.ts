import { TAcademicSemesterCode } from './academicSemester.interface';

export const academicSemesterMapper: TAcademicSemesterCode = {
  Autumn: '01',
  Summer: '02',
  Fall: '03',
};

export const AcademicSemesterSearchableFields = [
  'name',
  'year',
  'startMonth',
  'endMonth',
];
