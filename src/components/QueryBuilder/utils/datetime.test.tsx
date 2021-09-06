import { formatDate } from './datetime';

test.each([
  [new Date(2018, 11, 24, 10, 33, 30, 0), '2018-12-24'],
  [new Date(2000, 8, 7), '2000-09-07'],
  [new Date('October 13, 2014 11:13:00'), '2014-10-13'],
  [new Date(86400000), '1970-01-02'],
  [new Date('1995-12-17T03:24:00'), '1995-12-17'],
])('formatDate(%s)', (input, expected) => {
  expect(formatDate(input)).toBe(expected);
});
