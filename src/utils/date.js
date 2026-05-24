import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { TIMEZONE } from '../constants/app';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

dayjs.tz.setDefault(TIMEZONE);

export const nowKarachi = () => dayjs().tz(TIMEZONE);

export const normalizeDate = (date = nowKarachi()) => dayjs(date).tz(TIMEZONE);

export const toTransactionDateParts = (date = nowKarachi()) => {
  const value = normalizeDate(date);
  return {
    date: value.format('YYYY-MM-DD'),
    month: value.format('YYYY-MM'),
    year: Number(value.format('YYYY')),
    timezone: TIMEZONE
  };
};

export const formatDate = (date, pattern = 'DD MMM YYYY') => normalizeDate(date).format(pattern);

export const currentMonth = () => nowKarachi().format('YYYY-MM');

export const today = () => nowKarachi().format('YYYY-MM-DD');

export const weekRange = () => {
  const start = nowKarachi().startOf('week');
  const end = nowKarachi().endOf('week');
  return { start: start.format('YYYY-MM-DD'), end: end.format('YYYY-MM-DD') };
};

export { dayjs };
