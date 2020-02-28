import isEmpty from 'lodash/isEmpty';

const duplicateLocationCheck = (trials, currentTrial) => validatingValue => {
  const { id: currentTrialId } = currentTrial;

  return !trials
    .filter(({ id }) => id !== currentTrialId)
    .some(({ locationCode: targetLocationCode }) => targetLocationCode === validatingValue);
};

const emptyForCommittedCheck = currentTrial => validatingValue => {
  const isCommitted = currentTrial.statusCode === 2;

  return !(isCommitted && isEmpty(validatingValue));
};

export {
  duplicateLocationCheck,
  emptyForCommittedCheck,
};