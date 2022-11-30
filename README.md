# Cookie Exchange Script

Not the finest script in the land, but potentially a good start.

## Install and run

Install node + npm. Get the dependencies:

```
npm install
```

Run the tests

```
npm test
```

## TODO

This script is missing an entry point. It will need a CSV, something that reads the CSV and makes it look like example below, and then some way for `cookieTime()` to get that information.

```
  {
    "name": "Jess",
    "email": "jess@gmail.com",
    "eater+": false, // dietary requirement
    "baker+": true,  // accommodates dietary requirements
    "batches": 2
  }
```

The script is also missing something fairly big -- it's not checking if any people matches are duplicates. So, maybe implement that somewhere, too?  Sorry, just ran out of time.

Oh yeah, and the tests are rubbish, it needs more tests.

Probably just to be refactored in general now that I figured out how to get (most) of the logic right (besides the duplicate pairs thing).
