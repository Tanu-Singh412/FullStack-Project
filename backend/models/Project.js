const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    projectName: String,
    clientName: String,
    description: String,
    totalAmount: Number,
 payments: [
  {
    amount: Number,
    date: {
      type: Date,
      default: Date.now,
    },
  },
],

    images: [String],
dwgFile: {
  name: String,
  url: String,
},
    status: {
      type: String,
      default: "Pending",
    },
    projectId: {
  type: String,
  unique: true,
},
clientId: {
  type: String,
},
  },
  
  {
    timestamps: true,
  },
  
);

module.exports =
  mongoose.model(
    "Project",
    projectSchema
  );