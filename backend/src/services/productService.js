import Product from "../models/Product.js";
import User from "../models/User.js";

const buildSort = (sort) => {
  switch (sort) {
    case "price_asc":
      return { price: 1 };

    case "price_desc":
      return { price: -1 };

    case "a_z":
      return { name: 1 };

    case "z_a":
      return { name: -1 };

    case "newest":
    default:
      return { createdAt: -1 };
  }
};

export const getAllProducts = async (queryParams) => {
  const { search, category, sort, page = 1, limit = 8, vendorId } = queryParams;

  const query = {
    status: "active",
  };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
    ];
  }

  if (category) {
    query.category = category;
  }

  if (vendorId) {
    query.vendorId = vendorId;
  }

  const limitNum = Number(limit);
  const pageNum = Number(page);

  const products = await Product.find(query)
    .select("name price category image stock status averageRating numberOfRatings")
    .populate("vendorId")
    .sort(buildSort(sort))
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum);

  const totalProducts = await Product.countDocuments(query);

  return {
    success: true,
    products,
    data: products,
    page: pageNum,
    totalPages: Math.ceil(totalProducts / limitNum),
    totalProducts,
    total: totalProducts,
  };
};

export const getProduct = async (id) => {
  return Product.findById(id)
    .select("name description price category image stock averageRating numberOfRatings ratings")
    .populate("vendorId");
};

export const create = async (data, vendorId) => {
  return Product.create({
    ...data,
    vendorId,
  });
};

export const update = async (id, data, vendorId) => {
  return Product.findOneAndUpdate(
    {
      _id: id,
      vendorId,
    },
    data,
    {
      new: true,
    },
  );
};

export const remove = async (id, vendorId) => {
  return Product.findOneAndUpdate(
    {
      _id: id,
      vendorId,
    },
    {
      status: "inactive",
    },
    {
      new: true,
    },
  );
};

export const getVendorProducts = async (vendorId) => {
  return Product.find({
    vendorId,
  })
    .select("name price stock status image averageRating numberOfRatings")
    .populate("vendorId");
};

export const rateProduct = async (productId, userId, rating, userName, comment = "") => {
  const product = await Product.findById(productId);
  if (!product) {
    return null;
  }

  // Check if user already rated, update their rating
  const existingIndex = product.ratings.findIndex(
    (r) => r.userId.toString() === userId
  );

  if (existingIndex >= 0) {
    product.ratings[existingIndex].rating = rating;
    product.ratings[existingIndex].comment = comment;
    product.ratings[existingIndex].userName = userName;
  } else {
    product.ratings.push({
      userId,
      userName,
      rating,
      comment,
    });
  }

  // Recalculate average
  const total = product.ratings.reduce((sum, r) => sum + r.rating, 0);
  product.averageRating = Math.round((total / product.ratings.length) * 10) / 10;
  product.numberOfRatings = product.ratings.length;

  return product.save();
};

export const getTopRatedProducts = async (limit = 3) => {
  return Product.find({ status: "active" })
    .sort({ averageRating: -1, numberOfRatings: -1 })
    .limit(limit)
    .select("name price image stock averageRating numberOfRatings vendorId")
    .populate("vendorId", "name");
};