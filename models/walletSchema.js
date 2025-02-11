const mongoose = require("mongoose");

const WalletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  balance: { type: Number, default: 0 },
  transactions: [
    {
      amount: Number,
      type: { type: String, enum: ["credit", "debit"], required: true },
      date: { type: Date, default: Date.now },
    }
  ],
});

const Wallet = mongoose.model("Wallet", WalletSchema);
module.exports = Wallet;