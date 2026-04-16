const router = require("express").Router();
const Project = require("../models/Project"); // ✅ FIXED


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



router.post(
  "/:id/drawing",
  upload.array("images", 50),
  async (req, res) => {
    try {
      const { drawingType } = req.body;

      if (!drawingType) {
        return res.status(400).json({ message: "drawingType required" });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No images uploaded" });
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
        return res.status(400).json({ message: "Invalid drawing type" });
      }

      const project = await Project.findByIdAndUpdate(
        req.params.id,
        {
          $push: {
            [field]: { $each: images },
          },
        },
        { new: true }
      );

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      res.json(project);
    } catch (err) {
      console.error("🔥 DRAWING ERROR:", err);
      res.status(500).json({
        message: "Server error",
        error: err.message,
      });
    }
  }
);


module.exports = router;


