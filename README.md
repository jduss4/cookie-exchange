# Cookie Exchange Script

Not the finest script in the land, but potentially a good start.

## Install and run

Install Ruby (check `.ruby-version` for the version).

Install the dependencies:

```
gem install bundler
bundle install
```

Run the tests

```
bundle exec test
```

## Batch some cookies!

Download the form results CSV and place it at `data/cookie-responses.csv`. It should have the following column names (or you gotta rename them in the script), and you will notice `Eater+` and `Baker+` were created in the spreadsheet, though they were not part of the form itself. This is because these columns make it easy for a human to quickly review how many dietary requirements / dietary accommodations there are.

```
Timestamp
Your name
Your personal email address
How many batches of cookies would you like to make?
"Dietary requirements (this personal time, personal funds project cannot guarantee nut- or gluten-free kitchens; you assume your own risk, etc.)    "
Eater+
Baker+
```

Run `./cookies.rb` to run the script! It will return a list of pairs of people followed by a bunch of email content templates you may use, and then any people without matches will be listed at the bottom.
