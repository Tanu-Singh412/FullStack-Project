const router =
  require("express").Router();

const {
  addProject,
  getProjects,
  deleteProject,
  updateProject,
  addPayment,
} = require(
  "../controllers/projectController"
);
const upload = require("../middleware/upload");

router.post(
  "/",
  upload.fields([
    { name: "images", maxCount: 100 },
    { name: "dwgFile", maxCount: 1 },
  ]),
  addProject
);
router.get("/", getProjects);

router.delete("/:id", deleteProject);
router.put(
  "/:id",
  upload.fields([
    { name: "images", maxCount: 100 },
    { name: "dwgFile", maxCount: 1 },
  ]),
  updateProject
);
router.post("/:id/payment", addPayment);
module.exports = router;