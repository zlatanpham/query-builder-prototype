import { Box } from '@sajari-ui/core';
import { Calendar } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { toDate } from '../utils/datetime';

interface DatePickerProps {
  inputValue: string;
  onChange: (date: Date) => void;
}

export const DatePicker = ({ inputValue, onChange }: DatePickerProps) => {
  return (
    <Box onClick={(e) => e.stopPropagation()}>
      <Calendar
        date={toDate(inputValue)}
        onChange={onChange}
        showDateDisplay={false}
      />
    </Box>
  );
};
