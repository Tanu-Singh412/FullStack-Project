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

      const images = req.files.map(
        (f) =>
          "https://fullstack-project-1-n510.onrender.com/uploads/" + f.filename
      );

      const field =
        drawingType === "civil" ? "civilImages" : "interiorImages";

      const project = await Project.findByIdAndUpdate(
        req.params.id,
        {
          $push: {
            [field]: { $each: images },
          },
        },
        { new: true }
      );

      res.json(project);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);module.exports = router;


