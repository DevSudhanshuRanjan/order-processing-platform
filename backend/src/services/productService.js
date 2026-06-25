import Product from "../models/Product.js";

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
  const { search, category, sort, page = 1, limit = 8 } = queryParams;

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

  const limitNum = Number(limit);
  const pageNum = Number(page);

  const products = await Product.find(query)
    .select("name price category images stock status")
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
    .select("name description price category images stock")
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
    .select("name price stock status")
    .populate("vendorId");
};
