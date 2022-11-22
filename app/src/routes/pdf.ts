// 短信验证码
import Router from "express-promise-router";
import pdfController from "@/controllers/pdf";

const router = Router();
export default router;

router.post('/', pdfController.create);
