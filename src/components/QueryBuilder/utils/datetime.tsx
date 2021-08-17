import { format, parse, isValid } from 'date-fns';

const defaultDate = new Date();

export const toDate = (value: string) => {
  const dateValue = value.replace(/\D/g, '');
  const date = parse(
    dateValue,
    'yyyyMMdd'.slice(0, dateValue.length),
    defaultDate,
  );
  return isValid(date) ? date : defaultDate;
};

export const formatDate = (value: string | Date) => {
  const validFormat = 'yyyy-MM-dd';
  if (typeof value === 'string') {
    const date = toDate(value);
    return format(date, validFormat);
  }
  return format(value, validFormat);
};
