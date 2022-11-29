var shuffleSeed = require('shuffle-seed');

// Read a CSV in

// For anybody who said they would make two batches
//   make them a second entry in the big list

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

let createBatches = (formResults) => {
  var batches = []
  for (var row in formResults) {
    var batchNum = formResults[row]["batches"];
    for (var i = 1; i <= batchNum; i++) {
      // clone the formResults object
      var individual = Object.create(formResults[row])
      // add a batch number to help with understanding match ups later
      individual["batchNum"] = i
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
  return matrix;
}

let getResults = (matrix, batches) => {
  // make a shallow copy of the matrix
  var peopleChecklist = Array(matrix.length)

  // handy debug line if you want to get a list of the people
  // console.log(batches.map(person => person["name"] + person["batchNum"]))
  for (var rindex = 0; rindex < matrix.length; rindex++) {
    // find the index of the first (and hopefully only) "true" value in a row
    var cindex = matrix[rindex].findIndex(column => column);
    person1 = batches[rindex]
    person2 = batches[cindex]
    if (person1 && person2) {
      console.log("Pair: " + person1["name"] + person1["batchNum"] + " " + person2["name"] + person2["batchNum"])
    } else {
      console.log("Person " + batches[rindex]["name"] + " has no match")
    }
  }
}

let main = (results) => {
  var batches = createBatches(results);
  var emptyMatrix = createMatrix(batches);
  var completeMatrix = matchBatches(emptyMatrix, batches);
  var results = getResults(completeMatrix, batches);
  printResults(completeMatrix, results)
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

let printResults = (matrix, batches) => {
  console.log("just for fun, this is what your matrix looks like")
  console.log(matrix)
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
  haveDietMatch: haveDietMatch,
  createBatches: createBatches,
  main: main
}
