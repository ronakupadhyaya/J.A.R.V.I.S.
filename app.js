import express from 'express';
import bodyParser from 'body-parser';

// need to check if all env's are here, if not - throw an error

import { router, rtm, web } from './bot';
import routes from './routes';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Express started. Listening on port %s', port);
});
rtm.start();
