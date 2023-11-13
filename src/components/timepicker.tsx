"use client";
import * as React from 'react';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

export default function TimePickerViews() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={['MobileTimePicker', 'MobileTimePicker', 'MobileTimePicker']}
      >
        <DemoItem>
          <TimePicker views={['hours', 'minutes']} className='bg-white'/>
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}