# TODO might be better if the batches were objects
# and knew more about themselves
class MatchType
  def initialize(matrix, batches, batch1_idx, batch2_idx)
    @matrix = matrix
    @batches = batches
    @batch1 = batches[batch1_idx]
    @batch2 = batches[batch2_idx]
    @batch1_idx = batch1_idx
    @batch2_idx = batch2_idx
  end

  def areDifferentPeople?
    @batch1["email"] != @batch2["email"]
  end

  def checkDietReq(eater, baker)
    !eater["eater+"] ||
    (eater["eater+"] && baker["baker+"])
  end

  def columnHasMatch?
    @matrix.map { |row| row[@batch2_idx]}.include?(true)
  end

  def dietMatches?
    checkDietReq(@batch1, @batch2) &&
    checkDietReq(@batch2, @batch1)
  end

  def rowHasMatch?
    @matrix[@batch1_idx].include?(true)
  end

  def valid?
    areDifferentPeople? &&
    dietMatches? &&
    !rowHasMatch? &&
    !columnHasMatch?
  end
end
