import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already exists"],
      lowercase: true,
      trim: true,
      validate: {
        validator: function (email) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email);
        },
        message: "Please provide a valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false, // Don't include password in queries by default
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minlength: [2, "Username must be at least 2 characters long"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      validate: {
        validator: function (username) {
          // Allow alphanumeric characters, underscores, and hyphens
          const usernameRegex = /^[a-zA-Z0-9_-]+$/;
          return usernameRegex.test(username);
        },
        message:
          "Username can only contain letters, numbers, underscores, and hyphens",
      },
    },
    image: {
      type: String,
      validate: {
        validator: function (url) {
          if (!url) return true; // Allow empty
          const urlRegex = /^https?:\/\/.+$/;
          return urlRegex.test(url);
        },
        message: "Please provide a valid image URL",
      },
    },
    coverImage: {
      type: String,
      validate: {
        validator: function (url) {
          if (!url) return true; // Allow empty
          const urlRegex = /^https?:\/\/.+$/;
          return urlRegex.test(url);
        },
        message: "Please provide a valid cover image URL",
      },
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        validate: {
          validator: function (id) {
            return mongoose.Types.ObjectId.isValid(id);
          },
          message: "Invalid product ID",
        },
      },
    ],
    oders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Oder",
        validate: {
          validator: function (id) {
            return mongoose.Types.ObjectId.isValid(id);
          },
          message: "Invalid order ID",
        },
      },
    ],
    isAdmin: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    loginAttempts: {
      type: Number,
      default: 0,
      min: 0,
    },
    lockUntil: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },
    emailVerificationExpires: {
      type: Date,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for better query performance
// Note: email index is automatically created by unique: true constraint
userSchema.index({ username: 1 });
userSchema.index({ isAdmin: 1 });
userSchema.index({ isActive: 1 });

// Virtual for account lock status
userSchema.virtual("isLocked").get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware to hash password and sanitize data
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to sanitize data
userSchema.pre("save", function (next) {
  // Sanitize email
  if (this.email) {
    this.email = this.email.toLowerCase().trim();
  }

  // Sanitize username
  if (this.username) {
    this.username = this.username.trim();
  }

  // Sanitize name
  if (this.name) {
    this.name = this.name.trim();
  }

  next();
});

// Instance method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to increment login attempts
userSchema.methods.incLoginAttempts = function () {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 },
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };

  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 };
  }

  return this.updateOne(updates);
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = function () {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 },
    $set: { lastLogin: Date.now() },
  });
};

// Static method to find by email with case-insensitive search
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Static method to find by email with password (for login)
userSchema.statics.findByEmailWithPassword = function (email) {
  return this.findOne({ email: email.toLowerCase() }).select("+password");
};

// Static method to find active users only
userSchema.statics.findActive = function () {
  return this.find({ isActive: true });
};

// Static method to find admin users
userSchema.statics.findAdmins = function () {
  return this.find({ isAdmin: true, isActive: true });
};

// Instance method to deactivate account
userSchema.methods.deactivate = function () {
  this.isActive = false;
  return this.save();
};

// Instance method to reactivate account
userSchema.methods.reactivate = function () {
  this.isActive = true;
  return this.save();
};

// Instance method to promote to admin
userSchema.methods.promoteToAdmin = function () {
  this.isAdmin = true;
  return this.save();
};

// Instance method to demote from admin
userSchema.methods.demoteFromAdmin = function () {
  this.isAdmin = false;
  return this.save();
};

// Instance method to verify email
userSchema.methods.verifyEmail = function () {
  this.emailVerified = true;
  this.emailVerificationToken = undefined;
  this.emailVerificationExpires = undefined;
  return this.save();
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
