const Address = require("../../../models/addressSchema");
const Order = require("../../../models/orderSchema");
const {generateSalesReport,otherReports,getTopProductsByPeriod,} = require("../../../service/salesReport");


const salesReport = async (req, res, next) => {
  console.log("------ entered get sales data");
  let dateFilter;
  try {
    const report = await generateSalesReport(req.query.period);
    const topProducts = await getTopProductsByPeriod(req.query.period);
    
    
    
    console.log("hello sales report : ", report);
    console.log("hello sales report : ", topProducts);

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
    console.log("salesReport api error");
    next(err);
  }
};


// above code is old


const getReportData = async (req, res, next) => {
  try {
    console.log('Fetching report data...');
    
    
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

    
    const deliveredOrders = await Order.find({
      orderStatus: "Delivered",
      createdAt: { $gte: start, $lt: end }
    })
      .populate("products.productId")
      .populate('addressInfo')
      .lean();

    
    let totalRevenue = deliveredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    let totalOrders = deliveredOrders.length;

    console.log('Total Orders:', totalOrders);
    console.log('Total Revenue:', totalRevenue);

    res.status(200).json({
      success: true,
      totalOrders,
      totalRevenue,
      orders: deliveredOrders,
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
