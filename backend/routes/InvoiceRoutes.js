const router = require("express").Router();
const controller = require("../controllers/InvoiceController");

router.post("/", controller.createInvoice);
router.get("/", controller.getInvoices);
router.delete("/:id", controller.deleteInvoice);

module.exports = router;