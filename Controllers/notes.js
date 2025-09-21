
const Tenant = require('../Models/Tenant');
const User = require('../Models/User');
const Note = require('../Models/Note');

const addNote = async (req, res) => {
  try {
    const { title, description } = req.body;

    const tenantId = req.user.tenantid;

    const tenant = await Tenant.findById(tenantId);
    if (!tenant) return res.status(400).json({ message: "Tenant not found" });


    if (tenant.plan === "FREE") {
      const count = await Note.countDocuments({ tenantId });

      if (count >= 3) {
        if (req.user.role === 'ADMIN') {
          return res.status(403).json({ message: "Note limit reached. Upgrade your plan" });
        }
        else {
          return res.status(403).json({ message: "Note limit reached. Ask you admin to update to PRO Plan" });
        }
      }
    }

    const note = await Note.create({
      title, description, tenantId, authorId: req.user.id,
    })
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

const deleteNote = async (req, res) => {
  try {
    const deleted = await Note.findByIdAndDelete({ _id: req.params.id, tenantId: req.user.tenantid });
    if (!deleted) return res.status(404).json({ message: "Note not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server error" });
  }
}
const getNote = async (req, res) => {
  try {
    const tenantId = req.user.tenantid;
    const notes = await Note.find({ tenantId }).sort({ createdAt: -1 }).lean();
    res.json({ notes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server error" });
  }
}

const getOneNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, tenantId: req.user.tenantid });
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: " Internal Server error" });
  }
}

const updateNote = async (req, res) => {
  try {
    const updated = await Note.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.user.tenantId },
      { $set: { title: req.body.title, description: req.body.description } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Note not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server error" });
  }
}
module.exports = { addNote, deleteNote, updateNote, getNote, getOneNote };