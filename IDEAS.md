# Ideas

## Features

### Suggestions command (IN PROGRESS)
This command will suggest an anime to the user.

This can take optional paramters such as genre which will refine the search.

If the user has linked a profile, the application could avoid suggesting watched shows by parsing their animelist.

Optionally support manga

### Viewing schedule command
Manage/view viewings

Make suggestion to viewing through subcommand

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
