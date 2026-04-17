const router = require("express").Router();
const Project = require("../models/Project");

const {
  addProject,
  getProjects,
  deleteProject,
  updateProject,
  addPayment,
  addScope,
  getScope,
  updateScope,
  deleteScope,
  addDrawing,
  getDrawings,
  updateDrawing,
  deleteDrawing,
  deleteDrawingImage,

} = require("../controllers/projectController");

const upload = require("../middleware/upload");

// CREATE PROJECT
router.post(
  "/",
  upload.fields([
    { name: "images", maxCount: 100 },
    { name: "dwgFile", maxCount: 1 },
  ]),
  addProject
);

// GET ALL
router.get("/", getProjects);

// DELETE
router.delete("/:id", deleteProject);

// UPDATE
router.put(
  "/:id",
  upload.fields([
    { name: "images", maxCount: 100 },
    { name: "dwgFile", maxCount: 1 },
  ]),
  updateProject
);

// ✅ ADD PAYMENT
router.post("/:id/payment", addPayment);

// ✅ UPLOAD DRAWINGS
router.post(
  "/",
  upload.array("images", 10),
  addDrawing
);

// ================= GET ALL DRAWINGS OF PROJECT =================
router.get("/project/:projectId", getDrawings);

// ================= UPDATE DRAWING (add more images) =================
router.put(
  "/:drawingId",
  upload.array("images", 10),
  updateDrawing
);

// ================= DELETE DRAWING =================
router.delete("/:drawingId", deleteDrawing);

// ================= DELETE SINGLE IMAGE =================
router.put("/:drawingId/image", deleteDrawingImage);

// ✅ CORRECT
router.post("/:projectId/scope", addScope);
router.get("/:projectId/scope", getScope);
router.put("/:projectId/scope/:scopeId", updateScope);
router.delete("/:projectId/scope/:scopeId", deleteScope);
module.exports = router;