var _ = require('lodash');


// Read a CSV in

// For anybody who said they would make two batches
//   make them a second entry in the big list

// Now, we're gonna do something kinda wild.
//   We're gonna build a matrix. I already have regrets.
//   I blame my friend Wesley, a mathy person, for the idea.

// We'll need an array of arrays, NxN where N
//   is the number of batches being made

let haveDietMatch = (batch1, batch2) => {
  return (checkDietReq(batch1, batch2) && checkDietReq(batch2, batch1));
}

let checkDietReq = (eater, baker) => {
  return (!eater["eater+"] || eater["eater+"] && baker["baker+"]);
}

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
    for (var i = 0; i < batchNum; i++) {
      batches.push(formResults[row])
    }
  }
  // shuffle the batches so that pairing isn't determined
  // by the order in which the form was filled out
  return _.shuffle(batches);
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

let main = (results) => {
  var batches = createBatches(results)
  var emptyMatrix = createMatrix(batches);
  var completeMatrix = matchBatches(emptyMatrix, batches)
  console.log(completeMatrix)
  printResults(completeMatrix, batches)
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
  for (var rindex = 0; rindex < matrix.length; rindex++) {
    // find the index of the first (hopefully only) "true" value in a row
    var cindex = matrix[rindex].findIndex(column => column);
    person1 = batches[rindex]
    person2 = batches[cindex]
    if (person1 && person2) {
      console.log("Pair: " + person1["name"] + " " + person2["name"])
    } else {
      console.log("Person " + batches[rindex]["name"] + " has no match")
    }
  }
}

let validateMatch = (matrix, batches, rindex, cindex) => {
  // if both batches are different person
  // and there are complementary dietary needs
  // and this row does not contain a match
  // and this column does not contain a match
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
