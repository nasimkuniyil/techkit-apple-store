const mongoose = require('mongoose');

// Define the schema for the sales report
const salesReportSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    totalOrders: {
        type: Number,
        required: true,
        default: 0,
    },
    totalRevenue: {
        type: Number,
        required: true,
        default: 0.0,
    },
    avgOrderValue: {
        type: Number,
        required: true,
        default: 0.0,
    },
    conversionRate: {
        type: Number,
        required: true,
        default: 0.0,
    },
    topProducts : [{product_name:{type:String},purchases:{type:Number}}],
    productsSold: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',  // Reference to a Product model
            required: true,
        },
        quantitySold: {
            type: Number,
            required: true,
            default: 0,
        },
        revenueGenerated: {
            type: Number,
            required: true,
            default: 0.0,
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Optional: Automatically update the `updatedAt` field before saving the document
salesReportSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Create the model based on the schema
const SalesReport = mongoose.model('SalesReport', salesReportSchema);

module.exports = SalesReport;
