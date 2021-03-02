'use strict';

const {default: axios} = require('axios');
const querystring = require('querystring');
const fs = require('fs').promises;

module.exports.run = async (event, context) => {

  const memberBlacklist = [
    "U34BXH2P7", // -> plusplus
    "U32D1PZ08", // -> ed
    "U7G33RG22" // -> brunna
  ];

  const U30_SLACK_CHANNEL_ID = process.env.U30_SLACK_CHANNEL_ID;
  const GROUP_INFO_URL = 'https://slack.com/api/conversations.members';
  const USER_INFO_URL = 'https://slack.com/api/users.info';
  const MAX_MEMBERS = 200; //Slack recommends no more than 200 at once -> otherwise paginate
  const U30_WEBHOOK_URL = process.env.U30_WEBHOOK_URL;
  const OAUTH_TOKEN = process.env.OAUTH_TOKEN;
  const QUESTIONS_FILE = "questions.txt"


  const fetchUsers = async ({cursor}) => {
    const options = {
      headers: {'authorization': `Bearer ${OAUTH_TOKEN}`}
    }
    const params = querystring.stringify({
       channel: U30_SLACK_CHANNEL_ID,
       limit: MAX_MEMBERS,
       ... cursor && {cursor}
    });

    const res = await axios.post(GROUP_INFO_URL, params, options).catch((err) => {
      console.error('Fetching Slack Channel Members failed', err);
      throw err;
    });

    if (!res.data.ok){
      console.error('Fetching Slack Channel Members failed', res.data.error);
      throw new Error(res.data.error);
    };

    // Pagination
    if (res.data.response_metadata.next_cursor != ""){
      return [...res.data.members, await fetchUsers({cursor: res.data.response_metadata.next_cursor})]
    } else {
      return res.data.members
    }
  };

  // Checks if user is valid in Slack - eg. not deactivated or a bot
  const isValid = async ({user}) => {
    const options = {
      headers: {'authorization': `Bearer ${OAUTH_TOKEN}`},
      params: { user }
    }
    const res = await axios.get(USER_INFO_URL, options);
    if (!res.data.ok){
      console.error('Checking Slack User failed', res.data.error);
      throw new Error(res.data.error);
    };

    if (res.data.user.deleted || res.data.user.is_bot){
      return false;
    }
    return true;
  }

  const getRandomUser = async () => {
    const members = await fetchUsers({});

    while(true){
      const user = members[Math.floor(Math.random() * members.length)];
      if (memberBlacklist.includes(user) || !(await isValid({user}))){
        continue;
      }
      return user;
    }
  };

  const getRandomQuestion = async () => {
    const data = await fs.readFile(QUESTIONS_FILE, {encoding: "utf-8"}).catch((err) => {
      console.error('Failed to read questions file', err);
      throw err;
    });
    const questions = data.split('\n');
    const question = questions[Math.floor(Math.random() * questions.length)];
    return question;
  };

  const sendQuestion = async ({question, member}) => {
    const text = `<@${member}>: ${question}`;
    await axios.post(U30_WEBHOOK_URL, {text}).catch((err) => {
      console.error('Failed to send question to Slack U30 Channel', err);
      throw err;
    });
  }

  const [member, question] = await Promise.all([getRandomUser(), getRandomQuestion()]);
  await sendQuestion({member, question});
};
