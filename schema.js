import * as Yup from 'yup';

import {
  duplicateLocationCheck,
  emptyForCommittedCheck,
} from './validations';

const schema = trials => Yup.lazy(trial => Yup.object().shape({
  year: Yup.number().required('Required field'),
  locationCode: Yup.string()
    .test(
      'duplicate-validation',
      'Duplicate location',
      duplicateLocationCheck(trials, trial),
    )
    .test(
      'emppty-for-committed-validation',
      'Empty for committed location',
      emptyForCommittedCheck(trial),
    ),
  countPerUnit: Yup.number().nullable().moreThan(0, 'Should be more than 0'),
  cropDestruct: Yup.bool().typeError('Incorrect type'),
}));

const dataRows = [
  {
    id: 1,
    year: 2019,
    locationCode: 'AL01',
    countPerUnit: 4,
    cropDestruct: true,
    statusCode: 0,
  },
  {
    id: 2,
    year: 2020,
    locationCode: 'R087',
    countPerUnit: 10,
    cropDestruct: false,
    statusCode: 0,
  },
  {
    id: 3,
    year: 2021,
    // incorrect - duplication
    locationCode: '',
    // incorrect - value
    countPerUnit: -6,
    // incorrect - type
    cropDestruct: 'dsd',
    // incorrect if empty location
    statusCode: 2,
  },
];

const options = {
  strict: false,
  abortEarly: false,
  stripUnknown: false,
  recursive: true,
}

const performValidation = async () => {
  try {
    const validationResult = await schema(dataRows).validate(dataRows[2], options);

    console.log(validationResult);
  } catch(error) {
    const processedResult = error.inner.reduce((acc, { message, path }) => {
      acc[path] = message;

      return acc;
    }, {});

    // expected output
    // {
    //   locationCode: 'Duplicate location' || 'Empty for committed location',
    //   countPerUnit: 'Should be more than 0',
    //   cropDestruct: 'Incorrect type'
    // }
    console.log(processedResult);
  }
};

performValidation();