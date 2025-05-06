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
    origin: "http://localhost:5173",
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

const ItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  keywords: { type: String, trim: true },
  category: {
    type: mongoose.Schema.Types.ObjectID,
    ref: "Category",
    required: true,
  },
  images: { type: [String], required: true },
  city: { type: String, required: true, trim: true },
  condition: {
    type: String,
    enum: ["New", "Gently Used", "Heavily Used"],
    required: true,
  },
  swapOrGiveaway: {
    type: String,
    enum: ["Swap", "Giveaway"],
    required: true,
  },
  price: { type: String, trim: true },

  memberID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
    required: true,
  },

  createdAt: { type: Date, default: Date.now },
});
// Optional: create indexes to improve search performance
ItemSchema.index({ itemName: "text", keywords: "text" });

const Item = mongoose.model("Item", ItemSchema);

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
  unreadCount: { type: Number, default: 0 }, // Tracks unread admin messages
  messages: [
    {
      message: String,
      sender: String, // "user" or "admin"
      timestamp: { type: Date, default: Date.now },
      read: { type: Boolean, default: false }, // Track if message is read
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

// Review Schema
const ReviewSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
    required: true,
  },
  name: String,
  email: String,
  rating: { type: Number, required: true, min: 0, max: 5 },
  reviewText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Review = mongoose.model("Review", ReviewSchema);

const chatSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    messages: [
      {
        senderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Member",
          required: true,
        },
        text: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    lastMessage: { type: String },
  },
  { timestamps: true }
);
const Chat = mongoose.model("Chat", chatSchema);

const chatMessageSchema = new mongoose.Schema(
  {
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "Member" },
    text: String,
  },
  { timestamps: true }
);

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
    required: true,
  },
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
        { expiresIn: "2d" }
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
      expiresIn: "2h",
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
      {
        $group: {
          _id: "$category", // Group by category ID
          count: { $sum: 1 }, // Count items in each group
        },
      },
      {
        $lookup: {
          from: "categories", // The MongoDB collection name (lowercase, pluralized by Mongoose)
          localField: "_id", // The field from the Item collection (category ID)
          foreignField: "_id", // The field from the Category collection
          as: "categoryDetails", // The output array field
        },
      },
      {
        $unwind: "$categoryDetails", // Flatten the categoryDetails array
      },
      {
        $project: {
          _id: 0, // Exclude the default _id field
          category: {
            _id: "$_id", // Include category ID
            name: "$categoryDetails.name", // Include category name
          },
          count: 1, // Include the count
        },
      },
      {
        $sort: { count: -1 }, // Sort by count in descending order
      },
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
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
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

// ✅ Middleware to verify token and get user
const getUserFromToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // First try to find the user in Member collection
    let user = await Member.findById(decoded.id).select("-password");
    if (user) return user;

    // Then try Admin collection
    user = await Admin.findById(decoded.id).select("-password");
    if (user) return user;

    return null; // No user found in either
  } catch (error) {
    return null;
  }
};

// ✅ Create an Item
app.post("/api/list-item", upload.array("images", 5), async (req, res) => {
  try {
    const user = await getUserFromToken(req, res);
    if (!user) return res.status(401).json({ message: "Unauthorized." });

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

    const imageUrls = await uploadImagesToCloudinary(req.files);

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
      memberID: user._id,
    });

    await newItem.save();
    res.status(201).json({ message: "Item listed successfully!", newItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const fetchItems = async (query, page, limit, res) => {
  try {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const items = await Item.find(query)
      .populate("memberID", "firstName lastName email mobile")
      .populate("category", "name") // Populates category with _id and name
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalItems = await Item.countDocuments(query);

    return res.status(200).json({
      items,
      totalItems,
      page,
      totalPages: Math.ceil(totalItems / limit),
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching items." });
  }
};

// GET /api/items - Fetch all items
app.get("/api/items", async (req, res) => {
  const { page, limit } = req.query;
  await fetchItems({}, page, limit, res);
});

app.get("/api/items/exclude-user", async (req, res) => {
  try {
    const user = await getUserFromToken(req, res);
    if (!user) return res.status(401).json({ message: "Unauthorized." });

    const { page, limit } = req.query;
    await fetchItems({ memberID: { $ne: user._id } }, page, limit, res);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching items." });
  }
});

app.get("/api/items/user-items", async (req, res) => {
  try {
    const user = await getUserFromToken(req, res);
    if (!user) return res.status(401).json({ message: "Unauthorized." });

    const { page, limit } = req.query;
    await fetchItems({ memberID: user._id }, page, limit, res);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching items." });
  }
});

app.get("/api/items/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate("memberID", "firstName lastName email mobile")
      .populate("category", "name"); // Populates category with _id and name

    if (!item) return res.status(404).json({ message: "Item not found" });

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Error fetching item." });
  }
});

app.put("/api/update-item/:id", upload.array("images", 5), async (req, res) => {
  try {
    const user = await getUserFromToken(req, res);
    if (!user) return res.status(401).json({ message: "Unauthorized." });

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

    if (req.files.length > 0) {
      imageUrls = await uploadImagesToCloudinary(req.files);
    }

    item.set({
      itemName,
      description,
      keywords,
      category,
      images: imageUrls,
      city,
      condition,
      swapOrGiveaway,
      price,
    });
    await item.save();

    res.status(200).json({ message: "Item updated successfully!", item });
  } catch (error) {
    res.status(500).json({ message: "Error updating item." });
  }
});

app.delete("/api/delete-item/:id", async (req, res) => {
  try {
    const user = await getUserFromToken(req, res);
    if (!user) return res.status(401).json({ message: "Unauthorized." });

    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (
      user.role === "admin" ||
      user.role === "co-admin" ||
      item.memberID.toString() === user._id.toString()
    ) {
      await Item.findByIdAndDelete(req.params.id);
      return res.status(200).json({ message: "Item deleted successfully!" });
    }

    res.status(403).json({ message: "Unauthorized to delete this item" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting item." });
  }
});

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

// Event Registration Route
app.post("/api/join-event", async (req, res) => {
  const { eventName, eventDate, eventLocation, memberName, email, mobile } =
    req.body;

  if (
    !eventName ||
    !eventDate ||
    !eventLocation ||
    !memberName ||
    !email ||
    !mobile
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the user has already joined this event
    const existingRegistration = await JoinedEvent.findOne({
      eventName,
      email,
    });

    if (existingRegistration) {
      return res
        .status(400)
        .json({ message: "You have already joined this event." });
    }

    // Prepare email content
    const emailData = {
      sender: {
        email: process.env.BREVO_SENDER_EMAIL,
        name: "Event Organizer",
      },
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
    const newJoinedEvent = new JoinedEvent({
      eventName,
      eventDate,
      eventLocation,
      memberName,
      email,
      mobile,
    });
    await newJoinedEvent.save();

    res
      .status(200)
      .json({ message: "Successfully joined event! Confirmation email sent." });
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
      return res
        .status(400)
        .json({ message: "No participants registered for this event." });
    }

    // Format recipients for Brevo API
    const recipients = participants.map((p) => ({
      email: p.email,
      name: p.memberName,
    }));

    // Prepare email content
    const emailData = {
      sender: {
        email: process.env.BREVO_SENDER_EMAIL,
        name: "Event Organizer",
      },
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

// Socket.IO Connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", (chatId) => {
    socket.join(chatId);
    console.log(`User joined room: ${chatId}`);
  });

  socket.on("sendMessage", (message) => {
    io.to(message.chatId).emit("receiveMessage", message);
  });

  socket.on("leaveRoom", (chatId) => {
    socket.leave(chatId);
    console.log(`User left room: ${chatId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Token verification middleware
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, "omdedaniya"); // replace with your real secret
    const user = await Member.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

// ======== ROUTES =========

// POST Review
app.post("/api/review", authenticate, async (req, res) => {
  try {
    const { reviewText, rating } = req.body;

    if (!reviewText || !rating) {
      return res
        .status(400)
        .json({ message: "Review and rating are required" });
    }

    const newReview = new Review({
      memberId: req.user._id,
      name: `${req.user.firstName} ${req.user.lastName}`,
      email: req.user.email,
      reviewText,
      rating,
    });

    await newReview.save();
    res.status(201).json({ message: "Review submitted successfully" });
  } catch (err) {
    console.error("Error saving review:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET all reviews
app.get("/api/reviews", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching reviews", error: err.message });
  }
});

// Create or get existing chat

app.post("/api/chats", async (req, res) => {
  try {
    const { buyerId, sellerId, itemId } = req.body;

    if (!buyerId || !sellerId || !itemId) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    let chat = await Chat.findOne({ buyerId, sellerId, itemId });

    if (!chat) {
      chat = new Chat({ buyerId, sellerId, itemId, messages: [] });
      await chat.save();
    }

    res.status(200).json(chat);
  } catch (err) {
    console.error("Create Chat Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/chats/:chatId/message", async (req, res) => {
  try {
    const { chatId } = req.params;
    const { sender, text } = req.body;

    if (!sender || !text) {
      return res.status(400).json({ message: "Sender and text are required" });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    const message = { sender, text };
    chat.messages.push(message);
    chat.lastMessage = text;
    await chat.save();

    io.to(chatId).emit("receiveMessage", message);

    res.status(201).json(message);
  } catch (err) {
    console.error("Send Message Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/chats", async (req, res) => {
  try {
    const { buyerId, sellerId, itemId } = req.body;

    if (!buyerId || !sellerId || !itemId) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    let chat = await Chat.findOne({ buyerId, sellerId, itemId });

    if (!chat) {
      chat = new Chat({ buyerId, sellerId, itemId, messages: [] });
      await chat.save();
    }

    res.status(200).json(chat);
  } catch (err) {
    console.error("Create Chat Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/chats/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const chats = await Chat.find({
      $or: [{ buyerId: userId }, { sellerId: userId }],
    }).populate("buyerId sellerId itemId");

    res.status(200).json(chats);
  } catch (err) {
    console.error("Get User Chats Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/chats/:chatId/messages", async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId).populate(
      "messages.sender"
    );
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    res.status(200).json(chat.messages);
  } catch (err) {
    console.error("Get Messages Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Find a specific chat between buyer & seller for an item
app.get("/api/chats/find/:buyerId/:sellerId/:itemId", async (req, res) => {
  try {
    const { buyerId, sellerId, itemId } = req.params;

    const chat = await Chat.findOne({ buyerId, sellerId, itemId });

    res.status(200).json(chat);
  } catch (err) {
    console.error("Find Chat Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/messages/:chatId", async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    res.status(200).json(chat.messages);
  } catch (err) {
    console.error("Get Messages Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/message", async (req, res) => {
  try {
    const { chatId, senderId, text } = req.body;

    if (!chatId || !senderId || !text) {
      return res
        .status(400)
        .json({ message: "chatId, senderId, and text are required" });
    }

    // Validate chatId and senderId as ObjectId
    if (
      !mongoose.Types.ObjectId.isValid(chatId) ||
      !mongoose.Types.ObjectId.isValid(senderId)
    ) {
      return res.status(400).json({ message: "Invalid chatId or senderId" });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    // Determine receiverId (the other participant in the chat)
    const receiverId =
      chat.buyerId.toString() === senderId ? chat.sellerId : chat.buyerId;
    if (!receiverId) {
      return res.status(400).json({ message: "Unable to determine receiver" });
    }

    const message = { senderId, text, timestamp: new Date() };
    chat.messages.push(message);
    chat.lastMessage = text;
    await chat.save();

    io.to(chatId).emit("receiveMessage", message);

    res.status(201).json(message);
  } catch (err) {
    console.error("Send Message Error:", err.message, err.stack);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Routes
app.get("/api/search/items", async (req, res) => {
  const { itemName } = req.query;

  if (!itemName || itemName.trim() === "") {
    return res
      .status(400)
      .json({ message: "itemName query parameter is required" });
  }

  try {
    // Get the logged-in user
    const user = await getUserFromToken(req, res);
    if (!user) {
      return res
        .status(401)
        .json({ message: "Authentication token required or invalid" });
    }

    // Search for items by itemName (case-insensitive) and exclude user's own items
    const items = await Item.find({
      itemName: { $regex: itemName, $options: "i" }, // Case-insensitive search
      memberID: { $ne: user._id }, // Exclude items posted by the logged-in user
    }).populate("memberID", "firstName lastName"); // Optional: Populate seller info

    if (items.length === 0) {
      return res.status(404).json({ message: "No items found" });
    }

    return res.status(200).json(items);
  } catch (error) {
    console.error("Item search error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/item/dashboard/search", async (req, res) => {
  const searchQuery = req.query.q;

  if (!searchQuery) {
    return res.status(400).json({ error: "Search query is required" });
  }

  // Split search string into words and build regex OR conditions
  const words = searchQuery.trim().split(/\s+/);
  const regexConditions = words.map((word) => ({
    itemName: { $regex: word, $options: "i" },
  }));

  try {
    const items = await Item.find({ $or: regexConditions })
      .limit(10)
      .populate("category", "name")
      .populate("memberID", "username");

    res.json(items);
  } catch (error) {
    console.error("Error searching items:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ **Start Server**
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server with Socket.IO running on port ${PORT}`)
);
