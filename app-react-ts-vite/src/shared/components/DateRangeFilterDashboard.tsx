import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DateRange.scss';
import DualAxisChart from './BlockchainDualChart';
import ToggleButton from './ToggleButton';

interface DataItem {
  month: string;
  // blocks: number;
  // transactions: number;
  blocks: number;
  transactions: number;
}


interface DateRangePickerProps {
  data: DataItem[];
  handleToggle: (toggle: boolean) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ data, handleToggle }) => {

  
  const defaultStartDate = new Date('Wed Nov 15 2023 00:00:00 GMT-0700 (Mountain Standard Time)');
  const defaultEndDate = new Date('Mon Jan 15 2024 00:00:00 GMT-0700 (Mountain Standard Time)');
  
  const [startDate, setStartDate] = useState<Date>(defaultStartDate);
  const [endDate, setEndDate] = useState<Date>(defaultEndDate);


  const [formattedData, setFormattedData] = useState<DataItem[]>(data);


  const handleStartDateChange = (date: Date) => {
    console.log(date);
    console.log(endDate);
    setStartDate(date);
    // if (date && endDate) {
    //   filterData(formatDate(date), formatDate(endDate));
    // }
  };

  const handleEndDateChange = (date: Date) => {
    console.log(date);
    console.log(startDate);
    setEndDate(date);
    // if (date && startDate) {
    //   filterData(formatDate(startDate), formatDate(date));
    // }
  };

  interface DataItem {
    month: string;
    // blocks: number;
    // transactions: number;
    blocks: number;
    transactions: number;
}

useEffect(() => {
  if (startDate && endDate) {
    filterData(formatDate(startDate), formatDate(endDate));
  }
}, [startDate, endDate, data]);

 // Filter data based on start and end months
//  const filterData = (start: string, end: string) => {
//   const startMonth = new Date(start).getMonth();
//   const endMonth = new Date(end).getMonth();
//  console.log(startMonth);
//  console.log(endMonth);
//   const filteredData = data.filter(item => {
//     const itemMonth = new Date(item.month).getMonth();
//     return itemMonth >= startMonth && itemMonth <= endMonth;
//   });
//   console.log(filteredData);
//   setFormattedData(filteredData);
// };


const filterData = (start: string, end: string) => {
  // Parse start and end dates
  const startDate = new Date(start);
  const endDate = new Date(end);
  console.log(startDate)
  console.log(endDate)
  
  // Extract day, month, and year components
  const startDay = startDate.getDate();
  const startMonth = startDate.getMonth();
  const startYear = startDate.getFullYear().toString().slice(-2);

  const endDay = endDate.getDate();
  const endMonth = endDate.getMonth();
  const endYear = endDate.getFullYear().toString().slice(-2);
  console.log(`${startDay} ${startMonth} ${startYear}`)
  console.log(`${endDay} ${endMonth} ${endYear}`)

  // Filter the data based on the date, month, and year
  const filteredData = data.filter(item => {
    const itemDate = new Date(item.month + ' ' + (startYear < endYear ? startYear : endYear)).getDate();
    const itemMonth = new Date(item.month + ' ' + (startYear < endYear ? startYear : endYear)).getMonth();
    const itemYear = new Date(item.month + ' ' + (startYear < endYear ? startYear : endYear)).getFullYear().toString().slice(-2);

    return (
      (itemYear > startYear || (itemYear === startYear && itemMonth > startMonth) || (itemYear === startYear && itemMonth === startMonth && itemDate >= startDay)) &&
      (itemYear < endYear || (itemYear === endYear && itemMonth < endMonth) || (itemYear === endYear && itemMonth === endMonth && itemDate <= endDay))
    );
  });


  setFormattedData(filteredData);
};


const formatDate = (date: Date): string => {
  const month = date.getDate();
  const month1 = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear().toString().slice(-2);
  console.log(`${month} ${month1} ${year}`);
  return `${month} ${month1} ${year}`;
};

  return (
    <>
    <DualAxisChart data={formattedData} defaultStartDate={startDate} defaultEndDate={endDate} key={formattedData[0].blocks.toString()} />
    <div style={{paddingLeft: '800px', paddingTop: '0px'}}>
      <ToggleButton onToggleChange={handleToggle} />
    </div>
    <div className="brown-background" style={{paddingBottom:'40px', paddingLeft:'40px'}}>
      <div className="dashboard-box">
        <div className="box-header">Date Range Filter</div>
        <div className="box-content">
          <div style={{ marginBottom: '10px' }}>
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Start Date"
            />
          </div>
          <div>
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              placeholderText="End Date"
            />
          </div>
        </div>
      </div>
    </div>
    </>
   
  );
};

export default DateRangePicker;
