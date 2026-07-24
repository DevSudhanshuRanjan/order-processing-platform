import * as vendorService from "../services/vendorService.js";

export const getDashboard =
  async (req, res, next) => {
    try {
      const stats =
        await vendorService.getDashboard(
          req.user.id
        );

      return res.status(200).json({
        success: true,
        stats,
      });
    } catch (error) {
      next(error);
    }
  };

export const getAnalytics =
  async (req, res, next) => {
    try {
      const analytics =
        await vendorService.getAnalytics(
          req.user.id
        );

      return res.status(200).json({
        success: true,
        revenue:
          analytics.revenue,
        orders:
          analytics.orders,
        sold:
          analytics.sold,
        pending:
          analytics.pending,
      });
    } catch (error) {
      next(error);
    }
  };

export const getVendorsWithTopProduct =
  async (req, res, next) => {
    try {
      const vendors =
        await vendorService.getAllVendorsWithTopProduct();

      return res.status(200).json({
        success: true,
        vendors,
      });
    } catch (error) {
      next(error);
    }
  };
