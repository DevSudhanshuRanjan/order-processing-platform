import API from './api';

const MOCK_PRODUCTS = [
  {
    _id: "p1",
    name: "Classic Cheeseburger",
    description: "Juicy beef patty with melted cheese, lettuce, and our special sauce.",
    price: 199,
    category: "Burger",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    stock: 20,
    vendorId: "v1"
  },
  {
    _id: "p2",
    name: "Margherita Pizza",
    description: "Classic pizza with fresh mozzarella, tomatoes, and basil.",
    price: 349,
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80",
    stock: 15,
    vendorId: "v1"
  },
  {
    _id: "p3",
    name: "Cold Coffee",
    description: "Refreshing cold coffee blended to perfection.",
    price: 149,
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80",
    stock: 50,
    vendorId: "v2"
  },
  {
    _id: "p4",
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with a gooey molten center.",
    price: 249,
    category: "Dessert",
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=800&q=80",
    stock: 10,
    vendorId: "v2"
  },
  {
    _id: "p5",
    name: "Hakka Noodles",
    description: "Wok-tossed noodles with fresh vegetables and soy sauce.",
    price: 229,
    category: "Chinese",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80",
    stock: 25,
    vendorId: "v1"
  },
  {
    _id: "p6",
    name: "Spicy Chicken Wings",
    description: "Crispy wings tossed in our signature spicy buffalo sauce.",
    price: 299,
    category: "Burger", // Keeping simple categories
    image: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=800&q=80",
    stock: 30,
    vendorId: "v2"
  }
];

export const getProducts = async (params = {}) => {
  try {
    const response = await API.get('/products', { params });
    return response.data;
  } catch (error) {
    if (!error.response) {
      // Mock fallback
      let filtered = [...MOCK_PRODUCTS];
      if (params.category && params.category !== 'All') {
        filtered = filtered.filter(p => p.category === params.category);
      }
      if (params.search) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(params.search.toLowerCase()));
      }
      return { success: true, products: filtered, page: 1, totalPages: 1, totalProducts: filtered.length };
    }
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await API.get(`/products/${id}`);
    return response.data.product || response.data;
  } catch (error) {
    if (!error.response) {
      const product = MOCK_PRODUCTS.find(p => p._id === id);
      if (product) return product;
    }
    throw error;
  }
};
