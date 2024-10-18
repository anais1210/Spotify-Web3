"use client";
import { useEffect, useState } from "react";
import { fetchArtistByAddress } from "@/api/artists.api";
import { RewardProps, fetchRewardById, updateReward } from "@/api/reward.api";
import { FaMedal, FaWallet } from "react-icons/fa";
import { darkTheme, TransactionButton, useReadContract } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import { contractToken as contract } from "@/contracts/contracts";
import { toast } from "react-toastify";

interface ArtistDetailProps {
  params: {
    address: string;
  };
}

const Reward = ({ params }: ArtistDetailProps) => {
  const [rewardIds, setRewardIds] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const [rewards, setRewards] = useState<RewardProps[]>([]);
  const { data, isPending } = useReadContract({
    contract,
    method: "function balanceOf(address who) view returns (uint256)",
    params: [params.address],
  });
  // Fetch Reward IDs
  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const fetchedArtist = await fetchArtistByAddress(params.address);
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

  const handleClaim = async (id: string) => {
    try {
      const response = await updateReward(id, { claim: true });
      if (response) {
        toast.success("Reward claimed successfully!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getOrdinalSuffix = (num: number) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const value = num % 100;
    return suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0];
  };

  const getBalance = async () => {};

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-6 flex items-center justify-center">
        Rewards <FaMedal className="ml-2 text-yellow-500" />
      </h1>
      <div className="top-0 right-0 p-4 flex items-center text-xl">
        <FaWallet className="mr-2 text-green-500" /> {/* Wallet Icon */}
        {data ? `${data.toString()} SoundCoin` : "0 SoundCoin"}
      </div>

      {message ? (
        <p className="text-center text-gray-700">{message}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {rewards.map((reward, index) => {
            // Safely convert amount to bigint
            const amount: bigint =
              reward.amount !== undefined ? BigInt(reward.amount) : BigInt(0);

            return (
              <>
                <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">
                  {/* Reward Info */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <FaMedal className="text-yellow-500 mr-2 text-xl" />
                      <h2 className="text-lg font-semibold text-gray-900">
                        {index + 1}
                        {getOrdinalSuffix(index + 1)} {reward.name}
                      </h2>
                    </div>
                  </div>
                  <p className="text-gray-500 mb-4 text-sm">
                    Congratulations on your {index + 1}
                    {getOrdinalSuffix(index + 1)} reward!
                  </p>
                  <p className="text-gray-500 mb-4 text-sm">
                    You earn {reward.amount} SoundCoin for your {index + 1}
                    {getOrdinalSuffix(index + 1)} reward!
                  </p>
                  {reward.claim ? (
                    <button
                      disabled
                      className="mt-4 bg-gray-500 text-gray-200 px-4 py-2 rounded cursor-not-allowed"
                    >
                      Claimed
                    </button>
                  ) : (
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
                        alert("Reward claimed successfully!");
                        handleClaim(reward._id!);
                      }}
                      onError={(error) => alert(`Error: ${error.message}`)}
                      theme={darkTheme()}
                      className="bg-green-500 text-black px-4 py-2 rounded-full hover:bg-green-400"
                    >
                      Claim Reward
                    </TransactionButton>
                  )}
                </div>
              </>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Reward;
