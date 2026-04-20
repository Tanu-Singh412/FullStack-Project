const router = require("express").Router();
const controller = require("../controllers/invoiceController");

router.post("/", controller.createInvoice);
router.get("/", controller.getInvoices);
router.delete("/:id", controller.deleteInvoice);

module.exports = router;