const Wallet = require("../../../models/walletSchema");

const getWallet = async (req, res, next) => {
  try {
    const userId = req.user.id; // Assuming authentication middleware adds `user.id`

    const wallet = await Wallet.findOne({ userId }).lean();

    if (!wallet) {
      return res.status(404).json({ 
        success: false, 
        message: "Wallet not found." 
      });
    }

    res.status(200).json({
      success: true,
      balance: wallet.balance,
      transactions: wallet.transactions.reverse(), // Show latest transactions first
    });
  } catch (err) {
    next(err);
  }
};
