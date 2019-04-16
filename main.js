var config = require("./config.json");
var VoiceText = require("voicetext");
var voice = new VoiceText(config["vt-api-key"]);
var fs = require("fs");
var simplayer = require("simplayer");
var schedule = require("./schedules/" + process.argv[2] + ".json");
const {CronJob} = require("cron");

function saveVoiceFile(text, callback) {
  voice.speaker(voice.SPEAKER.HIKARI)
    .speed(150)
    .speak(text, function(e, buf) {
      fs.writeFile("./voice.wav", buf, "binary", function(e) {
        if (callback) {
          callback();
        }
      });
    });
}

function speak(text) {
  saveVoiceFile(text, function() {
    simplayer("./voice.wav", function(error) {
    });
  });
}

new CronJob("0 * * * * *", () => {
  var date = new Date();
  var minute = date.getMinutes();
  var hour = date.getHours();
  var key = hour + ":" + minute;
  speak(schedule[key]);
}, null, true);

