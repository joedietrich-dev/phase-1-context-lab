'use strict'
/* Your Code Here */
function createEmployeeRecord([firstName, familyName, title, payPerHour]) {
    return {
        firstName,
        familyName,
        title,
        payPerHour,
        timeInEvents: [],
        timeOutEvents: []
    }
}

function createEmployeeRecords(employeeRecords) {
    return employeeRecords.map(employeeRecord => createEmployeeRecord(employeeRecord));
}

function createTimeInEvent(dateStamp) {
    const dateTime = createDatetimeFromStamp(dateStamp);
    this.timeInEvents.push({
        type: "TimeIn",
        hour: dateTime.getHours() * 100,
        date: dateStamp.slice(0, 10),
        dateTime
    })
    this.timeInEvents.sort((a, b) => a.dateTime - b.dateTime)
    return this;
}

function createTimeOutEvent(dateStamp) {
    const dateTime = createDatetimeFromStamp(dateStamp);
    this.timeOutEvents.push({
        type: "TimeOut",
        hour: dateTime.getHours() * 100,
        date: dateStamp.slice(0, 10),
        dateTime
    })
    this.timeOutEvents.sort((a, b) => a.dateTime - b.dateTime)
    return this;
}

function hoursWorkedOnDate(dateStamp) {
    const searchDate = createDatetimeFromStamp(dateStamp);
    const timeIn = this.timeInEvents.find(timeInEvent => matchOnDates(timeInEvent.dateTime, searchDate)).dateTime;
    const timeOut = this.timeOutEvents.find(timeOutEvent => timeOutEvent.dateTime > timeIn).dateTime;
    if (!timeIn && !timeOut) {
        throw new Error('Could not find matching dates in and out for ' + dateStamp);
    }
    return (timeOut - timeIn) / (1000 * 60 * 60);
}

function wagesEarnedOnDate(dateStamp) {
    return this.payPerHour * hoursWorkedOnDate.call(this, dateStamp);
}

function allWagesFor() {
    const payDates = this.timeInEvents.map(timeInEvent => timeInEvent.date);
    const totalWages = payDates.reduce((acc, payDate) => {
        return acc + wagesEarnedOnDate.call(this, payDate);
    }, 0);
    return totalWages;
}

function calculatePayroll(employees) {
    return employees.reduce((acc, employee) => {
        const employeeWages = allWagesFor.bind(employee)();
        return acc + employeeWages;
    }, 0);
}

function findEmployeeByFirstName(employees, firstName) {
    return employees.find(employee => employee.firstName === firstName);
}
/*
 We're giving you this function. Take a look at it, you might see some usage
 that's new and different. That's because we're avoiding a well-known, but
 sneaky bug that we'll cover in the next few lessons!

 As a result, the lessons for this function will pass *and* it will be available
 for you to use if you need it!
 */

// const allWagesFor = function () {
//     const eligibleDates = this.timeInEvents.map(function (e) {
//         return e.date
//     })

//     const payable = eligibleDates.reduce(function (memo, d) {
//         return memo + wagesEarnedOnDate.call(this, d)
//     }.bind(this), 0) // <== Hm, why did we need to add bind() there? We'll discuss soon!

//     return payable
// }

// Utils
function createDatetimeFromStamp(dateStamp) {
    const dateFormat = /(\d{4})-(\d{2})-(\d{2}) ?(\d{2})?(\d{2})?/;
    if (!dateStamp.match(dateFormat)) {
        throw new Error('Invalid date stamp: ' + dateStamp);
    }
    const [, year, month, day, hour = 0, minute = 0] = dateStamp.match(dateFormat);
    const date = new Date(
        parseInt(year, 10),
        parseInt(month, 10) - 1,
        parseInt(day, 10),
        parseInt(hour, 10),
        parseInt(minute, 10));
    if (!date.getDate()) {
        throw new Error('Invalid date stamp: ' + dateStamp);
    }
    date.setFullYear(year);
    return date;
}

function matchOnDates(date1, date2) {
    return date1.getFullYear() === date2.getFullYear()
        && date1.getMonth() === date2.getMonth()
        && date1.getDate() === date2.getDate();
}