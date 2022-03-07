import { EventNames } from '../events';
import { Db, regEventFx } from '../store';

export const success = (eventName: EventNames) => `${eventName}-success`;

export const failure = (eventName: EventNames) => `${eventName}-failure`;

export const regResultFx = <JSON extends any>(
  eventName: EventNames,
  successBranch: (
    { db }: { db: Db },
    res: JSON | { json: JSON; args: any }
  ) => any,
  failureBranch: (
    { db }: { db: Db },
    res: Error | { res: Error; args: any }
  ) => any,
  successEventName = success(eventName),
  failureEventName = failure(eventName)
) => {
  regEventFx(successEventName as EventNames, successBranch);
  regEventFx(failureEventName as EventNames, failureBranch);
};
