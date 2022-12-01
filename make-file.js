//generate a file data.yml based on data.yml.example
//if data.yml exists, it will be overwritten
//if data.yml.example does not exist, it will be created
//if data.yml.example exists, it will be copied to data.yml
import * as fs from 'fs'
import * as path from "path";
import * as YAML from 'yaml';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tags = ["OFFSITE", "ONSITE", "development", "frontend - web"];
const projects = [
  "Pengelolaan E-Registrasi RSUD: develop web version",
  "Data Encryption",
];

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};
function getDates(startDate, stopDate) {
  var dateArray = new Array();
  var currentDate = startDate;
  console.log(startDate, stopDate);
  while (currentDate <= stopDate) {
    var dayOfWeek = currentDate.getDay();
    var isWeekend = dayOfWeek === 0;
    if(!isWeekend){
      dateArray.push(new Date(currentDate));
    }
    currentDate = currentDate.addDays(1);
  }
  return dateArray;
}

function timestrToSec(timestr) {
  var parts = timestr.split(":");
  return parts[0] * 3600 + parts[1] * 60;
}

function pad(num) {
  if (num < 10) {
    return "0" + num;
  } else {
    return "" + num;
  }
}

function formatTime(seconds) {
  return [
    pad(Math.floor(seconds / 3600)),
    pad(Math.floor(seconds / 60) % 60),
    pad(seconds % 60),
  ].join(":");
}

const jsonTemplate = {
  date: "2019-01-01",
  tracker: [
    {
      project: "",
      task: "Create pendaftaran pasien baru service & bug fix penjadwalan",
      tags: "",
      time_from: "",
      time_to: "",
    },
  ],
};

const dates = getDates(new Date(2022, 10, 1), new Date(2022, 10, 31));

const absences = []
dates.forEach((date) => {
  const copy = {...jsonTemplate};
  copy.date = date.toISOString().split('T')[0];
  const tracker = [];
  const task = "Create pendaftaran pasien baru service & bug fix penjadwalan";
  const project = projects[getRandomInt(0, projects.length)];
  const tagsVal = [...tags].splice(getRandomInt(0, 1), 1);
  const randomStartHour = getRandomInt(8, 14);
  const randomStartMinutes = getRandomInt(0, 59);
  const time_from = formatTime(timestrToSec(`${pad(randomStartHour)}:${pad(randomStartMinutes)}`));
  const stopHour = randomStartHour + 8;
  const randomStopMinutes = getRandomInt(0, 59);
  const time_to = formatTime(timestrToSec(`${pad(stopHour)}:${pad(randomStopMinutes)}`));
  tracker.push({project, task, tags: tagsVal, time_from, time_to});
  copy.tracker = tracker;

  absences.push(copy);
})
const doc = new YAML.Document();
doc.contents = absences;

//create or replace data.yml
fs.writeFileSync(path.join(__dirname, 'data.yml'), doc.toString());


