# J.A.R.V.I.S.

To run the app, run this command:  
```
npm install  
npm run dev  
```
Wait for the webpack to fully start if nothing shows up. Refresh once completed and you should see results. 

# Overview
J.A.R.V.I.S. is an intelligent Slack bot that allows creating Google Calendar invites and reminders using natural language queries. 

## Architecture Overview
J.A.R.V.I.S. is architected using interactive processes for statefully managing multi-step chat interactions such as scheduling conflicts, cancellations, and confirmations. We used Slack Real-time Messaging API and Interactive Messages to facilitate meeting and reminder creation within Slack. The user-friendly natural language based bot interface boasts seamless OAuth flow for Google Calendar inside Slack.
