# fellow-discord-bot

A discord bot for the AniFellows discord server

The code in this repository is horribly hacky and by no means an example of good code.

=

To run this bot, you need to create a JSON file at the top-level of this repo called .config.json with contents
```
{
    "token": your bot token,
    "prefix": your desired command prefix,
    "activity": the bot activity you desire,
}
```

Then run the following:
```
npm install
node bot.js
```

or you can run this using pm2
```
npm install -g pm2
pm2 start bot.js --watch
```
