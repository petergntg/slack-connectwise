var express = require('express'),
    slackCW = require('../slack-connectwise'),
    Q = require('q');

var SLACK_SLASH_TOKEN = process.env.SLACK_SLASH_TOKEN;

if (!SLACK_SLASH_TOKEN) {
    throw new Error('SLACK_SLASH_TOKEN env variable must be set.');
}

var router = express.Router();

router.post('/api/slack', function (req, res, next) {
    if (req.body && req.body.token === SLACK_SLASH_TOKEN) {
        /** @type SlackMessage */
        var response = {
            username: req.body.user_name,
            text: 'Working on it.',
            response_type: 'in_channel'
        };

        var timeout = setTimeout(function () {
            res.json(response);
            timeout = null;
        }, 1000);

        slackCW.route(req.body, function (msg) {

            if (timeout !== null) {
                clearTimeout(timeout);
                res.status(200).end();
            }

            slackCW.send(req.body, msg);
        });

    } else {
        res.status(401).end();
    }
});

module.exports = router;
