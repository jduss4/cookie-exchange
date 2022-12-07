require_relative "../cookie_manager.rb"

describe MatchType do

  describe "#valid?" do
    context "given batches with dietary requirements" do
      context "when dietary requirements are met" do
        it "when email is different, returns true" do
          mt = MatchType.new(
            [[false,nil],[nil, false]],
            [{"email" => "A", "eater+" => true, "baker+" => false},
             {"email" => "B", "eater+" => false, "baker+" => true }
            ], 0, 1)
          expect(mt.valid?).to be_truthy
        end
        it "when email is the same, returns false" do
          mt = MatchType.new(
            [[false,nil],[nil, false]],
            [{"email" => "A", "eater+" => true, "baker+" => false},
             {"email" => "A", "eater+" => false, "baker+" => true }
            ], 0, 1)
          expect(mt.valid?).to be_falsey
        end
      end
    end

    context "given batches with no dietary requirements" do
      context "when row already has a match" do
        it "returns false" do
          mt = MatchType.new(
            [[false,true,false],
             [true,false,nil],
             [nil,nil,false]
            ],
            [{"email" => "A", "eater+" => false, "baker+" => false},
             {"email" => "B", "eater+" => false, "baker+" => false},
             {"email" => "C", "eater+" => false, "baker+" => false}
            ], 1, 2)
          expect(mt.rowHasMatch?).to be_truthy
          expect(mt.valid?).to be_falsey
        end
      end
      context "when column already has a match" do
        it "returns false" do
          mt = MatchType.new(
            [[false,true,false],
             [true,false,nil],
             [nil,nil,false]
            ],
            [{"email" => "A", "eater+" => false, "baker+" => false},
             {"email" => "B", "eater+" => false, "baker+" => false},
             {"email" => "C", "eater+" => false, "baker+" => false}
            ], 0, 1)
          expect(mt.columnHasMatch?).to be_truthy
          expect(mt.valid?).to be_falsey
        end
      end
    end
  end

end
