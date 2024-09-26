import * as express from "express";
import { TitleService } from "../services";
import { ApiErrorCode } from "../api-error-code.enum";
import multer from "multer";
import path from "path";

// Setup multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "audio") {
      cb(null, path.join(__dirname, "../../front/public/music"));
    } else if (file.fieldname === "album_img") {
      cb(null, path.join(__dirname, "../../front/public/imgs"));
    } else {
      cb(new Error("Invalid field name"), "");
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Prevent filename collisions
  },
});

// Initialize multer
const upload = multer({ storage });

export class TitleController {
  private static instance: TitleController;

  public static getInstance(): TitleController {
    if (TitleController.instance === undefined) {
      TitleController.instance = new TitleController();
    }
    return TitleController.instance;
  }

  private constructor() {}

  async getTitleById(req: express.Request, res: express.Response) {
    const id = req.params.id;
    const result = await TitleService.getInstance().getTitleById(id);
    if (result === null) {
      return res.status(404).end();
    }
    res.json(result);
  }

  async getAllTitles(req: express.Request, res: express.Response) {
    const result = await TitleService.getInstance().getAllTitles();
    if (result === null) {
      return res.status(404).end();
    }
    res.json(result);
  }

  async createTitle(req: express.Request, res: express.Response) {
    const data = req.body;
    const result = await TitleService.getInstance().createTitle(data);
    if (result === ApiErrorCode.alreadyExists) {
      return res.status(409).end();
    }
    if (result === ApiErrorCode.invalidParameters) {
      return res.status(400).end();
    }
    res.json(result);
  }

  async deleteTitle(req: express.Request, res: express.Response) {
    const id = req.params.id;
    const result = await TitleService.getInstance().deleteTitle(id);
    if (result === ApiErrorCode.notFound) {
      return res.status(404).end();
    }
    if (result === ApiErrorCode.invalidParameters) {
      return res.status(400).end();
    }
    res.status(204).end();
  }

  buildRouter(): express.Router {
    const router = express.Router();
    router.get("/", this.getAllTitles.bind(this));
    router.get("/:id", this.getTitleById.bind(this));
    router.post(
      "/create",
      upload.fields([{ name: "audio" }, { name: "album_img" }]),
      this.createTitle.bind(this)
    ); // Add multer middleware here
    router.delete("/:id", this.deleteTitle.bind(this));
    return router;
  }
}
