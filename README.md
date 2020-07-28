<!--
title: Harold The Question Bot
layout: Doc
-->

# harold-question-bot

A simple slack bot which will ask a random member of the #under30s channel a random question

## Cron Schedule
Runs Monday to Friday at 10.15am AEDT

## About
Project is deployed using the serverless framework.

Harold runs as a nodeJS Lambda which is triggered on a Cron Schedule. He uses the `groups.info` Slack API to retrieve a list of user's for a channel and then sends a question to the channel via a webhook. You can access Harold's slack integration options from here: https://api.slack.com/apps/A81E1D9U1 If you do not have access PM @sean on Slack to be added as a contributor.

The list of questions is provided as a separate text file resource to the main application logic.

## Blacklisting Users

Since the `groups.info` returns all members of a group, it will also return inactive users and bots. Harold has a simple blacklist mechanism which takes an array of userID's and reselects a user if a blacklisted user is chosen. To blacklist a user, simply add their userID to the memberBlacklist array in `handler.js`.

An additional script is supplied called `ID_checker.js` which retrieves the name and userID of all members in a channel to aid with determining members' userIDs.

The ID checker app can be run locally with:

`node ID_checker.js`


## Deploy

To deploy harold, configure serverless credentials locally and then run:

`sls deploy --aws-profile default --verbose`


## Secrets

This is a quick and dirty script, there is no secrets management here. As such, secrets are removed during git commits and will need to be manually updated when doing a serverless deploy. Before performing a `sls deploy` please ensure you have updated the `TOKEN` and `WEBHOOK_URL` variables in the top of `handler.js` (and `ID_checker.js`)

## Notes
TOKEN constant is the Oauth token