const express = require("express");
const router = express.Router();

const pdf_controller = require("../controllers/pdf.controller");

router.post("/pdf", pdf_controller.pdf);

router.post("/preview", pdf_controller.pdf_preview);

router.post("/editor", pdf_controller.pdf_editor);

router.get("/template/:id", pdf_controller.get_template);

module.exports = router;
