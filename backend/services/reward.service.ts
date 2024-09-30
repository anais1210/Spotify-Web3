import { RewardDocument, RewardModel } from "../models";
import { FilterQuery, Types } from "mongoose";
import { ApiErrorCode } from "../api-error-code.enum";

export class RewardService {
  // Singleton
  private static instance: RewardService;

  private constructor() {}

  public static getInstance(): RewardService {
    if (RewardService.instance === undefined) {
      RewardService.instance = new RewardService();
    }
    return RewardService.instance;
  }

  async createReward(
    create: RewardCreate
  ): Promise<RewardDocument | ApiErrorCode> {
    try {
      const model = new RewardModel(create);
      const reward = await model.save();
      return reward;
    } catch (err) {
      return ApiErrorCode.invalidParameters;
    }
  }

  async getRewardById(id: string): Promise<RewardDocument | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const reward = await RewardModel.findById(id);
    if (reward === null) {
      return null;
    }
    return reward;
  }

  async getAllReward(): Promise<RewardDocument[] | null> {
    const rewards = await RewardModel.find();
    return rewards;
  }
}

export interface RewardCreate {
  readonly address?: string;
  readonly name: string;
  readonly claim?: boolean;
  readonly tokenId?: number;
  readonly amount?: number;
}
