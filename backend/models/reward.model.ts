import * as mongoose from "mongoose";
import { Schema, Document } from "mongoose";

export interface RewardProps {
  _id: string;
  address: string;
  name: string;
  claim: boolean;
  tokenId: number;
  amount: number;
}

export type RewardDocument = RewardProps & Document;

const rewardSchema = new Schema(
  {
    address: {
      type: Schema.Types.String,
      //   required: true,
      // unique: true,
    },
    name: {
      type: Schema.Types.String,
      required: true,
    },
    claim: {
      type: Schema.Types.Boolean,
      default: false,
    },
    tokenId: {
      type: Schema.Types.Number,
      unique: true,
      //   required: true,
    },
    amount: {
      type: Schema.Types.Number,
      //   required: true,
    },
  },
  {
    versionKey: false,
  }
);

export const RewardModel = mongoose.model<RewardDocument>(
  "Rewards",
  rewardSchema
);
