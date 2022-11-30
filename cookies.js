var shuffleSeed = require('shuffle-seed');

// Read a CSV in

// This script does something kinda wild.
//   We're gonna use a matrix. I may have regrets.
//   I blame my friend Wesley, a mathy person, for the idea.
//   We'll use an array of arrays, NxN where N
//   is the number of batches being made

let haveDietMatch = (batch1, batch2) => {
  return (checkDietReq(batch1, batch2) && checkDietReq(batch2, batch1));
}

let checkDietReq = (eater, baker) => {
  return (!eater["eater+"] || eater["eater+"] && baker["baker+"]);
}

// regardless of whether this is batch 1 or 2, we don't want the same
// person matched up against themselves
let areDifferentPeople = (rbatch, cbatch) => {
  return rbatch["email"] != cbatch["email"];
}

let checkMatrixColumn = (matrix, cindex) => {
  rowValues = matrix.map((row) => row[cindex]);
  return rowValues.includes(true);
}

let checkMatrixRow = (matrix, rindex) => {
  return matrix[rindex].includes(true)
}

let cookieTime = (formResults) => {
  var matrixBatches = createMatrixBatches(formResults);
  var matrix = createMatrix(matrixBatches);
  var results = getResults(matrix, matrixBatches);
  printResults(results)
}

let createMatrixBatches = (formResults) => {
  var batches = []
  for (var row in formResults) {
    var batchNum = formResults[row]["batches"];
    for (var i = 1; i <= batchNum; i++) {
      // TODO I have had such rotten luck trying to clone
      // this object so that it won't screw up later in the
      // script. I give up, JavaScript, you win, I'll just
      // freaking make an entirely new object, are you happy?
      var individual = {
        "name" : formResults[row]["name"],
        "email" : formResults[row]["email"],
        "eater+" : formResults[row]["eater+"],
        "baker+" : formResults[row]["baker+"],
        "batches" : formResults[row]["batches"],
        "batchNum" : i
      }
      batches.push(individual)
    }
  }
  return shuffle(batches)
}

let createMatrix = (batches) => {
  // create an array of arrays to provide a matrix
  // for each batch
  var matrix = []
  let batchNum = batches.length;
  for (var i = 0; i < batchNum; i++) {
    matrix.push(Array(batchNum));
  }
  return matchBatches(matrix, batches);
}

let getResults = (matrix, batches) => {
  // make a shallow copy of the matrix
  var results = {
    "matched" : [],
    "unmatched": []
  }

  // handy debug line if you want to get a list of the people
  // console.log(batches.map(person => person["name"] + person["batchNum"]))
  for (var rindex = 0; rindex < matrix.length; rindex++) {
    var person1 = batches[rindex];
    // find the index of the first (and hopefully only) "true" value in a row
    var cindex = matrix[rindex].findIndex(column => column);

    // if a row's index is greater than the column's index
    // then you know we already got this result from the matching entry in the matrix
    if (cindex === -1) {
      // console.log("Person " + person1["name"] + person1["batchNum"] + " has no match")
      results["unmatched"].push(person1);
    } else if (rindex < cindex) {
      var person2 = batches[cindex];
      // console.log("Pair: " + person1["name"] + person1["batchNum"] + " " + person2["name"] + person2["batchNum"])
      results["matched"].push([person1, person2])
    }
  }
  return results;
}

// iterate through each element of the matrix, checking
// against its row and column batch to see if it is an invalid or
// valid pair for cookie magic
let matchBatches = (matrix, batches) => {
  for (var rindex = 0; rindex < matrix.length; rindex++) {
    for (var cindex = 0; cindex < matrix.length; cindex++) {
      if (matrix[rindex][cindex] !== undefined) { continue; }
      match = validateMatch(matrix, batches, rindex, cindex);
      // we can assume that if person A & D have a status, D & A has the same
      matrix[rindex][cindex] = match
      matrix[cindex][rindex] = match
    }
  }
  return matrix;
}

//////////////////////
// TODO this is where something nice should spit out,
// like a series of emails with the people addressed already, etc
//////////////////////
let printResults = (results) => {
  // uncomment to print out the JSON itself
  // console.log(JSON.stringify(results, null, 4))
  results["matched"].forEach( pair => {
    var p1 = pair[0];
    var p2 = pair[1];
    var msg = `
    ------------
    Dear ${p1["name"]} and ${p2["name"]},
    You have been matched up as partners for the cookie exchange!

    TODO: debug lines to make sure diets look okay
    ${p1["name"]} has a dietary restriction: ${p1["eater+"]}
    ${p2["name"]} has a dietary restriction: ${p2["eater+"]}

    ${p1["name"]} accommodates dietary restriction: ${p1["baker+"]}
    ${p2["name"]} accommodates dietary restriction: ${p2["baker+"]}
    ------------
    `;
    console.log(msg)
  })

  results["unmatched"].forEach( sadPerson => {
    console.log("PLEASE FIND A MATCH FOR THIS PERSON: " + sadPerson["name"])
  })
}

let shuffle = (batches) => {
  // shuffle the batches so that pairing isn't determined
  // by the order in which the form was filled out
  return shuffleSeed.shuffle(batches, "cookie");
}

let validateMatch = (matrix, batches, rindex, cindex) => {
  // if both batches are different person
  // and there are complementary dietary needs
  // and this row does not already contain a match
  // and this column does not already contain a match
  let rbatch = batches[rindex];
  let cbatch = batches[cindex];

  return (areDifferentPeople(rbatch, cbatch)
    && haveDietMatch(rbatch, cbatch)
    && !checkMatrixRow(matrix, rindex)
    && !checkMatrixColumn(matrix, cindex)
  )
}

module.exports = {
  cookieTime: cookieTime,
  createMatrixBatches: createMatrixBatches,
  haveDietMatch: haveDietMatch
}
