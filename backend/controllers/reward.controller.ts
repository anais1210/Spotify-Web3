import * as express from "express";
import { RewardService } from "../services";
import { ApiErrorCode } from "../api-error-code.enum";

/**
 * Chaque controlleur aura son propre routeur à construire
 */

export class RewardController {
  // -- DESIGN PATTERN SINGLETON
  //Permet d'avoir une seule instance d'une classe au maximum
  private static instance: RewardController;

  public static getInstance(): RewardController {
    if (RewardController.instance === undefined) {
      RewardController.instance = new RewardController();
    }
    return RewardController.instance;
  }

  private constructor() {}

  async getRewardById(req: express.Request, res: express.Response) {
    const id = req.params.id;
    const result = await RewardService.getInstance().getRewardById(id);
    if (result === null) {
      return res.status(404).end();
    }
    res.json(result);
  }

  async getAllRewards(req: express.Request, res: express.Response) {
    const result = await RewardService.getInstance().getAllReward();
    if (result === null) {
      return res.status(404).end();
    }
    res.json(result);
  }

  async createReward(req: express.Request, res: express.Response) {
    const data = req.body;
    const result = await RewardService.getInstance().createReward(data);
    if (result === ApiErrorCode.invalidParameters) {
      return res.status(400).end();
    }
    if (result === ApiErrorCode.alreadyExists) {
      return res.status(409).end(); // CONFLICT
    }
    res.json(result);
  }

  async getRewardyIdAndUpdate(req: express.Request, res: express.Response) {
    const id = req.params.id;
    const data = req.body;

    const result = await RewardService.getInstance().getRewardByIdAndUpdate(
      id,
      data
    );
    if (result === ApiErrorCode.notFound) {
      return res.status(404).json({ message: "Album not found" });
    }
    if (result === ApiErrorCode.failed) {
      console.error("Failed to retrieve album:", id);
      return res.status(500).json({ message: "Failed to retrieve album" });
    }
    return res.json(result);
  }

  buildRouter(): express.Router {
    const router = express.Router(); //création d'un nouveau routeur
    router.get("/", this.getAllRewards.bind(this));
    router.get("/:id", this.getRewardById.bind(this));
    router.post("/create", this.createReward.bind(this));
    router.put("/update/:id", this.getRewardyIdAndUpdate.bind(this));
    return router;
  }
}
