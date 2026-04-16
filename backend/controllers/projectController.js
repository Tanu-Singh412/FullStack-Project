const Project =
  require("../models/Project");


// ADD
exports.addProject = async (req, res) => {
  try {
  let images = [];

if (req.files?.images) {
  images = req.files.images.map(
    (f) => "https://fullstack-project-1-n510.onrender.com/uploads/" + f.filename
  );
}
let dwgFile = null;

if (req.files && req.files.dwgFile) {
  const file = req.files.dwgFile[0];

  dwgFile = {
    name: file.originalname,
    url: "https://fullstack-project-1-n510.onrender.com/uploads/" + file.filename,
  };
}
    // =========================
    // GENERATE UNIQUE PROJECT ID
    // =========================
    const lastProject = await Project.findOne().sort({
      createdAt: -1,
    });

    let nextNumber = 2001;

    if (lastProject && lastProject.projectId) {
      const lastNumber = parseInt(
        lastProject.projectId.split("-")[1]
      );
      nextNumber = lastNumber + 1;
    }

    const projectId = "PR-" + nextNumber;

    // =========================
    // CREATE PROJECT
    // =========================
    const project = new Project({
      ...req.body,
      images,
      dwgFile,
      projectId, // ✅ added
      clientId: req.body.clientId,
       // ✅ convert advanceAmount → first payment
  payments: req.body.advanceAmount
    ? [{ amount: Number(req.body.advanceAmount) }]
    : [],
    });

    const saved = await project.save();

    res.json(saved);

  } catch (err) {
    console.error("", err);
    res.status(500).json(err);
  }
};


// GET
exports.getProjects = async (req, res) => {
  try {
    const data = await Project.find().sort({ createdAt: -1 });

    const updated = data.map((p) => {
      const totalPaid = (p.payments || []).reduce(
        (sum, pay) => sum + Number(pay.amount),
        0
      );

      const balance = Number(p.totalAmount || 0) - totalPaid;

      return {
        ...p._doc,
        totalPaid,
        balance,
      };
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json(err);
  }
};


// DELETE
exports.deleteProject =
  async (req, res) => {

    try {

      await Project.findByIdAndDelete(
        req.params.id
      );

      res.json({
        msg: "Deleted",
      });

    } catch (err) {

      res.status(500).json(err);

    }

  };



// UPDATE
exports.updateProject = async (req, res) => {
  try {
    const existingProject = await Project.findById(req.params.id);

    // ✅ images user kept
    let existingImages = [];
    if (req.body.existingImages) {
      existingImages = JSON.parse(req.body.existingImages);
    }

    // ✅ new uploaded images
    let newImages = [];
    if (req.files?.images) {
      newImages = req.files.images.map(
        (f) => "https://fullstack-project-1-n510.onrender.com/uploads/" + f.filename
      );
    }

    // ✅ FINAL images = kept + new
    const images = [...existingImages, ...newImages];

    // ================= DWG =================
    let dwgFile = existingProject?.dwgFile || null;

    if (req.files?.dwgFile) {
      const file = req.files.dwgFile[0];
      dwgFile = {
        name: file.originalname,
        url: "https://fullstack-project-1-n510.onrender.com/uploads/" + file.filename,
      };
    }

    const body = {
      ...req.body,
      images,
      dwgFile,
      clientId: req.body.clientId || "",
      totalAmount: Number(req.body.totalAmount || 0),
    };

    const data = await Project.findByIdAndUpdate(req.params.id, body, {
      new: true,
    });

    res.json(data);
  } catch (err) {
    console.log("UPDATE ERROR:", err);
    res.status(500).json(err);
  }
};
exports.addPayment = async (req, res) => {
  try {
    const { amount } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    project.payments.push({
      amount: Number(amount),
      date: new Date(),
    });

    await project.save();

    res.json(project);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};