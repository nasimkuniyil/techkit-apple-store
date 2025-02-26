const Address = require("../../../models/addressSchema");
const Category = require("../../../models/categorySchema");
const Order = require("../../../models/orderSchema");
const Product = require("../../../models/productSchema");
const {generateSalesReport,otherReports,getTopProductsByPeriod,} = require("../../../service/salesReport");


const salesReport = async (req, res, next) => {
  let dateFilter;
  try {
    const report = await generateSalesReport(req.query.period);
    const topProducts = await getTopProductsByPeriod(req.query.period);
    
    
    

    let result = report.reduce(
      (acc, curr) => {
        acc.totalOrders += curr.totalOrders;
        acc.totalRevenue += curr.totalRevenue;
        acc.totalProductsSold += curr.totalProductsSold;
        acc.averageOrderValue += curr.averageOrderValue;
        return acc;
      },
      {
        totalOrders: 0,
        totalRevenue: 0,
        totalProductsSold: 0,
        averageOrderValue: 0,
      }
    );

    result.date = report[0].date;

    return res.status(200).json({ report: result, topProducts });
  } catch (err) {
    next(err);
  }
};


// above code is old


const getReportData = async (req, res, next) => {
  try {
    
    
    const { filterType = "daily", startDate, endDate } = req.query;

    
    let start, end;
    const now = new Date();
    now.setHours(0, 0, 0, 0); 

    if (filterType === "daily") {
      start = new Date(now);
      end = new Date(now);
      end.setHours(23, 59, 59, 999);
    } else if (filterType === "weekly") {
      start = new Date(now);
      start.setDate(now.getDate() - now.getDay()); 
      end = new Date(now);
      end.setDate(start.getDate() + 6); 
      end.setHours(23, 59, 59, 999);
    } else if (filterType === "monthly") {
      start = new Date(now.getFullYear(), now.getMonth(), 1); 
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0); 
      end.setHours(23, 59, 59, 999);
    } else if (filterType === "yearly") {
      start = new Date(now.getFullYear(), 0, 1); 
      end = new Date(now.getFullYear(), 11, 31); 
      end.setHours(23, 59, 59, 999);
    } else if (filterType === "custom" && startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
    } else {
      return res.status(400).json({ success: false, message: "Invalid filter type or missing dates" });
    }

    const currentPage = req.query.page || 1;
    const limit = 50;
    const skip = (currentPage-1) * limit;

    let deliveredOrders = await Order.find({
      orderStatus: "Delivered",
      createdAt: { $gte: start, $lt: end }
    })
      .populate("products.productId")
      .populate('addressInfo')
      .lean();

      // Top 10 products
      const topProducts = await Order.aggregate([
        {
          $match: {
            orderStatus: "Delivered",
            createdAt: { $gte: start, $lt: end }
          }
        },
        { 
          $unwind: "$products" 
        },
        { 
          $group: {
            _id: "$products.productId", 
            totalPurchases: { $sum: "$products.quantity" }
          }
        },
        { 
          $lookup: {
            from: "products", 
            localField: "_id",
            foreignField: "_id",
            as: "productDetails"
          }
        },
        { 
          $unwind: "$productDetails" 
        },
        { 
          $project: {
            productName: "$productDetails.product_name",  
            price: "$productDetails.price",  
            images: "$productDetails.images",  
            totalPurchases: 1 
          }
        },
        { 
          $sort: { totalPurchases: -1 } 
        },
        { 
          $limit: 10 
        }
      ]);
      

      // Top 5 categories
      const topCategories = await Order.aggregate([
        {
          $match: {
            orderStatus: "Delivered",
            createdAt: { $gte: start, $lt: end } 
          }
        },
        { 
          $unwind: "$products" 
        },
        { 
          $group: {
            _id: "$products.productId", 
            totalPurchases: { $sum: "$products.quantity" } 
          }
        },
        { 
          $lookup: {
            from: "products", 
            localField: "_id",
            foreignField: "_id",
            as: "productDetails"
          }
        },
        { 
          $unwind: "$productDetails" 
        },
        { 
          $group: {
            _id: "$productDetails.category",  
            totalPurchases: { $sum: "$totalPurchases" }  
          }
        },
        { 
          $lookup: {
            from: "categories", 
            localField: "_id",
            foreignField: "_id",
            as: "categoryDetails"
          }
        },
        { 
          $unwind: "$categoryDetails"  
        },
        { 
          $project: {
            categoryName: "$categoryDetails.category_name", 
            totalPurchases: 1 
          }
        },
        { 
          $sort: { totalPurchases: -1 }  
        },
        { 
          $limit: 5 
        }
      ]);
      

      const salesData = await Order.aggregate([
        {
          $match: {
            orderStatus: "Delivered",
            createdAt: { $gte: start, $lt: end }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: filterType === "daily" ? "%Y-%m-%d" :
                        filterType === "weekly" ? "%Y-%m-%d" :
                        filterType === "monthly" ? "%Y-%m" : "%Y",
                date: "$createdAt"
              }
            },
            totalSales: { $sum: "$totalAmount" },
            totalOrders: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);
      
      

      const allOrders = await Order.find({createdAt: { $gte: start, $lt: end }});
    
    let totalRevenue = deliveredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    let orders = await Order.find({orderStatus: "Delivered",createdAt: { $gte: start, $lt: end }});
    let totalOrders = orders.length;
    let totalPage = Math.ceil(totalOrders/limit);

    deliveredOrders = await Order.find({
      orderStatus: "Delivered",
      createdAt: { $gte: start, $lt: end }
    })
      .populate("products.productId")
      .populate('addressInfo')
      .lean()
      .skip(skip).limit(limit);


    res.status(200).json({
      success: true,
      totalOrders,
      totalRevenue,
      orders : deliveredOrders,
      allOrders,
      topProducts,
      topCategories,
      salesData,
      totalPage,
      currentPage
    });

  } catch (err) {
    console.error("Report data fetch error:", err);
    next(err);
  }
};



module.exports = {
  salesReport,
  getReportData,
};
