const moment = require('moment-timezone');

const complement = (timeSpan, busy) => {
  const timePoints = [];
  const freeTimes = [];
  timePoints.push(timeSpan.start);
  busy.forEach((t) => {
    timePoints.push(t.start);
    timePoints.push(t.end);
  });
  timePoints.push(timeSpan.end);
  for (let i = 0; i < timePoints.length; i = i + 2) {
    freeTimes.push({start: timePoints[i], end: timePoints[i + 1]});
  }
  return freeTimes;
};

const convertMS = (isoTime) => {
  const time = new Date(isoTime);
  return time.getTime();
};

const convertToISO = (ms) => {
  return moment(ms).tz('America/Los_Angeles').format();
};

const timeInterval = {
  "start": "2017-07-19T12:00:00-07:00",
  "end": "2017-07-26T12:00:00-07:00"
};

console.log('Time interval is: \n', timeInterval);

let busyTimes = [
  {
    "start": "2017-07-20T12:00:00-07:00",
    "end": "2017-07-20T13:00:00-07:00"
  },
  {
    "start": "2017-07-20T17:30:00-07:00",
    "end": "2017-07-20T19:00:00-07:00"
  },
  {
    "start": "2017-07-20T21:00:00-07:00",
    "end": "2017-07-20T21:00:00-07:00"
  },
  {
    "start": "2017-07-24T17:30:00-07:00",
    "end": "2017-07-24T19:00:00-07:00"
  }
];

console.log('Busy times are: \n', busyTimes);

busyTimes = busyTimes.map((t) => {
  t.start = convertMS(t.start);
  t.end = convertMS(t.end);
  return t;
});

timeInterval.start = convertMS(timeInterval.start);
timeInterval.end = convertMS(timeInterval.end);

const finalTimes = complement(timeInterval, busyTimes).map((t) => {
  t.start = convertToISO(t.start);
  t.end = convertToISO(t.end);
  return t;
});

console.log('Free times are: \n', finalTimes);
