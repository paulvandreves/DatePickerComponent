// @flow
import React, { useEffect, useRef, useState } from 'react';//Much like recompose withState the useState hook gives the functional component local state.
import { Input, InputGroup, InputGroupAddon, Button } from 'reactstrap';
import { Calendar } from 'react-date-range';
import { enUS } from 'react-date-range/dist/locale';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

import {
  DatePickerType,
  datePickerOnChangeHandler,
  leadingZeroFormat,
  dateInputMask,
  parseDateLimits
} from './utils';
import { DateTime } from 'luxon';
import moment from 'moment';

const toggle = () => {
  //TODO: this function should flip the polarity of isToggleOn 
}

const displayDate = (date) => {
  if (moment.isMoment(date)) {
    date = leadingZeroFormat(date.toDate());
  }
  return date;
};

const dropDirection = ({ isToggleOn, id, renderDropdown }) => {

  // if (!isToggleOn) {
  //   const element = document.getElementById(id);
  //   const rect = element.getBoundingClientRect();
  //   const top = rect.top;
  //   const bottom = window.innerHeight - top;
  //   top > bottom
  //     ? renderDropdown('calendar-dropUp')
  //     : renderDropdown('calendar-dropDown');
  // }
  //toggle();
};

export const DatePickerComponent = (props: DatePickerType) => {
  const [inputValue, handleInputChange] = useState(null); 
  const [dropDown, renderDropdown] = useState('calendar-dropDown'); 
 
  const {
    id,
    //handleInputChange,
   // inputValue,
    disabled,
    value,
    toggle,
    isToggleOn,
    max,
    min,
    //dropDown,
    //renderDropdown,
    placeholder = 'Select Date'
  } = props;

  const displayValue = inputValue === null ? value : inputValue;
  const maxDate = max ? max.toJSDate() : null;
  const minDate = min ? min.toJSDate() : null;
  const node = useRef();



  const setDateValue = ({ target: { value } }) => {
    if (value) {
      const dates = parseDateLimits(min, max, value);
      const date = dates[0];
      const parsedDate = dates[1];
      const result = date.isValid ? date.toJSDate() : null;
      handleInputChange(parsedDate); // passing the correctly formatted string to handleInput change. so that it shows up in mm/dd/yyyy format when the user tabs away
      //datePickerOnChangeHandler(props)(result); TODO Pass props including the onChange function 
    }
  };

  const setValidDate = ({ target: { value } }) => {
    handleInputChange(dateInputMask(value));
  };

  const handleClick = (e) => {
    !node.current.contains(e.target) && isToggleOn && toggle(isToggleOn);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  });

  return (
    <div id={id} className="position-relative" ref={node}>
      <InputGroup>
        <InputGroupAddon addonType="append">
          <Button
            className="dp-btn-calendar"
            onClick={() =>
              dropDirection({ isToggleOn, toggle, id, renderDropdown })
            }
            disabled={disabled}
            data-cy="year-select"
          >
            <i id={id} className="material-icons  dp-icon">
              calendar_today
            </i>
          </Button>
        </InputGroupAddon>
        <Input
          onClick={() =>
            dropDirection({ isToggleOn, toggle, id, renderDropdown })
          }
          data-cy="date-input"
          id={id}
          placeholder={placeholder}
          className="dateInput"
          disabled={disabled}
          value={displayDate(displayValue)} // Accepts input from the calendar ui 
          onBlur={isToggleOn ? null : setDateValue}
          onChange={isToggleOn ? toggle : setValidDate}
        />
        {isToggleOn && (
          <Calendar
            id={id}
            className={dropDown}
            data-cy="year-panel-year"
            date={value ? new Date(value) : new Date()}
            {...(minDate ? { minDate } : {})}
            {...(maxDate ? { maxDate } : {})}
            onChange={(value) => {
              handleInputChange(
                DateTime.fromJSDate(value).toFormat('LL/dd/yyyy')
              );
             // datePickerOnChangeHandler(props)(value);  TODO Pass props including the onChange function 
            }}
            color={'#25a584'}
            locale={enUS}
          />
        )}
      </InputGroup>
    </div>
  );
};

export default DatePickerComponent; 