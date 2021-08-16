import { format, parse, isValid } from 'date-fns';

const defaultDate = new Date();

export const toDate = (value: string) => {
  const dateValue = value.replace(/\D/g, '');
  const date = parse(
    dateValue,
    'ddMMyyyy'.slice(0, dateValue.length),
    defaultDate,
  );
  return isValid(date) ? date : defaultDate;
};

export const formatDate = (value: string | Date) => {
  if (typeof value === 'string') {
    const date = toDate(value);
    return format(date, 'dd/MM/yyyy');
  }
  return format(value, 'dd/MM/yyyy');
};
