const Tenant = require('../Models/Tenant');
const upgradePlan = async (req, res) => {
  try {
    const tenant = await Tenant.findOne({ slug: req.params.slug });
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });

    if (String(req.user.tenantid) !== String(tenant._id)) {
      return res.status(403).json({ message: "You can only upgrade your own tenant" });
    }

    tenant.plan = "PRO";
    await tenant.save();
    res.json({ message: "Upgraded to PRO", tenant });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
module.exports = { upgradePlan }