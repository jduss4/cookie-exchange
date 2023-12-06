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

## Prepare the data

Collect information from everyone with a Google Form, then export the responses to a google sheet to review. One column "Dietary requirements (this personal time, personal funds project cannot guarantee nut- or gluten-free kitchens; you assume your own risk, etc.)    " contains multiple pieces of information: if a person has a dietary requirement, if they can bake to accommodate a dietary requirement, if they neither have requirements nor can accommodate them, or if they have requirements and can meet them.

Create two new columns: Eater+ and Baker+. Copy paste the following formulas into each column's first response value, then drag down to auto-complete the rest. These columns will make it easier for a human to quickly scan and confirm dietary requirements / accommodations. Consider applying conditional formatting to highlight TRUE responses.

```
Eater+
=IF(REGEXMATCH(E2, "I have dietary requirements"), True, False)

Baker+
=IF(REGEXMATCH(E2, "I can accommodate dietary requirements"), True, False)
```

## Batch some cookies!

Download the form results CSV and place it at `data/cookie-responses.csv`. It should have the following column names (or you gotta rename them in the script):

```
Timestamp
Your name
Your personal email address
How many batches of cookies would you like to make?
"Dietary requirements (this personal time, personal funds project cannot guarantee nut- or gluten-free kitchens; you assume your own risk, etc.)    "
Eater+
Baker+
```

Run `./cookies.rb` to run the script! It will return a list of pairs of people along with their dietary requirement and accommodation statuses for spotchecking purposes. You can edit the script to output email addresses or other information, as well.

Not happy with the results? Check out the random seed in `cookie_manager.rb` and run the script again!
