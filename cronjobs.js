import { RtmClient, WebClient, CLIENT_EVENTS, RTM_EVENTS } from '@slack/client';
import axios from 'axios';
import express from 'express';
import { messageConfirmation, getQueryParams } from './constants';
import { User, Reminder } from './models';

const router = express.Router();
const botToken = process.env.SLACK_BOT_TOKEN || '';
const rtm = new RtmClient(botToken);
const channel = 'T6AVBE3GX';

const currentDate = new Date().toISOString().substring(0, 10);

rtm.start();

rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
  Reminder.find()
    .then(function(reminders) {
      for(var i = 0; i < reminders.length; i++) {
        var reminder = reminders[i];
        console.log(reminder.date, currentDate);
        if(reminder.date === currentDate) {
          rtm.sendMessage(reminder.subject, reminder.userId);
        }
      }
      rtm.sendMessage("oi you cheeky bastard", "D69DB5HHP");
      require('mongoose').connection.close();
    });
});
