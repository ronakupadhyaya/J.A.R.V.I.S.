import express from 'express';
var router = express.Router();

router.post('/slack/interactive', function(req, res) {
    console.log('////////////////////// Log result that was recieved /////////////////////////');
    const result = JSON.parse(req.body.payload).actions[0];
    console.log(result);

    res.send(result.value);
});

export default router;
