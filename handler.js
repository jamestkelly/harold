'use strict';
Promise = require('bluebird');
var rp = require('request-promise');
var fs = require('fs');

module.exports.run = (event, context) => {

  var memberBlacklist = [
    "U34BXH2P7", // -> plusplus
    "U32D1PZ08", // -> ed
    "U7G33RG22" // -> brunna
  ];

  const U30_SLACK_CHANNEL_ID = process.env.U30_SLACK_CHANNEL_ID;
  const GROUP_INFO_URL = process.env.GROUP_INFO_URL;
  const U30_WEBHOOK_URL = process.env.U30_WEBHOOK_URL;
  const OAUTH_TOKEN = process.env.OAUTH_TOKEN;

  var getRandomUser = function() {

    console.log("getRandomUser()");

    const options = {
      method: 'POST',
      uri: GROUP_INFO_URL,
      simple: false,
      resolveWithFullResponse: true,
      headers: {
        "content-type": "multipart/form-data"
      },
      form: {
        token: OAUTH_TOKEN,
        channel: U30_SLACK_CHANNEL_ID
      }
    };

    return rp(options).
    then(r => {
      var body = JSON.parse(r.body);
      var randomIndex = Math.floor(Math.random() * (body.group.members.length));
      console.log("[getRandomUser] userList[" + randomIndex + "]: " + body.group.members[randomIndex]);
      console.log("memberBlacklist: " + memberBlacklist);
      while (memberBlacklist.indexOf(body.group.members[randomIndex]) > -1){
        console.log("User Blacklisted - Reroll");
        randomIndex = Math.floor(Math.random() * (body.group.members.length));
        console.log("[getRandomUser] userList[" + randomIndex + "]: " + body.group.members[randomIndex]);
      }
      var questionArr = [body.group.members[randomIndex]];
      console.log("just configuring the random index " + randomIndex);
      return questionArr;
    })
  }

  var getRandomQuestion = function(questionArr) {
    console.log("getRandomQuestion - START")

    return new Promise(function(resolve, reject) {
      var filename = "questions.txt"
      console.log("[getRandomQuestion] opening filename: " + filename);
      return fs.readFile(filename, function(err, data) {
        if (err) reject(err);

        data = data += '';
        var lines = data.split('\n');
        var line = lines[Math.floor(Math.random() * lines.length)];
        console.log("[getRandomQuestion] Got Line: " + line);
        questionArr.push(line);
        resolve(questionArr);
      });
    });

  }

  var createDirectedQuestion = function(questionArr) {
    console.log("createDirectedQuestion - START")

    var memberId = questionArr[0];
    var line = questionArr[1];
    return new Promise(function(resolve, reject) {
      var regex = /\d+\) /;
      line = line.replace(regex, "");
      console.log("[createDirectedQuestion] Line: " + line);
      console.log("[createDirectedQuestion] memberId: " + memberId);
      var postString = "<@" + memberId + ">: " + line;
      console.log("[createDirectedQuestion] directedQuestion: " + postString);
      resolve(postString);
    });
  }

  var postMessage = function(postString) {
    console.log("[postMessage] postString: " + postString);
    const options = {
      method: 'POST',
      uri: U30_WEBHOOK_URL,
      body: {
        text: postString
      },
      json: true // Automatically stringifies the body to JSON
    };

    return rp(options)
      .then(r => {
        console.log("[postMessage] Response: " + r);
      })
  }

  // Let's go Harold!\
  getRandomUser()
    .then(getRandomQuestion)
    .then(createDirectedQuestion)
    .then(postMessage)

};
