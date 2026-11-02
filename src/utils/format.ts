import { DateTime } from 'luxon';
import { DurationObjectUnits, DurationUnits } from 'luxon';

export const timeFormat = (value: number) => {
  return String(Math.ceil(value)).padStart(2, '0');
};

export const sortArrayObjectsBaseOnString = (arr: any[]) => {
  const arrForSort = [...arr];
  const vv = arrForSort.sort(function (a, b) {
    const nameA = a.name.toUpperCase(); // ignore upper and lowercase
    const nameB = b.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    // names must be equal
    return 0;
  });

  return vv;
};

export const sortArrayObjectsBaseOnDate = (arr: any[], reverse?: boolean) => {
  if (arr.length < 1) return arr;
  const arrForSort = [...arr];
  const vv = arrForSort.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    //@ts-ignore
    return dateB - dateA;
  });

  return vv;
};

export const getInitials = (name: string) => {
  const nameArr = name.split(' ');
  return `${nameArr[0][0]}${
    nameArr.length - 1 !== 0 ? nameArr[nameArr.length - 1][0] : ''
  }`;
};

export interface IGetDuration {
  start?: string;
  end?: string;
  duration?: any;
  getObject?: boolean;
  customTimeArray?: DurationUnits;
  getHighest?: boolean;
}

export const getDuration = ({
  start,
  end,
  duration,
  getObject,
  customTimeArray,
  getHighest = false,
}: IGetDuration) => {
  let days;
  let hours;
  let minutes;
  let seconds;
  let obj: DurationObjectUnits | {} = {};

  if (start) {
    const startAt = DateTime.fromISO(start);
    let diff: any;
    if (end) {
      const endAt = DateTime.fromISO(end);
      diff = endAt
        .diff(startAt, customTimeArray ?? ['hours', 'minutes', 'seconds'])
        .toObject();
    } else {
      diff = DateTime.now().diff(startAt,
        ['days', 'hours', 'minutes', 'seconds',]
      ).toObject();
    }

    console.log(diff)

    hours = diff.hours;
    minutes = diff.minutes;
    seconds = diff.seconds;
    obj = diff;
  }

  if (duration) {
    days = duration.days ?? 0;
    hours = duration.hour ?? duration.hours;
    minutes = duration.minute ?? duration.minutes;
    seconds = duration.second ?? duration.seconds;
  }

  const daySuffix = days ? (days > 1 ? 'days' : 'day') : '';
  const hourSuffix = hours ? (hours > 1 ? 'hours' : 'hour') : '';
  const minuteSuffix = minutes ? (minutes > 1 ? 'mins' : 'min') : '';
  const secondSuffix = seconds ? (seconds > 1 ? 'secs' : 'sec') : '';
  let result;

  if (getObject) {
    return obj;
  }

  if (days) {
    result = `${days} ${daySuffix}`;
  } else if (hours) {
    if (getHighest) {
      result = `${hours} ${hourSuffix} `;
    } else {
      result = `${hours} ${hourSuffix} ${
        minutes ? minutes : ''
      } ${minuteSuffix}`;
    }
  } else if (minutes) {
    result = `${minutes} ${minuteSuffix}`;
  } else {
    result = `${Math.floor(seconds)} ${secondSuffix}`;
  }

  return result;
};

export const formatDateToDuration = (time: string) => {
  const date1 = DateTime.fromISO(time);
  const diff = date1.diffNow(["years", "months", "days", "hours", "minutes"]);

  if (diff.years * -1 > 1) {
    return `${diff.years * -1} years, ${diff.months * -1} months and ${diff.days * -1} days ago`;
  }
  if (diff.years * -1 === 1) {
    return `${diff.years * -1} year, ${diff.months * -1} months and ${diff.days * -1} days ago`;
  }
  if (diff.months * -1 > 1) {
    return `${diff.months * -1} months and ${diff.days * -1} days ago`;
  }
  if (diff.months * -1 === 1) {
    return `${diff.months * -1} month and ${diff.days * -1} days ago`;
  }
  if (diff.days * -1 > 1) {
    return `${diff.days * -1} days ago`;
  }
  if (diff.days * -1 === 1) {
    return `${diff.days * -1} day ago`;
  }
  if (diff.hours * -1 > 1) {
    return `${diff.hours * -1} hours ago`;
  }
  if (diff.hours * -1 === 1) {
    return `${diff.hours * -1} hour ago`;
  }
  if (diff.minutes * -1 > 1) {
    return `${Math.floor(diff.minutes * -1)} mins ago`;
  }
  if (diff.hours * -1 === 1) {
    return `${Math.floor(diff.minutes * -1)} min ago`;
  }
  if (diff.hours * -1 < 1) {
    return `Less than 1 min ago`;
  }

  return "";
};

