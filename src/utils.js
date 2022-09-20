import moment, { Moment } from 'moment';
import { DateTime } from 'luxon';

export const ISO_FORMAT = 'YYYY-MM-DD';
export const DISPLAY_FORMAT = 'L';

export type DatePickerType = {
  min: Moment,
  max: Moment,
  startOf: string,
  disabled: boolean,
  className: string,
  showToday: boolean,
  allowClear: boolean,
  placeholder: string,
  id: string | number,
  value: Moment,
  isOutsideRange: Function,
  onChangeHandler: Function
};

export const leadingZeroFormat = (dateObject) => {
  // Using  .toLocaleDateString allows us to parse a variety of date formats entered by the user.
  return dateObject.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export const dateInputMask = (userEntry) => {
  let cleanDate;
  let len = userEntry.length;
  let slashCount = (userEntry.match(/\//g) || []).length; // Count the number of slashes entered
  let intCount = userEntry.replace(/[^0-9]/g, '').length; // Count the number of integers in the string
  cleanDate = userEntry.replace(/\/\//g, ''); // Remove all double slashes

  if (intCount > 8) {
    // There should never be more that 8 integers in a date
    cleanDate = cleanDate.slice(0, -1);
  }
  if (slashCount > 2) {
    // If there are already two slashes in the code don't allow the user to type any more slashes
    cleanDate = cleanDate.slice(0, -1); // remove the last / There should never be more that two slashes in a date
  }
  if (!userEntry.match(/[a-z]/i)) {
    // Only add slashes if the user isnt typing in alaphabet characters.
    if (len === 3 && !userEntry.includes('/')) {
      // Lets the user type the slash or adds it for them
      cleanDate = userEntry.slice(0, 2) + '/' + userEntry.slice(2);
    }
    if (len === 6 && userEntry.substring(5, 7) !== '/' && slashCount < 2) {
      // Lets the user type the slash or adds it for them
      cleanDate = userEntry.slice(0, 5) + '/' + userEntry.slice(5);
    }
  }
  return cleanDate;
};

export const parseDateLimits = (min, max, value) => {
  const maxdate = max ? max.toJSDate() : null;
  const mindate = min ? min.toJSDate() : null;
  let parsedDate = new Date(value);
  parsedDate = leadingZeroFormat(parsedDate);
  let date = DateTime.fromFormat(parsedDate, 'LL/dd/yyyy');
  if (max < date) {
    // If the date is too far in the future, set the date to today
    date = max;
    parsedDate = maxdate;
    parsedDate = leadingZeroFormat(parsedDate);
  }
  if (min > date) {
    // If the date is too far in the past set the date to the min
    date = min;
    parsedDate = mindate;
    parsedDate = leadingZeroFormat(parsedDate);
  }
  return [date, parsedDate];
};

export const toCorrectFormat = (dateString, customFormat) => {
  const dateFormats = customFormat
    ? [customFormat, DISPLAY_FORMAT, ISO_FORMAT]
    : [DISPLAY_FORMAT, ISO_FORMAT];

  const date = moment(dateString, dateFormats, true);
  return date.isValid() ? date.hour(0) : null;
};

export const onChangeHandler = ({ setFieldTouched, onChange, name }) => (
  value
) => {
  const date = value && value.startOf('day').toDate();

  onChange(date);
  setFieldTouched(name, true, true);
};

export const datePickerOnChangeHandler = ({
  setFieldTouched,
  onChange,
  name,
  hide
}) => (value) => {
  hide();
  onChange(value);
  setFieldTouched(name, true, true);
};

export const handleOutsideOfDatePickerRange = ({ min, max }) => (value) => {
  if (!value) return true;

  const minValue = !!min && +min > +value.startOf('day');
  const maxValue = !!max && +max < +value.startOf('day');

  return maxValue || minValue;
};

export const handleOutsideOfMonthPickerRange = ({ min, max, startOfMonth }) => (
  value
) => {
  if (!value) return true;

  const valueDefinition = startOfMonth
    ? value.startOf('month')
    : value.endOf('month');

  const minValue = !!min && +min > +valueDefinition.startOf('day');
  const maxValue = !!max && +max < +valueDefinition.startOf('day');

  return maxValue || minValue;
};