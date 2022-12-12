require "csv"
require_relative "match_type.rb"

class CookieManager
  def initialize(csv_filepath)
    @csv = parse_volunteers(csv_filepath)
  end

  def batches
    @batches ||= createBatches
  end

  # take the volunteers and add a "batch" for
  # each number of cookie batches they said they would make
  def createBatches
    expanded = []
    @csv.each do |row|
      batchNum = row["batches"].to_i
      batchNum.times do |i|
        # clone the batch so that you won't overwrite it
        # on the second time through the loop
        newBatch = row.clone
        newBatch["batchNum"] = i+1
        expanded << newBatch
      end
    end
    @batches = expanded.shuffle(random: Random.new(1))
  end

  def createMatrixAndMatches
    # iterate through each element of the array, checking against
    # its row and column batch to see if it is a valid pair for cookie magic
    matrix.each_with_index do |row, rowIndex|
      row.each_with_index do |entry, colIndex|
        # if this value has already been set to true or false
        # then we don't need to check it again
        next if !entry.nil?
        matchType = MatchType.new(matrix, batches, rowIndex, colIndex)
        setMatrixValue(rowIndex, colIndex, matchType.valid?)
      end
    end
  end

  def debugPersonDiet(p)
    report = p["name"]
    report << " eater+" if p["eater+"]
    report << " baker+" if p["baker+"]
    report
  end

  def emptyMatrix
    # create an array of arrays representing each batch
    # matched up with another batch
    array = []
    batches.length.times { |time| array << Array.new(batches.length) }
    @matrix = array
  end

  def parse_volunteers(csv_filepath)
    raw = CSV.read(csv_filepath)
    raw.map do |row|
      {
        "name" => row[1],
        "email" => row[2],
        "eater+" => (row[5] == "TRUE"),
        "baker+" => (row[6] == "TRUE"),
        "batches" => row[3]
      }
    end
  end

  def makePairs
    @matched = []
    @unmatched = []

    pairs = []

    matrix.each_with_index do |row, row_index|
      person1 = batches[row_index]
      # find the index of the first (hopefully only) "true" value in a row
      col_index = matrix[row_index].find_index { |col| col }
      # if the row's index is greater than the column's
      # then you know we already got this result from the matching entry in the matrix

      if col_index.nil?
        @unmatched << person1
      elsif row_index < col_index
        pairKey = "#{batches[row_index]["email"]}-#{batches[col_index]["email"]}"
        if pairs.include?(pairKey)
          puts "Found a duplicate batch for #{person1} and #{person2}"
          @unmatched << person1
          @unmatched << person2
        else
          person2 = batches[col_index]
          @matched << [person1, person2]
        end
      end
    end
  end

  def matrix
    @matrix ||= emptyMatrix
  end

  def printReport
    puts "Pairs:"
    @matched.each do |pair|
      p1 = pair[0]
      p2 = pair[1]
      # TODO something is wrong in terms of pulling from double batches
      puts "#{debugPersonDiet(p1)} and #{debugPersonDiet(p2)}"
#       puts "Email: #{p1["email"]}, #{p2["email"]}"
#       puts %{
# Hello #{p1["name"]} and #{p2["name"]},

# You will be exchanging cookies for this year's TTS cookie exchange!

# Please trade addresses, talk accommodations, and plan any other aspects
# of exchanging delicious cookies.

# Let Heather B know if you have any questions, and have fun!

# Sincerely,

# }
    end

    puts "\n-----------------\nUnmatched or in need of de-duping"
    @unmatched.each do |person|
      puts "#{person["name"]}"
    end
  end

  def run
    createBatches
    createMatrixAndMatches
    makePairs
    printReport
  end

  def setMatrixValue(index1, index2, value)
    # if person A & D have a value, then D & A have the same value
    matrix[index1][index2] = value
    matrix[index2][index1] = value
  end

end
