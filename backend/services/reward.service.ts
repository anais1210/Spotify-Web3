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

  async deleteSubs(id: string): Promise<ApiErrorCode> {
    if (!Types.ObjectId.isValid(id)) {
      return ApiErrorCode.invalidParameters;
    }
    const subs = await RewardModel.findByIdAndDelete(id);
    if (subs === null) {
      return ApiErrorCode.notFound;
    }
    return ApiErrorCode.success;
  }

  async getSubsById(id: string): Promise<RewardDocument | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const subs = await RewardModel.findById(id);
    if (subs === null) {
      return null;
    }
    return subs;
  }

  async getSubsByUserId(userId: string): Promise<RewardDocument | null> {
    if (!Types.ObjectId.isValid(userId)) {
      return null;
    }
    const subs = await RewardModel.findOne({ userId });
    if (subs === null) {
      return null;
    }
    return subs;
  }

  async getAllSubs(): Promise<RewardDocument[] | null> {
    const subs = await RewardModel.find();
    return subs;
  }
}

export interface RewardCreate {
  readonly address: string;
  readonly name: string;
  readonly claim: boolean;
}
