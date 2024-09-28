import * as mongoose from "mongoose";
import { Schema, Document } from "mongoose";

export interface RewardProps {
  _id: string;
  address: string;
  name: string;
  claim: boolean;
}

export type RewardDocument = RewardProps & Document;

const rewardSchema = new Schema(
  {
    address: {
      type: Schema.Types.String,
      //   required: true,
      unique: true,
    },
    name: {
      type: Schema.Types.String,
      required: true,
    },
    claim: {
      type: Schema.Types.Boolean,
      required: true,
      default: false,
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
