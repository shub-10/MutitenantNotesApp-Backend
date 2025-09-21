const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title:{
      type: String
    },
    description:{
      type: String
    },
    tenantId: { 
      type: mongoose.Schema.Types.ObjectId, ref: "Tenant" 
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId, ref: "User" 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);
