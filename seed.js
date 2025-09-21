const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Tenant = require("./Models/Tenant");
const User = require("./Models/User");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URL).then(()=> console.log("db connected"));

    let acme = await Tenant.findOne({ slug: "acme" });
    if (!acme) {
      acme = await Tenant.create({ name: "Acme", slug: "acme", plan: "FREE" });
      console.log("Tenant created: Acme");
    }

    let globex = await Tenant.findOne({ slug: "globex" });
    if (!globex) {
      globex = await Tenant.create({ name: "Globex", slug: "globex", plan: "FREE" });
      console.log("Tenant created: Globex");
    }

    const hashedPassword = await bcrypt.hash("adminPassword", 10);

    const users = [
      { email: "admin@acme.test", password: hashedPassword, role: "ADMIN", tenantid: acme._id },
      { email: "user@acme.test", password: hashedPassword, role: "MEMBER", tenantid: acme._id },
      { email: "admin@globex.test", password: hashedPassword, role: "ADMIN", tenantid: globex._id },
      { email: "user@globex.test", password: hashedPassword, role: "MEMBER", tenantid: globex._id },
    ];

    for (const user of users) {
      const exists = await User.findOne({ email: user.email });
      if (!exists) {
        await User.create(user);
      } else {
        console.log(` User already exists: ${user.email}`);
      }
    }

    process.exit(0);
  } catch (err) {
    process.exit(1);
  }
}

seed();
