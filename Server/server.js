require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const cors = require("cors");
const multer = require("multer"); // For handling file uploads
const cloudinary = require("cloudinary").v2;
const path = require("path");
const fs = require("fs");
const { Server } = require("socket.io");
const http = require("http");
const SibApiV3Sdk = require("sib-api-v3-sdk");

// App Initialization
const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// ✅ **MongoDB Connection**
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Cloudinary Configuration (Ensure all credentials are loaded)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Ensure this matches .env
  api_key: process.env.CLOUDINARY_API_KEY, // Ensure this matches .env
  api_secret: process.env.CLOUDINARY_API_SECRET, // Ensure this matches .env
});

// Multer Storage (Memory for Cloudinary)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads")); // Store files in "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ✅ **Member Schema**
const MemberSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  mobile: { type: String, unique: true },
  password: String,
  verified: { type: Boolean, default: false },
  pincode: String,
  district: String,
  state: String,
  country: String,
  dob: String,
  bio: String,
});
const Member = mongoose.model("Member", MemberSchema);

// ✅ **OTP Schema**
const OtpSchema = new mongoose.Schema({
  email: String,
  otp: String,
  createdAt: { type: Date, default: Date.now, expires: 300 },
});
const Otp = mongoose.model("Otp", OtpSchema);

const AdminSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  mobile: { type: String, unique: true },
  address: String,
  aadharCardNumber: { type: String, unique: true },
  password: String, // ✅ Added Password Field
});
const Admin = mongoose.model("Admin", AdminSchema);

const CoAdminSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  mobile: { type: String, unique: true },
  address: String,
  aadharCardNumber: { type: String, unique: true },
  password: String, // ✅ Added Password Field
});
const CoAdmin = mongoose.model("CoAdmin", CoAdminSchema);

const categorySchema = new mongoose.Schema({
  name: String,
  description: String,
});
const Category = mongoose.model("Category", categorySchema);

// **Blog Schema & Model**
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String, required: true }, // Cloudinary URL
  createdAt: { type: Date, default: Date.now },
});
const Blog = mongoose.model("Blog", blogSchema);

// Item Listing Schema
const ItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  keywords: { type: String, trim: true },
  category: { type: String, required: true, trim: true },
  images: { type: [String], required: true }, // ✅ Ensures images array is required
  city: { type: String, required: true, trim: true },
  condition: {
    type: String,
    enum: ["New", "Gently Used", "Heavily Used"],
    required: true,
  },
  swapOrGiveaway: { type: String, enum: ["Swap", "Giveaway"], required: true },
  price: { type: String, trim: true }, // ✅ Keep as string if price is optional or a label (e.g., "Free")

  // ✅ Store member info
  memberID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
    required: true,
  },
  userName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  mobile: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now }, // ✅ Keeps track of when the item was listed
});
const Item = mongoose.model("Item", ItemSchema);

// MongoDB Model
const CommunitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Member" }],
  },
  { timestamps: true }
);
const Community = mongoose.model("Community", CommunitySchema);

// Event Schema & Model
const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  eventDate: { type: String, required: true },
  eventType: { type: String, required: true },
  location: { type: String, default: "Virtual Event" },
  totalParticipants: { type: Number, required: true },
});
const Event = mongoose.model("Event", eventSchema);

// Joined Events Schema & Model
const JoinedEventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  eventDate: { type: String, required: true }, // Now storing event date
  eventLocation: { type: String, required: true }, // Now storing event location
  memberName: { type: String, required: true },
  email: { type: String, required: true, unique: false },
  mobile: { type: String, required: true },
  joinedAt: { type: Date, default: Date.now }, // Timestamp
});
const JoinedEvent = mongoose.model("JoinedEvent", JoinedEventSchema);

// Query Schema
const QuerySchema = new mongoose.Schema({
  userName: String,
  userEmail: String,
  messages: [
    {
      message: String,
      sender: String, // "user" or "admin"
      timestamp: { type: Date, default: Date.now },
    },
  ],
});
const Query = mongoose.model("Query", QuerySchema);

const AnnouncementSchema = new mongoose.Schema({
  title: { type: String },
  message: { type: String },
  image: { type: String }, // Cloudinary Image URL
  active: { type: Boolean, default: false }, // ✅ New Field: Active/Inactive
});
const Announcement = mongoose.model("Announcement", AnnouncementSchema);

const MessageSchema = new mongoose.Schema({
  senderID: { type: mongoose.Schema.Types.ObjectId, ref: "Member", required: true },
  receiverID: { type: mongoose.Schema.Types.ObjectId, ref: "Member", required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", MessageSchema);



const brevoClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = brevoClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// ✅ **Generate OTP Function**
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// ✅ Route: Send OTP
app.post("/send-otp", async (req, res) => {
  const { email, mobile } = req.body;

  if (!email || !mobile) {
    return res.status(400).json({ message: "Email and Mobile are required." });
  }

  // 🔹 Check if the email or mobile number is already registered
  const existingUser = await Member.findOne({ $or: [{ email }, { mobile }] });
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "Email or Mobile Number already registered." });
  }

  // 🔹 Generate OTP and Save to DB
  const otp = generateOTP();
  await Otp.deleteOne({ email });
  const newOtp = new Otp({ email, otp });
  await newOtp.save();

  console.log(`Generated OTP for ${email}: ${otp}`);

  // 🔹 Styled Email Content
  const emailContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>OTP Verification</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 480px;
                margin: 30px auto;
                background: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
                text-align: center;
            }
            h2 {
                color: #2a9d8f;
                margin-bottom: 10px;
            }
            p {
                font-size: 16px;
                color: #333;
            }
            .otp-box {
                font-size: 22px;
                font-weight: bold;
                background: #2a9d8f;
                color: white;
                padding: 12px 20px;
                display: inline-block;
                margin: 15px 0;
                border-radius: 5px;
                letter-spacing: 2px;
            }
            .footer {
                margin-top: 20px;
                font-size: 14px;
                color: #777;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>🔐 OTP Verification</h2>
            <p>Hello <strong>User</strong>,</p>
            <p>Your One-Time Password (OTP) for verification is:</p>
            <div class="otp-box">${otp}</div>
            <p>Please enter this OTP to complete your signup process.</p>
            <p class="footer">This OTP is valid for 5 minutes. Do not share it with anyone.</p>
        </div>
    </body>
    </html>
  `;

  const emailData = {
    sender: { email: process.env.BREVO_SENDER_EMAIL, name: "EcoSwap" },
    to: [{ email }],
    subject: "🔐 Your OTP for Signup",
    htmlContent: emailContent,
  };

  // 🔹 Send Email Using Brevo API
  try {
    await apiInstance.sendTransacEmail(emailData);
    res.json({ message: "✅ OTP sent successfully" });
  } catch (error) {
    console.error("❌ OTP email sending error:", error);
    res.status(500).json({ message: "Email not sent. Try again later." });
  }
});



// ✅ **Route: Verify OTP and Signup**
app.post("/signup", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    mobile,
    password,
    otp,
    pincode,
    district,
    state,
    country,
    dob,
    bio,
  } = req.body;

  const existingUser = await Member.findOne({ $or: [{ email }, { mobile }] });
  if (existingUser)
    return res
      .status(400)
      .json({ message: "Email or Mobile already registered." });

  const otpRecord = await Otp.findOne({ email, otp });
  if (!otpRecord)
    return res.status(400).json({ message: "Invalid or expired OTP" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new Member({
    firstName,
    lastName,
    email,
    mobile,
    password: hashedPassword,
    verified: true,
    pincode,
    district,
    state,
    country,
    dob,
    bio,
  });

  await newUser.save();
  await Otp.deleteOne({ email });

  res.json({ message: "Signup successful" });
});

// Member Login
app.post("/login", async (req, res) => {
  const { userInput, password } = req.body;
  try {
    let user = await Member.findOne({
      $or: [{ email: userInput }, { mobile: userInput }],
    });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Invalid password" });

      // Token valid for 1 hour
      const token = jwt.sign(
        { id: user._id, role: "member" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      return res.json({
        message: "Login successful",
        token,
        user: { id: user._id, email: user.email, role: "member" },
      });
    }

    // Check for Admin & Co-Admin
    user =
      (await Admin.findOne({
        $or: [{ email: userInput }, { mobile: userInput }],
      })) ||
      (await CoAdmin.findOne({
        $or: [{ email: userInput }, { mobile: userInput }],
      }));

    if (user) {
      const role = user instanceof Admin ? "admin" : "co-admin";
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Invalid password" });

      // Token valid for 1 hour
      const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      return res.json({
        message: "Login successful",
        token,
        user: { id: user._id, email: user.email, role },
      });
    }

    return res.status(400).json({ message: "User not found" });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

// Admin/Co-Admin Login (Alternate Route)
app.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user =
      (await Admin.findOne({ email })) || (await CoAdmin.findOne({ email }));
    if (!user) return res.status(400).json({ message: "User not found" });

    const role = user instanceof Admin ? "admin" : "co-admin";
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    // Token valid for 1 hour
    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, email: user.email, role },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

// ✅ **Route: Get Logged-in Admin Details**
// ✅ **Route: Get Admin or Co-Admin Details**
app.get("/admin/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!["admin", "co-admin"].includes(decoded.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const user =
      decoded.role === "admin"
        ? await Admin.findById(decoded.id).select("-password")
        : await CoAdmin.findById(decoded.id).select("-password");

    if (!user) return res.status(404).json({ message: "Admin not found" });

    res.json(user);
  } catch (error) {
    console.error("❌ Error fetching admin:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/admin/user", async (req, res) => {
  try {
    const members = await Member.find({});
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.get("/user", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "member")
      return res.status(403).json({ message: "Access denied" });

    const user = await Member.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      ...user.toObject(),
      name: `${user.firstName} ${user.lastName}`,
      role: "Environmental Helper",
      email: user.email,
    });
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ **Route: Update User Profile**
app.put("/user/update", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const updatedUser = await Member.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// ✅ **Route: Add Admin or Co-Admin**
app.post("/admin/add", async (req, res) => {
  const { name, email, mobile, address, aadharCardNumber, password, role } =
    req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // ✅ Hash password

    let newUser;
    if (role === "admin") {
      newUser = new Admin({
        name,
        email,
        mobile,
        address,
        aadharCardNumber,
        password: hashedPassword,
      });
    } else if (role === "co-admin") {
      newUser = new CoAdmin({
        name,
        email,
        mobile,
        address,
        aadharCardNumber,
        password: hashedPassword,
      });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    await newUser.save();
    res.json({ message: `${role} added successfully`, user: newUser });
  } catch (error) {
    console.error(`❌ Error adding ${role}:`, error);
    res.status(500).json({ message: `Failed to add ${role}` });
  }
});

// ✅ **Route: Add Admin or Co-Admin**
app.post("/admin/add", async (req, res) => {
  const { name, email, mobile, address, aadharCardNumber, password, role } =
    req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser;
    if (role === "admin") {
      newUser = new Admin({
        name,
        email,
        mobile,
        address,
        aadharCardNumber,
        password: hashedPassword,
      });
    } else if (role === "co-admin") {
      newUser = new CoAdmin({
        name,
        email,
        mobile,
        address,
        aadharCardNumber,
        password: hashedPassword,
      });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    await newUser.save();
    res.json({ message: `${role} added successfully`, user: newUser });
  } catch (error) {
    console.error(`❌ Error adding ${role}:`, error);
    res.status(500).json({ message: `Failed to add ${role}` });
  }
});

// ✅ **Route: Login (Admin & Co-Admin)**
app.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user =
      (await Admin.findOne({ email })) || (await CoAdmin.findOne({ email }));
    if (!user) return res.status(400).json({ message: "User not found" });

    const role = user instanceof Admin ? "admin" : "co-admin";
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, email: user.email, role },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

// ✅ **Route: Get Admin/Co-Admin Details**
app.get("/admin/details", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await (decoded.role === "admin" ? Admin : CoAdmin)
      .findById(decoded.id)
      .select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/send-forgot-password-otp", async (req, res) => {
  const { email } = req.body;
  const user = await Member.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Email not registered." });
  }

  const otp = generateOTP();
  await Otp.deleteOne({ email });
  await new Otp({ email, otp }).save();

  const emailData = {
    sender: { email: process.env.BREVO_SENDER_EMAIL, name: "EcoSwap" },
    to: [{ email }],
    subject: "🔐 Your OTP for Password Reset",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f4f4f4; border-radius: 10px;">
        <h2 style="color: #2a9d8f;">🔐 OTP Verification</h2>
        <p style="font-size: 16px; color: #333;">Your One-Time Password (OTP) for resetting your password is:</p>
        <div style="font-size: 22px; font-weight: bold; background: #2a9d8f; color: white; padding: 12px 20px; display: inline-block; margin: 15px 0; border-radius: 5px; letter-spacing: 2px;">
          ${otp}
        </div>
        <p style="font-size: 14px; color: #777;">This OTP is valid for 5 minutes. Do not share it with anyone.</p>
      </div>
    `,
  };

  try {
    await apiInstance.sendTransacEmail(emailData);
    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

app.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  const validOtp = await Otp.findOne({ email, otp });

  if (!validOtp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  await Otp.deleteOne({ email });
  res.json({ message: "OTP verified" });
});

app.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;
  const user = await Member.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();
  res.json({ message: "Password updated successfully" });
});

// Backend API to get total count of members
app.get("/api/members/count", async (req, res) => {
  try {
    const count = await Member.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Backend API to get total count of categories
app.get("/api/categories/count", async (req, res) => {
  try {
    const count = await Category.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/items/count", async (req, res) => {
  try {
    const totalItems = await Item.countDocuments(); // ✅ Counts total items
    res.status(200).json({ totalItems });
  } catch (error) {
    res.status(500).json({ error: "Error fetching item count" });
  }
});
app.get("/api/items/count-by-category", async (req, res) => {
  try {
    const categoryCounts = await Item.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }, // ✅ Groups by category and counts items
      { $sort: { count: -1 } }, // ✅ Sorts by highest count first
    ]);

    res.status(200).json(categoryCounts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching category-wise item count" });
  }
});

// API to get the number of completed events
app.get("/events/completed", async (req, res) => {
  try {
    const currentDate = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    // Ensure date comparison works correctly
    const completedEvents = await Event.countDocuments({
      eventDate: { $lt: currentDate }, // Comparing strings in YYYY-MM-DD format
    });

    res.status(200).json({ completedEvents });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// Create category
app.post("/categories", async (req, res) => {
  const { name, description } = req.body;
  const newCategory = new Category({ name, description });
  await newCategory.save();
  res.json(newCategory);
});

// Get all categories
app.get("/categories", async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

// Update category
app.put("/categories/:id", async (req, res) => {
  const { name, description } = req.body;
  const updatedCategory = await Category.findByIdAndUpdate(
    req.params.id,
    { name, description },
    { new: true }
  );
  res.json(updatedCategory);
});

// Delete category
app.delete("/categories/:id", async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: "Category deleted" });
});

const uploadImagesToCloudinary = async (files) => {
  if (!files || files.length === 0) {
    throw new Error("At least 1 image is required.");
  }

  return await Promise.all(
    files.map(async (file) => {
      try {
        if (!file.path) {
          throw new Error("File path is undefined!");
        }

        console.log(`Uploading file: ${file.path}`); // Debugging line

        const result = await cloudinary.uploader.upload(file.path, {
          folder: "EcoSwap",
        });

        return result.secure_url;
      } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw new Error("Cloudinary upload failed");
      }
    })
  );
};

// ✅ Extract and Verify User from Token
const getUserFromToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Member.findById(decoded.id).select("-password");
    return user || null;
  } catch (error) {
    return null;
  }
};

// ✅ Create an Item
app.post("/list-item", upload.array("images", 5), async (req, res) => {
  try {
    const user = await getUserFromToken(req, res);

    // ✅ Reject if no user is logged in
    if (!user) {
      return res
        .status(401)
        .json({ message: "Unauthorized. Please log in to list an item." });
    }

    const {
      itemName,
      description,
      keywords,
      category,
      city,
      condition,
      swapOrGiveaway,
      price,
    } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least 1 image is required." });
    }

    // ✅ Upload images to Cloudinary
    const imageUrls = await uploadImagesToCloudinary(req.files);

    // ✅ Store member details in the item database
    const newItem = new Item({
      itemName,
      description,
      keywords,
      category,
      images: imageUrls,
      city,
      condition,
      swapOrGiveaway,
      price,
      memberID: user._id, // ✅ Store the logged-in member's ID
      userName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      mobile: user.mobile,
    });

    await newItem.save();
    res.status(201).json({ message: "Item listed successfully!", newItem });
  } catch (error) {
    console.error("Error listing item:", error);
    res.status(500).json({ message: error.message });
  }
});

// ✅ Update an Item
app.put("/update-item/:id", upload.array("images", 5), async (req, res) => {
  try {
    const user = await getUserFromToken(req, res);
    if (!user)
      return res.status(401).json({ message: "Unauthorized. Invalid token." });

    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.memberID.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this item" });
    }

    const {
      itemName,
      description,
      keywords,
      category,
      city,
      condition,
      swapOrGiveaway,
      price,
    } = req.body;
    let imageUrls = item.images;

    // Upload new images if provided
    if (req.files.length > 0) {
      imageUrls = await uploadImagesToCloudinary(req.files);
    }

    // Update item details
    item.itemName = itemName || item.itemName;
    item.description = description || item.description;
    item.keywords = keywords || item.keywords;
    item.category = category || item.category;
    item.images = imageUrls;
    item.city = city || item.city;
    item.condition = condition || item.condition;
    item.swapOrGiveaway = swapOrGiveaway || item.swapOrGiveaway;
    item.price = price || item.price;

    await item.save();
    res.status(200).json({ message: "Item updated successfully!", item });
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ message: "Error updating item. Please try again." });
  }
});

// ✅ Delete an Item
// app.delete("/delete-item/:id", async (req, res) => {
//   try {
//     const user = await getUserFromToken(req, res);
//     if (!user) return res.status(401).json({ message: "Unauthorized. Invalid token." });

//     const item = await Item.findById(req.params.id);
//     if (!item) return res.status(404).json({ message: "Item not found" });

//     if (item.memberID.toString() !== user._id.toString()) {
//       return res.status(403).json({ message: "Unauthorized to delete this item" });
//     }

//     await Item.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "Item deleted successfully!" });
//   } catch (error) {
//     console.error("Error deleting item:", error);
//     res.status(500).json({ message: "Error deleting item. Please try again." });
//   }
// });

app.delete("/delete-item/:id", async (req, res) => {
  try {
    const user = await getUserFromToken(req, res);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized. Invalid token." });
    }

    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Allow admins and co-admins to delete any item
    if (user.role === "admin" || user.role === "co-admin") {
      await Item.findByIdAndDelete(req.params.id);
      return res
        .status(200)
        .json({ message: "Item deleted successfully by Admin!" });
    }

    // Allow members to delete only their own items
    if (item.memberID.toString() !== user.id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this item" });
    }

    await Item.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Item deleted successfully!" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ message: "Error deleting item. Please try again." });
  }
});

// ✅ Get All Items with Pagination
app.get("/items", async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const items = await Item.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalItems = await Item.countDocuments();
    res.status(200).json({
      items,
      totalItems,
      page,
      totalPages: Math.ceil(totalItems / limit),
    });
  } catch (error) {
    console.error("Error fetching items:", error);
    res
      .status(500)
      .json({ message: "Error fetching items. Please try again." });
  }
});

app.get("/api/items", async (req, res) => {
  try {
    let {
      search,
      category,
      city,
      swapOrGiveaway,
      page = 1,
      limit = 15,
    } = req.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 15;

    const query = {};
    if (search) query.itemName = { $regex: search, $options: "i" };
    if (category && category !== "All Categories") query.category = category;
    if (city) query.city = city;
    if (swapOrGiveaway) query.swapOrGiveaway = swapOrGiveaway;

    const totalItems = await Item.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    const items = await Item.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({ items, totalPages });
  } catch (error) {
    console.error("❌ Error fetching items:", error);
    res
      .status(500)
      .json({ message: "Error fetching items. Please try again later." });
  }
});

// ✅ Get an Item by ID
app.get("/items/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    res.status(200).json(item);
  } catch (error) {
    console.error("Error fetching item:", error);
    res.status(500).json({ message: "Error fetching item. Please try again." });
  }
});

// Image Upload Route
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "ecoswap_blogs",
    });

    // Delete local file after upload
    fs.unlinkSync(req.file.path);

    res.json({ url: result.secure_url });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

// Blog Post Route
app.post("/api/blogs", async (req, res) => {
  try {
    const { title, description, content, image } = req.body;

    if (!title || !description || !content || !image) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Save blog to MongoDB
    const newBlog = new Blog({ title, description, content, image });
    await newBlog.save(); // This actually saves the blog

    res
      .status(201)
      .json({ message: "Blog posted successfully", blog: newBlog });
  } catch (error) {
    console.error("Error posting blog:", error);
    res.status(500).json({ error: "Failed to post blog" });
  }
});
// **2. Get All Blogs**
app.get("/api/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// **3. Get a Single Blog by ID**
app.get("/api/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// **4. Update a Blog**
app.put("/api/blogs/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, description, content } = req.body;
    let imageUrl;

    if (req.file) {
      const result = await cloudinary.uploader
        .upload_stream({ folder: "EcoSwap_Blogs" }, async (error, result) => {
          if (error)
            return res.status(500).json({ error: "Image upload failed" });

          imageUrl = result.secure_url;
          await Blog.findByIdAndUpdate(req.params.id, {
            title,
            description,
            content,
            image: imageUrl,
          });
          res.status(200).json({ message: "Blog updated successfully" });
        })
        .end(req.file.buffer);
    } else {
      await Blog.findByIdAndUpdate(req.params.id, {
        title,
        description,
        content,
      });
      res
        .status(200)
        .json({ message: "Blog updated successfully (no image change)" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// **5. Delete a Blog**
app.delete("/api/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// **Middleware for Authentication**
const verifyUser = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid Token" });
  }
};

// **Middleware for Admin Authentication**
const verifyAdmin = (req, res, next) => {
  verifyUser(req, res, () => {
    if (req.user.role === "admin") {
      next();
    } else {
      res.status(403).json({ message: "Admin access required" });
    }
  });
};

// **1. Create a Community (Admin Only)**
app.post(
  "/api/community",
  verifyAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, description } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: "Image is required" });
      }

      // Upload Image to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "image" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      const newCommunity = new Community({
        name,
        description,
        image: result.secure_url,
        members: [],
      });

      await newCommunity.save();
      res.status(201).json({
        message: "Community created successfully",
        community: newCommunity,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// **2. Get All Communities**
app.get("/api/community", async (req, res) => {
  try {
    const communities = await Community.find();
    res.json(communities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// **3. Join a Community**
app.post("/api/community/join/:id", verifyUser, async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community)
      return res.status(404).json({ message: "Community not found" });

    if (!community.members.includes(req.user.id)) {
      community.members.push(req.user.id);
      await community.save();
      return res.json({ message: "Joined the community", community });
    }
    res.status(400).json({ message: "Already a member" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// **4. Leave a Community**
app.post("/api/community/leave/:id", verifyUser, async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community)
      return res.status(404).json({ message: "Community not found" });

    community.members = community.members.filter(
      (member) => member.toString() !== req.user.id
    );
    await community.save();
    res.json({ message: "Left the community", community });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// **5. Delete a Community (Admin Only)**
app.delete("/api/community/:id", verifyAdmin, async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community)
      return res.status(404).json({ message: "Community not found" });

    await Community.findByIdAndDelete(req.params.id);
    res.json({ message: "Community deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST Event
app.post("/api/events", async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.status(201).json({ message: "Event Created", event: newEvent });
  } catch (error) {
    res.status(500).json({ error: "Error creating event" });
  }
});

// GET All Events
app.get("/api/user-events", async (req, res) => {
  try {
    const currentDate = new Date().toISOString().split("T")[0]; // Today's date (YYYY-MM-DD)

    // Fetch only upcoming events
    const events = await Event.find({ eventDate: { $gte: currentDate } });

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: "Error fetching events" });
  }
});

app.get("/api/admin-events", async (req, res) => {
  try {
    // Fetch all events (past & future)
    const events = await Event.find();

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: "Error fetching events" });
  }
});

// GET Single Event by ID
app.get("/api/events/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: "Error fetching event" });
  }
});

// DELETE Event
app.delete("/api/events/:id", async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent)
      return res.status(404).json({ message: "Event not found" });
    res.status(200).json({ message: "Event deleted", event: deletedEvent });
  } catch (error) {
    res.status(500).json({ error: "Error deleting event" });
  }
});

// UPDATE Event
app.put("/api/events/:id", async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedEvent)
      return res.status(404).json({ message: "Event not found" });
    res.status(200).json({ message: "Event updated", event: updatedEvent });
  } catch (error) {
    res.status(500).json({ error: "Error updating event" });
  }
});

// Event Joining API
// app.post("/api/join-event", async (req, res) => {
//   const { eventName, eventDate, eventLocation, memberName, email, mobile } =
//     req.body;

//   if (
//     !eventName ||
//     !eventDate ||
//     !eventLocation ||
//     !memberName ||
//     !email ||
//     !mobile
//   ) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   try {
//     // Check if the user has already joined this event
//     const existingRegistration = await JoinedEvent.findOne({
//       eventName,
//       email,
//     });

//     if (existingRegistration) {
//       return res
//         .status(400)
//         .json({ message: "You have already joined this event." });
//     }

//     // Store data in MongoDB
//     const newJoinedEvent = new JoinedEvent({
//       eventName,
//       eventDate,
//       eventLocation,
//       memberName,
//       email,
//       mobile,
//     });

//     await newJoinedEvent.save();

//     // Send Confirmation Email
//     const mailOptions = {
//       // from: process.env.GOOGLE_EMAIL,
//       from: process.env.BREVO_SENDER_EMAIL,
//       to: email,
//       subject: "Event Registration Confirmation",
//       html: `
//         <h2>🎉 Event Registration Successful!</h2>
//         <p>Hi <b>${memberName}</b>,</p>
//         <p>You've successfully registered for the event <b>${eventName}</b>.</p>
//         <p>
//           📅 <b>Date:</b> ${eventDate} <br>
//           📍 <b>Location:</b> ${eventLocation}
//         </p>
//         <p>Thank you for joining! We look forward to seeing you at the event.</p>
//       `,
//     };

//     await transporter.sendMail(mailOptions);

//     res
//       .status(200)
//       .json({ message: "Successfully joined event! Confirmation email sent." });
//   } catch (error) {
//     console.error("❌ Error:", error);
//     res.status(500).json({ message: "Error joining event. Please try again." });
//   }
// });

// Event Registration Route
app.post("/api/join-event", async (req, res) => {
  const { eventName, eventDate, eventLocation, memberName, email, mobile } = req.body;

  if (!eventName || !eventDate || !eventLocation || !memberName || !email || !mobile) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the user has already joined this event
    const existingRegistration = await JoinedEvent.findOne({ eventName, email });

    if (existingRegistration) {
      return res.status(400).json({ message: "You have already joined this event." });
    }

    // Prepare email content
    const emailData = {
      sender: { email: process.env.BREVO_SENDER_EMAIL, name: "Event Organizer" },
      to: [{ email: email, name: memberName }],
      subject: "Event Registration Confirmation",
      htmlContent: `
        <h2>🎉 Event Registration Successful!</h2>
        <p>Hi <b>${memberName}</b>,</p>
        <p>You've successfully registered for the event <b>${eventName}</b>.</p>
        <p>
          📅 <b>Date:</b> ${eventDate} <br>
          📍 <b>Location:</b> ${eventLocation}
        </p>
        <p>Thank you for joining! We look forward to seeing you at the event.</p>
      `,
    };

    // Send Email
    await apiInstance.sendTransacEmail(emailData);

    // If email is sent successfully, store data in MongoDB
    const newJoinedEvent = new JoinedEvent({ eventName, eventDate, eventLocation, memberName, email, mobile });
    await newJoinedEvent.save();

    res.status(200).json({ message: "Successfully joined event! Confirmation email sent." });
  } catch (error) {
    console.error("❌ Error:", error);

    if (error.response) {
      console.error("Brevo API Response:", error.response.body);
    }

    res.status(500).json({ message: "Error joining event. Please try again." });
  }
});

app.get("/api/event-registrations/:eventId", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const participants = await JoinedEvent.find({ eventName: event.eventName });

    res.status(200).json({ ...event.toObject(), participants });
  } catch (error) {
    console.error("Error fetching event registrations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/send-event-message", async (req, res) => {
  try {
    const { eventName, message } = req.body;

    // Find participants for the given event name
    const participants = await JoinedEvent.find({ eventName });

    if (participants.length === 0) {
      return res.status(400).json({ message: "No participants registered for this event." });
    }

    // Format recipients for Brevo API
    const recipients = participants.map((p) => ({
      email: p.email,
      name: p.memberName,
    }));

    // Prepare email content
    const emailData = {
      sender: { email: process.env.BREVO_SENDER_EMAIL, name: "Event Organizer" },
      to: recipients,
      subject: `Update for Event: ${eventName}`,
      htmlContent: `
        <h2>Important Update for ${eventName}</h2>
        <p>${message}</p>
        <p>Thank you!</p>
      `,
    };

    // Send Email
    await apiInstance.sendTransacEmail(emailData);

    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending message:", error);

    if (error.response) {
      console.error("Brevo API Response:", error.response.body);
    }

    res.status(500).json({ message: "Error sending message. Try again." });
  }
});


// app.post("/api/send-event-message", async (req, res) => {
//   try {
//     const { eventId, message } = req.body;

//     const event = await Event.findById(eventId);
//     if (!event) {
//       return res.status(404).json({ message: "Event not found" });
//     }

//     const participants = await JoinedEvent.find({ eventName: event.eventName });

//     if (participants.length === 0) {
//       return res
//         .status(400)
//         .json({ message: "No participants registered for this event" });
//     }

//     // Send Email to All Participants
//     const emails = participants.map((p) => p.email);
//     const mailOptions = {
//       // from: process.env.GOOGLE_EMAIL,
//       from: process.env.BREVO_SENDER_EMAIL,
//       to: emails,
//       subject: `Update for Event: ${event.eventName}`,
//       html: `
//         <h2>Important Update for ${event.eventName}</h2>
//         <p>${message}</p>
//         <p>📅 Date: ${event.eventDate} <br> 
        
//         </p>
//         <p>Thank you!</p>
//       `,
//     };

//     await transporter.sendMail(mailOptions);

//     res.status(200).json({ message: "Message sent successfully!" });
//   } catch (error) {
//     console.error("Error sending message:", error);
//     res.status(500).json({ message: "Error sending message. Try again." });
//   }
// });

// Store a new query from a logged-in user
app.post("/queries", async (req, res) => {
  try {
    const { email, message } = req.body;

    let user = await Member.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    let query = await Query.findOne({ userEmail: email });
    if (!query) {
      query = new Query({
        userName: `${user.firstName} ${user.lastName}`,
        userEmail: email,
        messages: [],
      });
    }

    query.messages.push({ sender: "user", message });
    await query.save();

    io.to(email).emit("newQuery", query); // Emit only to the user

    res.status(201).json(query);
  } catch (error) {
    res.status(500).json({ error: "Failed to save query" });
  }
});

app.get("/queries/users", async (req, res) => {
  try {
    const users = await Query.find({}, "userName userEmail");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Fetch all queries
app.get("/queries/:userEmail", async (req, res) => {
  try {
    const query = await Query.findOne({ userEmail: req.params.userEmail });
    if (!query) return res.status(404).json({ error: "No messages found" });

    res.json(query.messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// Admin responds to a query
app.put("/queries/:userEmail", async (req, res) => {
  try {
    const { response } = req.body;
    const query = await Query.findOne({ userEmail: req.params.userEmail });

    if (!query) return res.status(404).json({ error: "Query not found" });

    query.messages.push({ sender: "admin", message: response });
    await query.save();

    io.to(req.params.userEmail).emit("updateQuery", query); // Emit only to the user
    res.json(query);
  } catch (error) {
    res.status(500).json({ error: "Failed to update response" });
  }
});

const users = {}; // Store connected users

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("registerUser", (email) => {
    users[email] = socket.id;
    socket.join(email);
  });

  socket.on("sendMessage", ({ email, message }) => {
    if (users[email]) {
      io.to(users[email]).emit("receiveMessage", { sender: "user", message });
    }
  });

  socket.on("sendResponse", ({ email, response }) => {
    if (users[email]) {
      io.to(users[email]).emit("receiveMessage", {
        sender: "admin",
        message: response,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    Object.keys(users).forEach((key) => {
      if (users[key] === socket.id) delete users[key];
    });
  });
});

app.post("/api/announcements", upload.single("image"), async (req, res) => {
  try {
    const { title, message, active } = req.body;
    let imageUrl = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path); // Delete local file after upload
    }

    const newAnnouncement = new Announcement({
      title,
      message,
      image: imageUrl,
      active: active === "true", // Convert string to boolean
    });

    await newAnnouncement.save();
    res.status(201).json(newAnnouncement);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET - Fetch Only Active Announcements (For Users)
app.get("/api/announcements", async (req, res) => {
  try {
    const announcements = await Announcement.find({ active: true }).sort({
      _id: -1,
    });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET - Fetch All Announcements (For Admin)
app.get("/api/admin/announcements", async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ _id: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ PUT - Toggle Active/Inactive Status
app.put("/api/announcements/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body; // ✅ Get the active status from request body

    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      id,
      { active }, // ✅ Update only the active field
      { new: true } // ✅ Return the updated document
    );

    res.json(updatedAnnouncement);
  } catch (err) {
    res.status(500).json({ error: "Error updating announcement" });
  }
});

// ✅ DELETE - Remove an Announcement
app.delete("/api/announcements/:id", async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ message: "Not found" });

    // Remove from Cloudinary if an image exists
    if (announcement.image) {
      const publicId = announcement.image.split("/").pop().split(".")[0]; // Extract public ID
      await cloudinary.uploader.destroy(publicId);
    }

    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: "Announcement deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Fetch chat history
app.get("/api/chat/:senderID/:receiverID", async (req, res) => {
  const { senderID, receiverID } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { senderID, receiverID },
        { senderID: receiverID, receiverID: senderID },
      ],
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// ✅ Real-time chat logic
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("sendMessage", async ({ senderID, receiverID, message }) => {
    const newMessage = new Message({ senderID, receiverID, message });
    await newMessage.save();

    io.emit("receiveMessage", newMessage); // Send message to all connected clients
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ✅ **Start Server**
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
