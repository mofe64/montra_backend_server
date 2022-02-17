import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  _id: {
    type: String,
  },
  name: {
    type: String,
    required: [true, "Please provide the account name"],
  },
  balance: {
    type: mongoose.Schema.Types.Decimal128,
    default: 0.0,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Account must belong to a user"],
  },
});

const decimal2JSON = (v, i, prev) => {
  if (v !== null && typeof v === "object") {
    if (v.constructor.name === "Decimal128") prev[i] = v.toString();
    else
      Object.entries(v).forEach(([key, value]) =>
        decimal2JSON(value, key, prev ? prev[i] : v)
      );
  }
};

accountSchema.set("toJSON", {
  transform: (doc, ret) => {
    decimal2JSON(ret);
    return ret;
  },
});
const autoPopulateFunc = function (next) {
  this.populate({
    path: "owner",
    select: "-password -role -__v",
  });
  next();
};

accountSchema.pre("findOne", autoPopulateFunc).pre("find", autoPopulateFunc);

const Account = mongoose.model("Account", accountSchema);

export default Account;
