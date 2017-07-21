// O(n Log n) time and O(1) extra space.

// first, convert all object pairs to be in milliseconds
const convertMS = (isoTime) => {
  const time = new Date(isoTime);
  return time.getTime();
};

// comparison function for sort
const compareTime = (a, b) => {
  return a.start < b.start;
};

// arr is the array of intervals
const mergeIntervals = (arr) => {
  console.log('1: ', arr);
  const n = arr.length;

  // Sort Intervals in decreasing order of
  // start time
  arr.sort(compareTime);

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
  console.log("\n The Merged Intervals are: ");
  for (let i = 0; i < index; i++) {
    console.log("[" + arr[i].start + ", " + arr[i].end + "] ");
  }
};

// Driver program
let busy = [
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

console.log(busy);

busy = busy.map((t) => {
  t.start = convertMS(t.start);
  t.end = convertMS(t.end);
  return t;
});

console.log(busy);

mergeIntervals(busy);

const intervals = [ {start: 4, end: 11}, {start: 19, end: 21}, {start: 8, end: 15}, {start: 1, end: 3}, {start: 9, end: 16} ];
// console.log('sort creates: ', intervals.sort(compareTime));
mergeIntervals(intervals);
