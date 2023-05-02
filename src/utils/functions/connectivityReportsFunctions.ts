export function calculateInternetAvailability(month: string, daysWithoutInternet: number): number {
    const daysInMonth: { [key: string]: number } = {
      JAN: 31,
      FEB: 28,
      MAR: 31,
      APR: 30,
      MAY: 31,
      JUN: 30,
      JUL: 31,
      AUG: 31,
      SEP: 30,
      OCT: 31,
      NOV: 30,
      DEC: 31
    }
  
    const totalDays = daysInMonth[month];
  
    if (totalDays === undefined) {
      throw new Error("Invalid month")
    }
  
    if (daysWithoutInternet < 0 || daysWithoutInternet > totalDays) {
      throw new Error("Invalid number of days without internet")
    }
  
    const daysWithInternet = totalDays - daysWithoutInternet;
    const percentage = (daysWithInternet / totalDays) * 100
  
    return percentage
  }
  