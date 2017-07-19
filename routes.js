import express from 'express';
var router = express.Router();

import google from 'googleapis';

const OAuth2 = google.auth.OAuth2;

import { User } from './models';
import { getGoogleAuth } from './constants';

const scopes = [
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/calendar'
];

const calendar = google.calendar('v3');

router.post('/slack/interactive', function(req, res) {
  const result = JSON.parse(req.body.payload).actions[0];

  User.findOne({slackId: JSON.parse(req.body.payload).user.id})
  .then(function(user){
    if (!user) {
      console.log("User not found");
    } else {
      console.log(user);
      var googleAuth = getGoogleAuth();
      var pending = JSON.parse(user.pending);
      googleAuth.setCredentials(user.google);
      const event = {
        'description': pending.subject,
        'start': {
          'date': pending.date,
          'timeZone': 'America/Los_Angeles',
        },
        'end': {
          'date': pending.date,
          'timeZone': 'America/Los_Angeles',
        }
      };
      console.log(event);
      calendar.events.insert({
        auth: googleAuth,
        calendarId: 'primary',
        resource: event,
      }, function(err, event) {
        if (err) {
          console.log('There was an error contacting the Calendar service: ' + err);
          return;
        }
        console.log('Event created');
        user.pending = JSON.stringify({});
        user.save();
      });
    }
  })

  // calendar.events.insert({
  //   calendarId: 'primary',
  //   resource: event,
  // }, function(err, event) {
  //   if (err) {
  //     console.log('There was an error contacting the Calendar service: ' + err);
  //     return;
  //   }
  //   console.log('Event created');
  // });

  res.send(result.value);
});

router.get('/connect', function(req, res) {
  var userId = req.query.user;
  console.log("userId", userId);
  if (! userId){
    req.status(400).send('Missing id')
  } else{
    User.findById(userId)
    .then(function(user){
      if(!user){
        res.status(404).send('Cannot find user')
      } else{
        //GOOGLE AUTH STUFF HERE
        var googleauth = getGoogleAuth();

        var url = googleauth.generateAuthUrl({
          // 'online' (default) or 'offline' (gets refresh_token)
          access_type: 'offline',
          prompt: 'consent',
          // If you only need one scope you can pass it as a string
          scope: scopes,
          state: userId

          // Optional property that passes state parameters to redirect URI
          // state: { foo: 'bar' }
        });
        console.log('URL is',url);
        res.redirect(url) // at the end
      }

    })
  }
})

router.get('/connect/callback', function(req, res) {
  // console.log('bitches');
  // res.send('here')
  var googleAuth = getGoogleAuth();
  googleAuth.getToken(req.query.code, function (err, tokens) {
    // Now tokens contains an access_token and an optional refresh_token. Save them.
    if (err) {
      res.status(500).json({error:err});
      // oauth2Client.setCredentials(tokens);
    } else {
      googleAuth.setCredentials(tokens);
      var plus = google.plus('v1');
      plus.people.get({ auth: googleAuth, userId: 'me'}, function(err, googleUser){
        if(err) {
          res.status(500).json({error:err});
        } else {
          User.findById(req.query.state)
          .then(function(mongoUser){
            mongoUser.tokens = tokens;
            mongoUser.google = tokens;
            mongoUser.google.profile_id = googleUser.id;
            mongoUser.google.profile_name = googleUser.displayName;
            console.log(mongoUser);
            return mongoUser.save()
          })
          .then(function(mongoUser){
            res.send('You are now connected to Google Calendar API!');
            rtm.sendMessage('You are now connected to Google Calendar API!',
            mongoUser.slackDmId);
          })
          .catch(function(err){
            console.log('Error was', err);
          })
          // res.json({
          //   code: req.query.code,
          //   state: req.query.state,
          //   tokens,
          //   googleUser
          // })
        }
      })
    }

  });
})


export default router;
