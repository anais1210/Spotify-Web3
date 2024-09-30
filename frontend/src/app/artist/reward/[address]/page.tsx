"use client";
import { useEffect, useState } from "react";
import { fetchArtistByAddress } from "@/api/artists.api";
import { RewardProps, fetchRewardById } from "@/api/reward.api";
import Link from "next/link";
import { FaMedal } from "react-icons/fa";
import { darkTheme, TransactionButton } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import { contractToken as contract } from "@/contracts/contracts";

interface ArtistDetailProps {
  params: {
    address: string;
  };
}

const Reward = ({ params }: ArtistDetailProps) => {
  const [rewardIds, setRewardIds] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [rewards, setRewards] = useState<RewardProps[]>([]);

  // Fetch Reward IDs
  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const fetchedArtist = await fetchArtistByAddress(params.address);
        console.log("Fetched artist rewards:", fetchedArtist?.rewards);

        if (fetchedArtist?.rewards && fetchedArtist.rewards.length > 0) {
          const uniqueRewardIds = Array.from(new Set(fetchedArtist.rewards));
          setRewardIds(uniqueRewardIds);
        } else {
          setRewardIds([]);
          setMessage("You don't have any rewards yet.");
        }
      } catch (error) {
        console.error("Error fetching rewards:", error);
      }
    };

    fetchRewards();
  }, [params.address]);

  // Fetch Reward Details
  useEffect(() => {
    const fetchRewardDetails = async () => {
      if (rewardIds.length === 0) return;

      const rewardDetailsPromises = rewardIds.map((rewardId) =>
        fetchRewardById(rewardId)
      );

      const rewardDetails = await Promise.all(rewardDetailsPromises);

      const validRewards = rewardDetails.filter(
        (reward) => reward !== null
      ) as RewardProps[];
      const uniqueRewardsMap = new Map();

      validRewards.forEach((reward) => {
        if (reward && !uniqueRewardsMap.has(reward._id)) {
          uniqueRewardsMap.set(reward._id, reward);
        }
      });
      setRewards(Array.from(uniqueRewardsMap.values()));
    };

    fetchRewardDetails();
  }, [rewardIds]);

  const updateReward = async (reward: RewardProps, status: string) => {
    try {
      const updatedArtist = { ...reward, claim };
      const response = await updateReward(updatedArtist);

      if (response) {
        toast.success(
          `Artist ${
            status === "confirmed" ? "confirmed" : "rejected"
          } successfully!`
        );
      } else {
        throw new Error("Failed to update the artist.");
      }
    } catch (error) {
      console.error(
        `Error ${status === "confirmed" ? "pending" : "rejecting"} artist:`,
        error
      );
      toast.error(
        `Failed to ${status === "confirmed" ? "confirm" : "reject"} the artist.`
      );
    }
  };

  const getOrdinalSuffix = (num: number) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const value = num % 100;
    return suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0];
  };
  //TODO : MAKE THE BOX LIKE THE SCREENSHOT
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-6 flex items-center justify-center">
        Rewards <FaMedal className="ml-2 text-yellow-500" />
      </h1>
      {message ? (
        <p className="text-center text-white">{message}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {rewards.map((reward, index) => {
            // Safely convert amount to bigint
            const amount: bigint =
              reward.amount !== undefined ? BigInt(reward.amount) : BigInt(0);

            return (
              <Link href={`/rewards/${reward._id}`} key={reward._id}>
                <div className="bg-gray-800 p-4 rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-200 cursor-pointer">
                  {/* Reward Info */}
                  <h2 className="text-xl font-semibold text-white mb-2 flex items-center">
                    {index + 1} {getOrdinalSuffix(index + 1)}
                    {reward.name}
                    <FaMedal className="ml-2 text-yellow-500" />
                  </h2>
                  <p className="text-gray-400">
                    Congratulations for your {index + 1}th reward
                  </p>
                  <TransactionButton
                    transaction={() =>
                      prepareContractCall({
                        contract: contract,
                        method:
                          "function mint(address account, uint256 amount)",
                        params: [params.address, amount], // Pass the converted amount
                      })
                    }
                    onTransactionConfirmed={async () => {
                      alert("Tier added successfully!");
                      updateReward(params.address);
                    }}
                    onError={(error) => alert(`Error: ${error.message}`)}
                    theme={darkTheme()}
                    className="bg-green-500 text-black px-4 py-2 rounded-full hover:bg-green-400"
                  >
                    Claim Reward
                  </TransactionButton>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Reward;
