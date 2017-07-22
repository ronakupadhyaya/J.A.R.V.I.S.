const moment = require('moment-timezone');
const _ = require('underscore');
/* converToFreeTimes -> */
// test data
const busy = [
  [
    { start: '2017-07-20T07:00:00Z', end: '2017-07-20T07:00:00Z' },
    { start: '2017-07-21T07:00:00Z', end: '2017-07-21T07:00:00Z' },
    { start: '2017-07-23T01:00:00Z', end: '2017-07-23T01:00:00Z' }
  ],
  [
    { start: '2017-07-18T01:00:00Z', end: '2017-07-18T02:00:00Z' },
    { start: '2017-07-20T11:00:00Z', end: '2017-07-20T11:00:00Z' },
    { start: '2017-07-20T19:00:00Z', end: '2017-07-20T20:00:00Z' },
    { start: '2017-07-21T00:30:00Z', end: '2017-07-21T02:00:00Z' },
    { start: '2017-07-21T04:00:00Z', end: '2017-07-21T04:00:00Z' },
    { start: '2017-07-21T08:00:00Z', end: '2017-07-21T08:00:00Z' },
    { start: '2017-07-21T10:00:00Z', end: '2017-07-21T10:00:00Z' },
    { start: '2017-07-21T12:00:00Z', end: '2017-07-21T12:00:00Z' },
    { start: '2017-07-21T23:00:00Z', end: '2017-07-21T23:00:00Z' },
    { start: '2017-07-22T00:00:00Z', end: '2017-07-22T00:00:00Z' },
    { start: '2017-07-22T23:00:00Z', end: '2017-07-22T23:00:00Z' },
    { start: '2017-07-23T00:00:00Z', end: '2017-07-23T00:00:00Z' },
    { start: '2017-07-23T23:00:00Z', end: '2017-07-23T23:00:00Z' },
    { start: '2017-07-24T02:00:00Z', end: '2017-07-24T02:00:00Z' },
    { start: '2017-07-25T00:30:00Z', end: '2017-07-25T02:00:00Z' }
  ]
];

const timeInterval = {
  "start": "2017-07-19T12:00:00-07:00",
  "end": "2017-07-26T12:00:00-07:00"
};

// comparison function for sort
const compareTime = (a, b) => {
  // console.log(a, b);
  return b.start - a.start;
};
const reverseCompareTime = (a, b) => {
  // console.log(a, b);
  return a.start - b.start;
};

// converToFreeTimes sub-helper functions
const convertMS = (isoTime) => {
  const time = new Date(isoTime);
  return time.getTime();
};

const convertToISO = (ms) => {
  return moment(ms).tz('America/Los_Angeles').format();
};

// convertToFreeTimes helper functions
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
    freeTimes.push({ start: timePoints[i], end: timePoints[i + 1] });
  }
  return freeTimes;
};

// // main functions
// const convertToFreeTimes = (busyLists) => {
//   // convert to ms
//   const busyListsMS = busyLists.map((list) => {
//     return list.map((t) => {
//       t.start = convertMS(t.start);
//       t.end = convertMS(t.end);
//       return t;
//     });
//   });

//   // convert time interval
//   timeInterval.start = convertMS(timeInterval.start);
//   timeInterval.end = convertMS(timeInterval.end);

//   // convert to free times with ISO format
//   const freeLists = busyListsMS.map((list) => complement(timeInterval, list).map((t) => {
//     t.start = convertToISO(t.start);
//     t.end = convertToISO(t.end);
//     return t;
//   }));

//   return freeLists;
// };

const mergeIntervals = (arr) => {
  console.log('1: ', arr);
  const n = arr.length;

  console.log('Before sort: \n', arr);

  // Sort Intervals in decreasing order of
  // start time
  arr.sort(compareTime);

  console.log('After sort: \n', arr);

  let index = 0; // Stores index of last element
  // in output array (modified arr[])

  // Traverse all input Intervals
  for (let i = 0; i < n; i++) {
    // If this is not first Interval and overlaps
    // with the previous one
    if (index !== 0 && (arr[index - 1].start <= arr[i].end)) {
      while (index !== 0 && (arr[index - 1].start <= arr[i].end)) {
        // Merge previous and current Intervals
        arr[index - 1].end = Math.max(arr[index - 1].end, arr[i].end);
        arr[index - 1].start = Math.min(arr[index - 1].start, arr[i].start);
        index--;
      }
    } else { // Doesn't overlap with previous, add to
      // solution
      arr[index] = arr[i];
    }
    console.log(i + 2, arr);
    index++;
  }
  console.log(n + 2, arr);
  // Now arr[0..index-1] stores the merged Intervals
  const finalIntervals = [];
  console.log("\n The Merged Intervals are: ");
  for (let i = 0; i < index; i++) {
    console.log("[" + arr[i].start + ", " + arr[i].end + "] ");
    finalIntervals.push({
      start: arr[i].start,
      end: arr[i].end
    });
  }
  console.log('////////////////////////////////////////////////////////////////');
  console.log('finalIntervals: \n', finalIntervals);
  console.log('////////////////////////////////////////////////////////////////');
  return finalIntervals;
};

// intersection
const intersection = (a, b) => {
  const min = a.start < b.start ? a : b;
  const max = min === a ? b : a;

  if (min.end < max.start) {
    return null;
  }
  return {start: max.start, end: (min.end < max.end ? min.end : max.end)};
};

// Master Function
const master = (busyList) => {
  // flatten busy list
  const allBusyIntervals = _.flatten(busyList);
  // convert busy list to ms
  const totalBusyIntervalsMS = allBusyIntervals.map((t) => {
    t.start = convertMS(t.start);
    t.end = convertMS(t.end);
    return t;
  });
  // merge busy intervals
  const sharedBusyTimeIntervals = mergeIntervals(totalBusyIntervalsMS);

  // convert time interval
  timeInterval.start = convertMS(timeInterval.start);
  timeInterval.end = convertMS(timeInterval.end);

  // take complement to find free times
  const sharedFreeTimeIntervals = complement(timeInterval, sharedBusyTimeIntervals);

  // sort while in ms
  sharedFreeTimeIntervals.sort(reverseCompareTime);

  // convert back to ISO time with America/Los Angeles timezone
  const sharedISOFreeTimeIntervals = sharedFreeTimeIntervals.map((t) => {
    t.start = convertToISO(t.start);
    t.end = convertToISO(t.end);
    return t;
  });
  return sharedISOFreeTimeIntervals;

  // // convert to free times
  // const freeLists = convertToFreeTimes(busyList);
  // // gather all free times in one list
  // console.log('before flattening: \n', freeLists);
  // const totalFreeTimes = _.flatten(freeLists);
  // console.log('after flattening: \n', totalFreeTimes);
  // // convert to ms for next step
  // const totalFreeTimesMS = totalFreeTimes.map((t) => {
  //   t.start = convertMS(t.start);
  //   t.end = convertMS(t.end);
  //   return t;
  // });
  // console.log('after converting to ms: \n', totalFreeTimesMS);
  // // calculate shared time intervals
  // const sharedFreeTimeIntervals = mergeIntervals(totalFreeTimesMS);
  // // convert back to ISO time with America/Los Angeles timezone
  // const sharedISOFreeTimeIntervals = sharedFreeTimeIntervals.map((t) => {
  //   t.start = convertToISO(t.start);
  //   t.end = convertToISO(t.end);
  //   return t;
  // });
  // return sharedISOFreeTimeIntervals;
};

console.log(master(busy));
