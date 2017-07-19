import { RtmClient, WebClient, CLIENT_EVENTS, RTM_EVENTS } from '@slack/client';
import axios from 'axios';
import express from 'express';
import { messageConfirmation, getQueryParams } from './constants';
import { User } from './models';

const router = express.Router();
const botToken = process.env.SLACK_BOT_TOKEN || '';
const rtm = new RtmClient(botToken);
const web = new WebClient(botToken);

let channel = 'T6AVBE3GX';

// The client will emit an RTM.AUTHENTICATED event on successful connection, with the `rtm.start` payload
rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
  for (const c of rtmStartData.channels) {
	 if (c.is_member && c.name === 'general') { channel = c.id; }
  }
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
});

// you need to wait for the client to fully connect before you can send messages
rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
  // things to do when the bot connects to slack
});

rtm.on(RTM_EVENTS.MESSAGE, (msg) => {
  var dm = rtm.dataStore.getDMByUserId(msg.user);
  if (!dm || dm.id !== msg.channel || msg.type !== 'message') {
    return;
  }

  User.findOne({slackId: msg.user})
    .then((user) => {
      if (!user) {
        return new User(
          {
            slackId: msg.user,
            slackDmId: msg.channel,
            google: {}
          }).save();
      }
      return user;
    })
    .then(function(user) {
      // console.log('USER is',user);
      if(!user.google) {
        rtm.sendMessage(`Hello this is scheduler bot. I need to schedule reminders. Please visit http://localhost:3000/connect?user=${user._id} to setup Google Calendar`, msg.channel);
      } else {
        getQuery(msg.text, msg.user)
          .then(({ data }) => {
            switch (data.result.action) {
              case 'meeting.add':
                if (data.result.actionIncomplete) {
                  rtm.sendMessage(data.result.fulfillment.speech, msg.channel);
                } else {
                  console.log('Finish', data);
                  web.chat.postMessage(msg.channel, data.result.fulfillment.speech, messageConfirmation(data.result.fulfillment.speech, "remember to add code to actaully cancel the meeting/not schedule one"));
                  user.pending = JSON.stringify(Object.assign({}, data.result.parameters, { type: 'meeting' }));
                  user.save();
                }
                break;
              case 'reminder.add':
                if (data.result.actionIncomplete) {
                  rtm.sendMessage(data.result.fulfillment.speech, msg.channel);
                } else {
                  console.log('Finish', data);
                  // global_state = data.result.parameters;
                  web.chat.postMessage(msg.channel, data.result.fulfillment.speech, messageConfirmation(data.result.fulfillment.speech, "remember to add code to actaully cancel the meeting/not schedule one"));
                  user.pending = JSON.stringify(Object.assign({}, data.result.parameters, { type: 'reminder' }));
                  user.save();
                }
                break;
              default:
                console.log('default statement');
                console.log(data.result.action);
                if (data.result.action === 'bestbot.reply' || data.result.action.startsWith('smalltalk.')) {
                  rtm.sendMessage(data.result.fulfillment.speech, msg.channel);
                }
                return;
            }
            return;
          })
          .catch((err) => {
            console.log('error is ', err);
          });
      }
    });
});

function getQuery(msg, sessionId) {
  return axios.get('https://api.api.ai/api/query', {
    params: getQueryParams(msg, sessionId),
    headers: {
      Authorization: `Bearer ${process.env.API_AI_TOKEN}`
    }
  });
}

export { web, rtm };
