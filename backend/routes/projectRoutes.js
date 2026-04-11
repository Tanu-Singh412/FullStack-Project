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

router.post(
  "/:id/drawing",
  upload.array("images", 50),
  async (req, res) => {
    try {
      const { drawingType } = req.body;

      // ✅ SAFETY CHECK
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No images uploaded" });
      }

      // ✅ FILE PATH FIX
      const images = req.files.map(
        (file) =>
          `https://fullstack-project-1-n510.onrender.com/uploads/${file.filename}`
      );

      // ✅ FIELD SELECT
      const field =
        drawingType === "civil" ? "civilImages" : "interiorImages";

      // ✅ UPDATE DB
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
      console.error("Upload Error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);


module.exports = router;


