const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const validateEmail = (email) => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: [true, "A user must have a name"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validateEmail, "Enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "A user must have a password"],
      select: false,
      minLength: 6,
    },
    isadmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password =  bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.validatePassword = async (input_password, user_password) => {
  return await bcrypt.compare(input_password, user_password);
};

module.exports = mongoose.model("User", userSchema);
