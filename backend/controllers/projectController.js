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
  totalAmount: Number(req.body.totalAmount || 0),
  images,
  dwgFile,
  projectId,
  clientId: req.body.clientId,

  payments: req.body.advanceAmount
    ? [{ amount: Number(req.body.advanceAmount) }]
    : [],
});

    const saved = await project.save();

    res.json(saved);

  } catch (err) {
    console.error("ADD PROJECT ERROR:", err);
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
    const { amount, date, note } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    project.payments.push({
      amount: Number(amount),
      date: date || new Date().toISOString().split("T")[0],
      note: note || "",
    });

    await project.save();

    res.json(project);
  } catch (err) {
    res.status(500).json(err);
  }
};

// ADD SCOPE
exports.addScope = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    const scopeItem = {
      ...req.body,
      area: Number(req.body.area || 0),
      floors: Number(req.body.floors || 0),
      revisions: Number(req.body.revisions || 0),
      timeline: Number(req.body.timeline || 0),
      costPerSqft: Number(req.body.costPerSqft || 0),
      lumpSum: Number(req.body.lumpSum || 0),
    };

    project.scope.push(scopeItem);

    await project.save();

    res.json(project.scope);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET SCOPE
exports.getScope = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    res.json(project.scope || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};