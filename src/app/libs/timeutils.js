// Helpful reference:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#examples
// Example:
//   const date = new Date("2020-05-12T23:50:21.817Z");
//   date.toString();           // Tue May 12 2020 18:50:21 GMT-0500 (Central Daylight Time)
//   date.toDateString();       // Tue May 12 2020
//   date.toTimeString();       // 18:50:21 GMT-0500 (Central Daylight Time)
//   date.toISOString();        // 2020-05-12T23:50:21.817Z
//   date.toJSON();             // 2020-05-12T23:50:21.817Z
//   date.toUTCString();        // Tue, 12 May 2020 23:50:21 GMT
//   date.toLocaleString();     // 5/12/2020, 6:50:21 PM
//   date.toLocaleDateString(); // 5/12/2020
//   date.toLocaleTimeString(); // 6:50:21 PM

/*
 * ################
 * Public methods
 * ################
 */
export function getCurrentDatetimeLocal() {
    return datetimeToHTMLFormat(Date.now());
}

export function printableDate(timestamp) {
    if (timestamp == "") {
        return "";
    }
    let d = new Date(timestamp);
    return d.toLocaleDateString();
}

export function printableTime(timestamp) {
    if (timestamp == "") {
        return "";
    }
    let d = new Date(timestamp);

    // 2:26:43 AM
    return d.toLocaleTimeString();
}

export function printableTimeMins(timestamp) {
    if (timestamp == "") {
        return "";
    }

    // 2:26:43 AM
    let d = new Date(timestamp);

    // strip the seconds to return 2:26 AM
    let arr = d.toLocaleTimeString().split(" ");
    let t = arr[0].split(":");
    return t[0] + ":" + t[1] + " " + arr[1];
}

export function calDuration(startTs, stopTs) {
    let t1 = new Date(startTs);
    let t2 = new Date(stopTs);
    let elapsed_ms = t2 - t1;
    return elapsed_ms;
}

export function calEndTimeGivenStartAndDuration(startTs, durationMS) {
    let start = new Date(startTs);
    let end = start.valueOf() + Number(durationMS);
    return datetimeToHTMLFormat(end);
}

export function calStartTimeGivenEndAndDuration(endTs, durationMS) {
    let end = new Date(endTs);
    let start = end.valueOf() - Number(durationMS);
    return datetimeToHTMLFormat(start);
}

export function toDateInputValue(timestamp) {
    let ts = datetimeToHTMLFormat(timestamp);
    return ts.split("T")[0]; // YYYY-MM-DD
}

export function toTimeInputValue(timestamp) {
    let ts = datetimeToHTMLFormat(timestamp);
    return ts.split("T")[1]; // HH:MM:SS
}

export function toDateTimeInputValue(timestamp) {
    // ts: YYYY-MM-DDTHH:MM:SS
    return datetimeToHTMLFormat(timestamp);
}

export function msToHumanReadableTime(duration) {
    if (duration < 1) {
        return "0s";
    }
    let milliseconds = Math.floor((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    let result = "";
    if (hours > 0) {
        result += hours + "h ";
    }
    if (minutes > 0) {
        result += minutes + "m ";
    }
    if (seconds > 0) {
        result += seconds + "s";
    }
    return result;
}

/*
 * ################
 * Helpers
 * ################
 */
function datetimeToHTMLFormat(timestamp) {
    // Gets the standard time format: "yyyy-MM-ddThh:mm"
    // Used by HTML <Input type="datetime-local" .../>
    let date = new Date(timestamp);
    let [month, day, year] = [
        date.getMonth(),
        date.getDate(),
        date.getFullYear(),
    ];
    let [hours, minutes, seconds] = [
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
    ];
    // Adjustment to make the standardize form
    month = two_digits(month + 1); // month is 0-indexed
    day = two_digits(day);
    hours = two_digits(hours);
    minutes = two_digits(minutes);
    seconds = two_digits(seconds);
    return (
        [year, month, day].join("-") + "T" + [hours, minutes, seconds].join(":")
    );
}

function two_digits(n) {
    let s = n.toString();
    return n < 10 ? "0" + n : n;
}
