import * as adminService from "../services/adminService.js";

export const dashboard =
  async (req, res, next) => {
    try {
      const stats =
        await adminService.getDashboard();

      return res.status(200).json({
        success: true,
        stats,
      });
    } catch (error) {
      next(error);
    }
  };

export const getUsers =
  async (req, res, next) => {
    try {
      const result =
        await adminService.getUsers({
          page:
            Number(req.query.page) ||
            1,
          limit:
            Number(
              req.query.limit
            ) || 10,
          search:
            req.query.search,
          role:
            req.query.role,
          status:
            req.query.status,
        });

      return res.status(200).json({
        success: true,
        users: result.users,
        pagination:
          result.pagination,
      });
    } catch (error) {
      next(error);
    }
  };

export const blockUser =
  async (req, res, next) => {
    try {
      await adminService.blockUser(
        req.params.id
      );

      return res.status(200).json({
        success: true,
        message:
          "User Blocked",
      });
    } catch (error) {
      next(error);
    }
  };

export const unblockUser =
  async (req, res, next) => {
    try {
      await adminService.unblockUser(
        req.params.id
      );

      return res.status(200).json({
        success: true,
        message:
          "User Unblocked",
      });
    } catch (error) {
      next(error);
    }
  };

export const getVendors =
  async (req, res, next) => {
    try {
      const vendors =
        await adminService.getVendors(
          req.query.search
        );

      return res.status(200).json({
        success: true,
        vendors,
      });
    } catch (error) {
      next(error);
    }
  };

export const blockVendor =
  async (req, res, next) => {
    try {
      await adminService.blockVendor(
        req.params.id
      );

      return res.status(200).json({
        success: true,
        message:
          "Vendor Blocked",
      });
    } catch (error) {
      next(error);
    }
  };

export const unblockVendor =
  async (req, res, next) => {
    try {
      await adminService.unblockVendor(
        req.params.id
      );

      return res.status(200).json({
        success: true,
        message:
          "Vendor Unblocked",
      });
    } catch (error) {
      next(error);
    }
  };

export const getOrders =
  async (req, res, next) => {
    try {
      const result =
        await adminService.getOrders({
          page:
            Number(req.query.page) ||
            1,
          limit:
            Number(
              req.query.limit
            ) || 10,
          search:
            req.query.search,
          status:
            req.query.status,
        });

      return res.status(200).json({
        success: true,
        orders:
          result.orders,
        pagination:
          result.pagination,
      });
    } catch (error) {
      next(error);
    }
  };