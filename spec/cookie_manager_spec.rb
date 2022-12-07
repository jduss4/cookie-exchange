require_relative "../cookie_manager.rb"

describe CookieManager do

  describe "#createBatches" do
    context "given a standard csv with 4 people and 5 batches" do
      batches = CookieManager.new("test/fake_data.csv").createBatches
      it "should create 5 batches" do
        expect(batches.length).to eq(5)
      end
      it "should have two batches for one person" do
        d = batches.select { |batch| batch["name"] == "PersonD" }
        expect(d.length).to eq(2)
        expect(d[0]["batchNum"]).not_to eq(d[1]["batchNum"])
      end
    end
  end

  describe "#createMatrixAndMatches" do
    context "given a standard csv" do
      skip "should create a matrix" do
        cm = CookieManager.new("test/fake_data.csv")
        cm.createMatrixAndMatches
        # TODO
      end
    end
  end

  describe "#run" do
    context "given a standard csv" do
      cm = CookieManager.new("test/fake_data.csv")
      skip "should create 4 pairs and 1 leftover" do
        results = cm.run
        # expect(results["matched"].length).to eq(2)
        # expect(results["unmatched"].length).to eq(1)
      end
    end
  end
end
