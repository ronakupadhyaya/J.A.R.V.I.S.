import { RtmClient, WebClient, CLIENT_EVENTS, RTM_EVENTS } from '@slack/client';
import axios from 'axios';
import express from 'express';
import { messageConfirmation } from './constants';

let router = express.Router();
let bot_token = process.env.SLACK_BOT_TOKEN || '';
let rtm = new RtmClient(bot_token);
let web = new WebClient(bot_token);

let channel = 'T6AVBE3GX';

// The client will emit an RTM.AUTHENTICATED event on successful connection, with the `rtm.start` payload
rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
    for (const c of rtmStartData.channels) {
        if (c.is_member && c.name === 'general') { channel = c.id }
    }
    console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
});

// you need to wait for the client to fully connect before you can send messages
rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function () {
    // things to do when the bot connects to slack
});

rtm.on(RTM_EVENTS.MESSAGE, function (msg) {
    var dm = rtm.dataStore.getDMByUserId(msg.user);
    if (!dm || dm.id !== msg.channel || msg.type !== 'message') {
        return;
    }
    getQuery(msg.text, msg.user)
        .then(function ({ data }) {
            switch (data.result.action) {
                case 'meeting.add':
                    console.log(data);
                    if (data.result.actionIncomplete) {
                        rtm.sendMessage(data.result.fulfillment.speech, msg.channel);
                    } else {
                        web.chat.postMessage(msg.channel, data.result.fulfillment.speech, messageConfirmation(data.result.fulfillment.speech, "remember to add code to actaully cancel the meeting/not schedule one"));
                    }
                    break;
                default:
                    if (data.result.action === 'bestbot.reply' || data.result.action.startsWith('smalltalk.')) {
                        rtm.sendMessage(data.result.fulfillment.speech, msg.channel);
                    }
                    return;
            }
        })
        .catch(function (err) {
            console.log('error is ', err);
        });
});

function getQuery(msg, sessionId) {
    return axios.get('https://api.api.ai/api/query', {
        params: {
            v: 20150910,
            lang: 'en',
            timezone: '2017-07-17T21:07:49-0700',
            query: msg,
            sessionId: sessionId
        },
        headers: {
            Authorization: `Bearer ${process.env.API_AI_TOKEN}`
        }
    })
}

export { web, rtm };
