# Ideas

## Features

### Suggestions command improvments

If the user has linked a profile, the application could avoid suggesting watched shows by parsing their animelist.

### Viewing schedule command
Manage/view viewings

A couple options.

1. Use this as a test bed for seperation of backend logic and front-end client by moving backend logic to REST API. This will allow me to create a web UI to manage viewings (which would arguably be more user-friendly than using console). Hosts can access the web UI to create/modify/delete viewings, as well as set reminders, descriptions, modify which shows are to be voted on.

2. Stick to managing it all through the command line. This could be feasible if user interaction is simple and a private channel exists for viewing management through the bot.
```
viewing create --date "friday" --host "
viewing suggest friday anilist_url
```

**Creation Configurables**

_date_: It would be cool if we could parse the date param like Todoist, be very freeform and fill in blanks.
_host_: default to author. To work with web UI solution, would need db full of hosts so we can link to discord user.
_description_: Is this needed? Can I get away with _type_ that says Movie|Show (and then restrict suggestions)

**Suggestion subcommand**

Can pass a link to show. Can pass a string title which will search anilist, this would require confirmation via emoticon response. Should validate if show or movie. Should validate if already suggested. Needs to neatly allow users to specify which viewing they are suggesting for? Is this how it works? Should it just go in a pool which allows hosts to select from the suggestion pool?

 - Only allow one suggestion per person

**Vote subcommand**

Once shows have been suggested, you should be able to vote on them. Need to specify which viewing. One vote per person per viewing. Easy to see votes.

 - Dont let people vote on their own suggestions

### Info commands
Returns info like version, where to report issues, source, etc.

## Stability

### Build pipeline

Automate linting and testing (if that's possible) and incrementing of versions on new build.

### Automated deployment

Automate deploy of code to AWS and reloading node processes

### Containerisation

### Clustering

Surely you can cluster Discord processes without them receiving the same messages? SPOF sucks.

### Tests

How the fuck do I unit/integration test this shit?

## Maintainability

### Factories

I'm creating classes and injectind dependencies which is a major ball-ache. Would be better to use factory pattern and have, for example, factories create DAL with database connection object injection. (On that note, can I create db without duplicating initialization?)

### Non-relative require / Namepsacing

Is this possible in NodeJS? Relative requires is ugly and a pain to maintain.
