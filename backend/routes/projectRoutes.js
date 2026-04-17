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
router.post("/:id/drawing", upload.array("images", 50), async (req, res) => {
  try {
    const { drawingType } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const images = req.files.map(
      (file) =>
        `https://fullstack-project-1-n510.onrender.com/uploads/${file.filename}`
    );

    const field =
      drawingType === "civil"
        ? "civilImages"
        : drawingType === "interior"
        ? "interiorImages"
        : null;

    if (!field) {
      return res.status(400).json({ message: "Invalid type" });
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        $push: { [field]: { $each: images } },
      },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (err) {
    console.error("DRAWING ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// ✅ CORRECT
router.post("/:id/scope", addScope);
router.get("/:id/scope", getScope);

module.exports = router;