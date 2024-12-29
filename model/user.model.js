import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile_picture: {
      type: String,
    },
    otp: String,
    otpValidated: {
      type: Boolean,
      default: false,
    },
    otpExpiry: Date,
    resetOtp: String,
    resetOtpExpiry: Date,
  },
  { timestamps: true }
);

// Password hashing before saving the user
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10); // Generate salt
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
    next();
  } catch (err) {
    next(err);
  }
});

// Compare input password with the hashed password
UserSchema.methods.comparePassword = async function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password);
};

// Generate OTP for email/phone verification
UserSchema.methods.generateOtp = function () {
  const otp = Math.floor(1000 + Math.random() * 9000); // 4-digit OTP
  this.otp = otp.toString();
  this.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
  return otp;
};

// Validate OTP
UserSchema.methods.validateOtp = function (inputOtp) {
  if (this.otp !== inputOtp) {
    return false;
  }
  if (this.otpExpiry < Date.now()) {
    return false;
  }
  this.otpValidated = true;
  this.otp = null; // Clear OTP after validation
  this.otpExpiry = null;
  return true;
};

// Generate reset OTP for password recovery
UserSchema.methods.generateResetOtp = function () {
  const resetOtp = Math.floor(100000 + Math.random() * 900000); // 6-digit reset OTP
  this.resetOtp = resetOtp.toString();
  this.resetOtpExpiry = new Date(Date.now() + 15 * 60 * 1000); // Reset OTP valid for 15 minutes
  return resetOtp;
};

// Validate reset OTP
UserSchema.methods.validateResetOtp = function (inputResetOtp) {
  if (this.resetOtp !== inputResetOtp) {
    return false;
  }
  if (this.resetOtpExpiry < Date.now()) {
    return false;
  }
  this.resetOtp = null; // Clear reset OTP after validation
  this.resetOtpExpiry = null;
  return true;
};

// Middleware to clear sensitive data when converting to JSON
UserSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.otp;
  delete userObject.otpExpiry;
  delete userObject.resetOtp;
  delete userObject.resetOtpExpiry;
  return userObject;
};

const User = mongoose.model("User", UserSchema);

export default User;
