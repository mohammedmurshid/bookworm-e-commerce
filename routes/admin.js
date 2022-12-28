const Order = require("../models/order");

module.exports = {
  getSales: async (req, res) => {
    try {
      const errorMessage = req.flash("message");

      //   for getting daily sales report
      const dailySales = await Order.aggregate([
        {
          $match: { createdAt: { $ne: null } },
        },
        {
          $match: { status: { $ne: "Cancelled" } },
        },
        {
          $project: {
            Date: { $dateToString: { format: "%d-%m-%Y", date: "$createdAt" } },
            Time: { $dateToString: { format: "%H:%M", date: "$createdAt" } },
            paymentDetails: "$paymentType",
            subTotal: "$subTotal",
            status: "$status",
          },
        },
      ]);

      //   for getting all sales report
      const allOrders = await Order.find().sort({ createdAt: -1 }).exec();

      // For getting weekly sales report
      let weekly = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
      const weeklySales = await Order.aggregate([
        {
          $match: { createdAt: { $gte: weekly } },
        },
        {
          $match: { status: { $ne: "Cancelled" } },
        },
        {
          $project: {
            Date: { $dateToString: { format: "%d-%m-%Y", date: "$createdAt" } },
            Time: { $dateToString: { format: "%H:%M", date: "$createdAt" } },
            paymentDetails: "$paymentType",
            subTotal: { $sum: "$subTotal"},
            status: "$status",
          },
        },
      ]);

      //   for getting monthly sales report
      let monthly = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000);
      const monthlySales = await Order.aggregate([
        {
          $match: { createdAt: { $gte: monthly } },
        },
        {
          $match: { status: { $ne: "Cancelled" } },
        },
        {
          $project: {
            Date: { $dateToString: { format: "%d-%m-%Y", date: "$createdAt" } },
            Time: { $dateToString: { format: "%H:%M", date: "$createdAt" } },
            paymentDetails: "$paymentType",
            subTotal: { $sum: "$subTotal"},
            status: "$status",
          },
        },
      ]);

      //   for getting yearly sales report
      let yearly = new Date(
        new Date().getTime() - 12 * 30 * 24 * 60 * 60 * 1000
      );
      const yearlySales = await Order.aggregate([
        {
          $match: { createdAt: { $gte: yearly } },
        },
        {
          $match: { status: { $ne: "Cancelled" } },
        },
        {
          $project: {
            Date: { $dateToString: { format: "%d-%m-%Y", date: "$createdAt" } },
            Time: { $dateToString: { format: "%H:%M", date: "$createdAt" } },
            paymentDetails: "$paymentType",
            subTotal: { $sum: "$subTotal"},
            status: "$status",
          },
        },
      ]);

      res.render("admin/sales", {
        allOrders: allOrders,
        dailySales: dailySales,
        weeklySales: weeklySales,
        monthlySales: monthlySales,
        yearlySales: yearlySales,
        errorMessage: errorMessage,
        layout: "layouts/adminLayout",
      });
    } catch (err) {
      console.log(err);
    }
  },
};
