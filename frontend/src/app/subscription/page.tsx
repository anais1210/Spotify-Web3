"use client";
import React, { useState } from "react";
import { addSubscription } from "@/api/subscription.api";
import { fetchUserByAddress, addUser, updateUser } from "@/api/user.api";
import { FaCheck } from "react-icons/fa";
import { Subs } from "subs-widget";
import { useActiveAccount } from "thirdweb/react";
const SubscriptionPage = () => {
  const account = useActiveAccount();
  const [accountExist, setAccountExist] = useState(false);
  const createSubscription = async (userId: string) => {
    try {
      const subscriptionData = {
        startDate: new Date(),
        lastPayment: new Date(),
        status: "abonnement en cours",
        userId: userId,
      };

      const subId = await addSubscription(subscriptionData);
      return subId;
    } catch (error) {
      return null;
    }
  };
  const handleResponse = async (response: { success: boolean }) => {
    if (response.success) {
      if (account?.address) {
        setAccountExist(true);
        const userId = await fetchUserByAddress(account?.address);

        if (userId && userId._id) {
          const id = await createSubscription(userId._id);
          if (id && id._id) {
            const update = await updateUser(account?.address, {
              subscription: id._id,
            });
          }
        } else {
          const newUser = await addUser({ address: account?.address });
          if (newUser && newUser._id) {
            await createSubscription(newUser._id);
          }
        }
      } else {
        setAccountExist(false);
      }
    }
  };
  return (
    <div className="bg-black text-white min-h-screen">
      {/* Header */}
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold">
          Des abonnements abordables pour chaque situation
        </h1>
        <p className="mt-4 text-lg">
          Choisissez un abonnement Premium, et écoutez à volonté, sans pub, sur
          votre téléphone, votre enceinte et d'autres appareils. Payez de
          différentes manières. Annulez à tout moment.
        </p>
      </div>

      {/* Benefits Section */}
      <div className="text-center">
        <h2 className="text-3xl font-semibold">
          Avantages inclus dans tous les abonnements Premium
        </h2>
        <div className="flex justify-center mt-4 space-x-16">
          <ul className="text-left">
            <li className="flex items-center space-x-2 text-lg">
              <FaCheck className="text-green-500" />
              <span>Musique sans pub</span>
            </li>
            <li className="flex items-center space-x-2 text-lg mt-2">
              <FaCheck className="text-green-500" />
              <span>Télécharger pour écouter en mode hors connexion</span>
            </li>
            <li className="flex items-center space-x-2 text-lg mt-2">
              <FaCheck className="text-green-500" />
              <span>Choisissez l'ordre de vos titres</span>
            </li>
          </ul>
          <ul className="text-left">
            <li className="flex items-center space-x-2 text-lg">
              <FaCheck className="text-green-500" />
              <span>Qualité sonore supérieure</span>
            </li>
            <li className="flex items-center space-x-2 text-lg mt-2">
              <FaCheck className="text-green-500" />
              <span>Écoutez avec d'autres personnes en temps réel</span>
            </li>
            <li className="flex items-center space-x-2 text-lg mt-2">
              <FaCheck className="text-green-500" />
              <span>Organisez la file d'attente de lecture</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto my-16 px-4">
        {/* Personal Plan */}
        <div className="bg-gray-800 p-6 rounded-lg text-center shadow-lgtransition-colors duration-300 hover:bg-white hover:text-black">
          <h3 className="text-2xl font-bold">Personnel</h3>
          <p className="text-lg mt-4">1 USDT/mois</p>
          <ul className="mt-4 space-y-2 text-left">
            <li className="flex items-center space-x-2">
              <FaCheck className="text-green-500" />
              <span>1 compte Spotify Premium</span>
            </li>
            <li className="flex items-center space-x-2">
              <FaCheck className="text-green-500" />
              <span>Annulez à tout moment</span>
            </li>
          </ul>
          <div className="mt-12">
            <span className="px-3 py-1">
              <Subs
                address={"0x6176d4666693933eF3a73ce38C28de54A611012D"}
                appId="24"
                chain={"bsct"}
                mode="testnet"
                apiKey="fr96nskplu06obzxtjfwmkswdhpfk9"
                color="red"
                width={200}
                defaultPayment="Prenium"
                choice={{
                  payment: "Prenium",
                  //address token payment
                  token: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd",
                }}
                dataOnSubs={() => handleResponse({ success: true })}
              />
            </span>
          </div>
        </div>

        {/* Students Plan */}
        <div className="bg-gray-800 p-6 rounded-lg text-center shadow-lg transition-colors duration-300 hover:bg-white hover:text-black">
          <h3 className="text-2xl font-bold">Étudiants</h3>
          <p className="text-lg mt-4">1 USDT/mois</p>
          <ul className="mt-4 space-y-2 text-left">
            <li className="flex items-center space-x-2">
              <FaCheck className="text-green-500" />
              <span>1 compte Premium vérifié</span>
            </li>
            <li className="flex items-center space-x-2">
              <FaCheck className="text-green-500" />
              <span>Réduction pour les étudiants</span>
            </li>
            <li className="flex items-center space-x-2">
              <FaCheck className="text-green-500" />
              <span>Annulez à tout moment</span>
            </li>
          </ul>
          <div className="mt-4">
            <span className="px-3 py-1">
              <Subs
                address={"0x6176d4666693933eF3a73ce38C28de54A611012D"}
                appId="24"
                chain={"bsct"}
                mode="testnet"
                apiKey="fr96nskplu06obzxtjfwmkswdhpfk9"
                color="red"
                width={200}
                defaultPayment="Prenium"
                choice={{
                  payment: "Prenium",
                  token: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd",
                }}
                dataOnSubs={() => handleResponse({ success: true })}
              />
            </span>
          </div>
        </div>

        {/* Duo Plan */}
        <div className="bg-gray-800 p-6 rounded-lg text-center shadow-lg transition-colors duration-300 hover:bg-white hover:text-black">
          <h3 className="text-2xl font-bold">Duo</h3>
          <p className="text-lg mt-4">1 USDT/mois</p>
          <ul className="mt-4 space-y-2 text-left">
            <li className="flex items-center space-x-2">
              <FaCheck className="text-green-500" />
              <span>2 comptes Spotify Premium</span>
            </li>
            <li className="flex items-center space-x-2">
              <FaCheck className="text-green-500" />
              <span>Annulez à tout moment</span>
            </li>
          </ul>
          <div className="mt-12">
            <span className="px-3 py-1">
              <Subs
                address={"0x6176d4666693933eF3a73ce38C28de54A611012D"}
                appId="24"
                chain={"bsct"}
                mode="testnet"
                apiKey="fr96nskplu06obzxtjfwmkswdhpfk9"
                color="red"
                width={200}
                defaultPayment="Prenium"
                choice={{
                  payment: "Prenium",
                  token: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd",
                }}
                dataOnSubs={() => handleResponse({ success: true })}
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
