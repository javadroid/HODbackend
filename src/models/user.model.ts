import { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";
import Web3 from "web3";
const userSchema = new Schema(
  {
    lname: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
    },
    fname: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
    },
    mname: {
      type: String,
      
      trim: true,
    },
    is_student: Boolean,
    type: {
      type: String,
      required: true,
      validate: {
        validator: async function(this: any,value:any) {
          if (this.is_student) {
            // Validate type for students
            return ["MSC", "PGD"].includes(value);
          } else {
            // Validate type for non-students
            return [
              "Faculty PG Coordinator",
              "Departmental PG Coordinator",
              "Dean",
              "HOD",
              "Dean PG Schools"
            ].includes(value);
          }
        },
        message: 'Invalid type value for the provided is_student status',
      },
    },
    department: String,
    faculty: String,
    userID: String,
    phone: String,
    public_address: String,
    private_key: String,
    supervisors: {
      major:{
          type: String,
          ref: "UserModel",
        },
      minor:{
          type: String,
          ref: "UserModel",
        }
    },
    email: {
      type: String,
      required: [true, "Please provide a valid email"],
      unique: true,
      trim: true,
      lowercase: true,
      match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
    },
    picture: {
      type: String,
      trim: true,
      default:
        "https://st3.depositphotos.com/6672868/13701/v/380/depositphotos_137014128-stock-illustration-user-profile-icon.jpg",
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
    },
    status: {
      type: String,
      trim: true,
      default: "unverified",
    },
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      const web3 = new Web3();
      const newWallet = await web3.eth.accounts.create();
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(this.password, salt);
      this.email = this.email.toLowerCase();
      this.password = hash;
      this.private_key = newWallet.privateKey;
      this.public_address = newWallet.address;
    }
  } catch (error) {
    // Handle error
  }

  next();
});
const UserModel = models.UserModel || model("UserModel", userSchema);

export default UserModel;
