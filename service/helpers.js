const Coupon = require("../models/couponSchema");
const Order = require("../models/orderSchema");
const Product = require("../models/productSchema");
const SalesReport = require("../models/salesReportSchema");
const VisitorCount = require("../models/visitorSchema");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const otherReports = async () => {
  try {
    const orders = await Order.find();
    const totalOrders = orders.length;

    const visitors = await VisitorCount.findOne();
    const totalVisitors = visitors.count;
    const conversionRate = ((totalOrders / totalVisitors) * 100).toFixed(2);

    //Top products
    const topProducts = (
      await Product.find()
        .sort({ purchases: -1 })
        .limit(5)
        .select("product_name purchases -_id")
    ).map((prod) => {
      const names = prod.product_name.split(" ");
      prod.product_name = `${names[0] || ""} ${names[1] || ""}`;
      return prod;
    });

    const salesReport = {
      conversionRate,
      topProducts,
    };

    return salesReport;

    // const report = await new SalesReport(salesReport);
    // await report.save();
  } catch (err) {
    console.log("sales report error");
    next(err);
  }
};

// abc
async function generateDailySalesReport(date) {
  try {
    let dateFilterStart = new Date(date);
    dateFilterStart.setHours(0, 0, 0, 0); // Set to the start of the day
    let dateFilterEnd = new Date(date);
    dateFilterEnd.setHours(23, 59, 59, 999); // Set to the end of the day

    switch (date) {
      case "daily":
        // For daily filter, it's today
        dateFilterStart = new Date();
        dateFilterStart.setHours(0, 0, 0, 0); // Start of today
        dateFilterEnd = new Date();
        dateFilterEnd.setHours(23, 59, 59, 999); // End of today
        break;

      case "weekly":
        // For weekly filter, get the last 7 days
        dateFilterEnd = new Date(); // End date is today
        dateFilterStart = new Date();
        dateFilterStart.setDate(dateFilterEnd.getDate() - 7); // Subtract 7 days for the start date
        dateFilterStart.setHours(0, 0, 0, 0); // Start of 7 days ago
        dateFilterEnd.setHours(23, 59, 59, 999); // End of today
        break;

      case "monthly":
        // For monthly filter, get from the 1st of the current month to today
        dateFilterEnd = new Date(); // End date is today
        dateFilterStart = new Date();
        dateFilterStart.setDate(1); // Set to the first day of the month
        dateFilterStart.setHours(0, 0, 0, 0); // Start of the month
        dateFilterEnd.setHours(23, 59, 59, 999); // End of today
        break;

      case "yearly":
        // For yearly filter, get from the 1st of January of the current year to today
        dateFilterEnd = new Date(); // End date is today
        dateFilterStart = new Date();
        dateFilterStart.setMonth(0, 1); // Set to January 1st
        dateFilterStart.setHours(0, 0, 0, 0); // Start of the year
        dateFilterEnd.setHours(23, 59, 59, 999); // End of today
        break;

      case "custom":
        // Custom date filter: Get the start and end dates from the request query
        const { startDate, endDate } = req.query;

        if (startDate && endDate) {
          // Convert start and end date from string (e.g., 'YYYY-MM-DD') to Date objects
          dateFilterStart = new Date(startDate);
          dateFilterEnd = new Date(endDate);
          dateFilterEnd.setHours(23, 59, 59, 999); // Ensure the end date includes the whole day
        } else {
          throw new Error(
            "Both startDate and endDate are required for custom period."
          );
        }
        break;

      default:
        // If no valid period is specified, you can handle the default case here
        // Example: Default to daily filter or return an error message
        dateFilterStart = new Date();
        dateFilterStart.setHours(0, 0, 0, 0); // Start of today
        dateFilterEnd = new Date();
        dateFilterEnd.setHours(23, 59, 59, 999); // End of today
    }

    // MongoDB aggregation pipeline for fetching daily sales data
    const salesReport = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: dateFilterStart,
            $lte: dateFilterEnd,
          },
          orderStatus: { $ne: "Cancelled" }, // Optional: excluding cancelled orders
        },
      },
      {
        $unwind: "$products",
      },
      {
        $lookup: {
          from: "products",
          localField: "products.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails",
      },
      {
        $addFields: {
          totalProductPrice: {
            $multiply: ["$products.quantity", "$productDetails.price"],
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalProductPrice" },
          totalProductsSold: { $sum: "$products.quantity" },
          averageOrderValue: { $avg: "$totalProductPrice" },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          totalOrders: 1,
          totalRevenue: 1,
          averageOrderValue: 1,
          totalProductsSold: 1,
        },
      },
    ]);

    if (salesReport.length === 0) {
      return null;
    }

    return salesReport;
  } catch (err) {
    console.error("Error generating daily sales report:", err);
    throw err;
  }
}

// get top products
async function getTopProductsByPeriod(period) {
  try {
    // Define the start and end date based on the period
    let startDate, endDate;

    switch (period) {
      case "daily":
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0); // Set to 00:00 of today
        endDate = new Date(startDate);
        endDate.setHours(23, 59, 59, 999); // Set to 23:59 of today
        break;

      case "weekly":
        const now = new Date();
        const firstDayOfWeek = now.getDate() - now.getDay(); // Calculate start of the week
        startDate = new Date(now.setDate(firstDayOfWeek));
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6); // Set to end of the week
        endDate.setHours(23, 59, 59, 999);
        break;

      case "monthly":
        const monthStart = new Date();
        monthStart.setDate(1); // Set to first day of the month
        monthStart.setHours(0, 0, 0, 0);
        startDate = monthStart;
        endDate = new Date(monthStart);
        endDate.setMonth(startDate.getMonth() + 1);
        endDate.setDate(0); // Last day of the month
        endDate.setHours(23, 59, 59, 999);
        break;

      case "yearly":
        const yearStart = new Date();
        yearStart.setMonth(0, 1); // Set to January 1st of the current year
        yearStart.setHours(0, 0, 0, 0);
        startDate = yearStart;
        endDate = new Date(yearStart);
        endDate.setFullYear(startDate.getFullYear() + 1);
        endDate.setDate(0); // Last day of the year
        endDate.setHours(23, 59, 59, 999);
        break;

      default:
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0); // Set to 00:00 of today
        endDate = new Date(startDate);
        endDate.setHours(23, 59, 59, 999); // Set to 23:59 of today
    }

    // Fetch the sales data for the given period
    const topProducts = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
          orderStatus: { $ne: "Cancelled" }, // Optional: Exclude cancelled orders
        },
      },
      {
        $unwind: "$products", // Unwind the products array in the order
      },
      {
        $group: {
          _id: "$products.productId", // Group by product ID
          totalQuantitySold: { $sum: "$products.quantity" }, // Sum the quantity sold for each product
        },
      },
      {
        $lookup: {
          from: "products", // Lookup the product details
          localField: "_id", // Match productId from the order
          foreignField: "_id", // Match with _id field in Product collection
          as: "productDetails", // Alias for the joined product details
        },
      },
      {
        $unwind: "$productDetails", // Unwind the productDetails array
      },
      {
        $project: {
          productName: "$productDetails.product_name", // Get the product name
          totalQuantitySold: 1, // Include the total quantity sold
        },
      },
      {
        $sort: { totalQuantitySold: -1 }, // Sort by totalQuantitySold in descending order
      },
      {
        $limit: 5, // Limit to the top 5 products
      },
    ]);

    // Return the top 5 products
    return topProducts;
  } catch (err) {
    console.error("Error getting top products:", err);
    throw err;
  }
}
module.exports = {
  generateOTP,
  otherReports,
  generateDailySalesReport,
  getTopProductsByPeriod,
};
