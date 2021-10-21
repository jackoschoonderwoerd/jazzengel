// import { Month, Year } from "./program.models";

export function sayHi() {
  alert('hi');
}


export function calculateDateMonthsFromNow(months: number): string  {
  // RETURNS A DATESTRING, 6 MONTHS INTO THE FUTURE
  const monthsAhead: number = months
  const today = new Date()
  let monthNow = today.getMonth() + 1;
  const dateNow = today.getDate();
  let yearNow = today.getFullYear();
  if(monthNow + monthsAhead > 11) {
    monthNow = monthNow + 6 - 12;
    yearNow = yearNow + 1
  }
  const dateString = `${monthNow}/31/${yearNow}` 
  return dateString
}

export function setStartingDateString(): string {
  // RETURNS THE CURRENT DATE AS A STRING
  const today = new Date()
  const monthNow = today.getMonth() + 1;
  const dateNow = today.getDate();
  const yearNow = today.getFullYear();
  const startingDayString = `${monthNow}/${dateNow}/${yearNow}`
  return startingDayString
}


