// Danh mục + slug ứng với thư mục trong /public/images/menu/<slug>/
export const CATEGORIES = [
  { label: "Tin Box Cake", slug: "tin-box-cake" },
  { label: "Birthday Cake", slug: "birthday-cake" },
  { label: "Mousse", slug: "mousse" },
  { label: "Cream Choux", slug: "cream-choux" },
  { label: "Cupcake", slug: "cup-cake" },
];

// Sinh 4 item mẫu cho mỗi danh mục, trỏ tới ảnh theo pattern đã đặt tên
export const MENU_SECTIONS = [
  // --- Tin Box Cake ---
  {
    category: "Tin box cake",
    slug: "tin-box-cake",
    items: [
      {
        id: "tin-box-cake_1",
        name: "Oolong Longan Cake",
        image: "/images/menu/tin-box-cake/tin-box-cake_1.png",
        price: 229000,
      },
      {
        id: "tin-box-cake_2",
        name: "Matcha Green Tea Cake",
        image: "/images/menu/tin-box-cake/tin-box-cake_2.png",
        price: 249000,
      },
      {
        id: "tin-box-cake_3",
        name: "Strawberry Cream Cake",
        image: "/images/menu/tin-box-cake/tin-box-cake_3.png",
        price: 239000,
      },
      {
        id: "tin-box-cake_4",
        name: "Chocolate Almond Cake",
        image: "/images/menu/tin-box-cake/tin-box-cake_4.png",
        price: 259000,
      },
    ],
  },

  // --- Birthday Cake ---
  {
    category: "Birthday cake",
    slug: "birthday-cake",
    items: [
      {
        id: "birthday-cake_1",
        name: "Red Velvet Celebration Cake",
        image: "/images/menu/birthday-cake/birthday-cake_1.png",
        price: 320000,
      },
      {
        id: "birthday-cake_2",
        name: "Vanilla Blossom Cake",
        image: "/images/menu/birthday-cake/birthday-cake_2.png",
        price: 310000,
      },
      {
        id: "birthday-cake_3",
        name: "Chocolate Fudge Cake",
        image: "/images/menu/birthday-cake/birthday-cake_3.png",
        price: 355000,
      },
      {
        id: "birthday-cake_4",
        name: "Caramel Crunch Cake",
        image: "/images/menu/birthday-cake/birthday-cake_4.png",
        price: 340000,
      },
    ],
  },

  // --- Mousse ---
  {
    category: "Mousse",
    slug: "mousse",
    items: [
      {
        id: "mousse_1",
        name: "Berry Lover Mousse",
        image: "/images/menu/mousse/mousse_1.png",
        price: 220000,
      },
      {
        id: "mousse_2",
        name: "Chocolate Truffle Mousse",
        image: "/images/menu/mousse/mousse_2.png",
        price: 235000,
      },
      {
        id: "mousse_3",
        name: "Mango Passion Mousse",
        image: "/images/menu/mousse/mousse_3.png",
        price: 245000,
      },
      {
        id: "mousse_4",
        name: "Matcha Cheese Mousse",
        image: "/images/menu/mousse/mousse_4.png",
        price: 255000,
      },
    ],
  },

  // --- Cream Choux ---
  {
    category: "Cream choux",
    slug: "cream-choux",
    items: [
      {
        id: "cream-choux_1",
        name: "Classic Vanilla Choux",
        image: "/images/menu/cream-choux/cream-choux_1.png",
        price: 150000,
      },
      {
        id: "cream-choux_2",
        name: "Chocolate Custard Choux",
        image: "/images/menu/cream-choux/cream-choux_2.png",
        price: 159000,
      },
      {
        id: "cream-choux_3",
        name: "Strawberry Delight Choux",
        image: "/images/menu/cream-choux/cream-choux_3.png",
        price: 165000,
      },
      {
        id: "cream-choux_4",
        name: "Caramel Hazelnut Choux",
        image: "/images/menu/cream-choux/cream-choux_4.png",
        price: 175000,
      },
    ],
  },

  // --- Cupcake ---
  {
    category: "Cupcake",
    slug: "cup-cake",
    items: [
      {
        id: "cup-cake_1",
        name: "Chocolate Chip Cupcake",
        image: "/images/menu/cup-cake/cup-cake_1.png",
        price: 95000,
      },
      {
        id: "cup-cake_2",
        name: "Strawberry Swirl Cupcake",
        image: "/images/menu/cup-cake/cup-cake_2.png",
        price: 99000,
      },
      {
        id: "cup-cake_3",
        name: "Vanilla Butter Cupcake",
        image: "/images/menu/cup-cake/cup-cake_3.png",
        price: 105000,
      },
      {
        id: "cup-cake_4",
        name: "Blueberry Dream Cupcake",
        image: "/images/menu/cup-cake/cup-cake_4.png",
        price: 115000,
      },
    ],
  },
];

