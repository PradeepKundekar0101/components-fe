export type mockProductsType = {
  productName: string,
  price: number,
  quantity: number,
  isAvailable: boolean,
  url: string,
  company_logo: string,
  product_image_url: string
}

export const mockProducts: mockProductsType[] = [
  {
    productName: "iPhone 14 Pro Max",
    price: 999.99,
    quantity: 60,
    isAvailable: true,
    url: "iphone-14-pro",
    company_logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    product_image_url: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5"
  },
  {
    productName: "Samsung Galaxy S23",
    price: 799.99,
    quantity: 220,
    isAvailable: true,
    url: "samsung-s23",
    company_logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
    product_image_url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf"
  },
  {
    productName: "Google Pixel 7",
    price: 699.99,
    quantity: 340,
    isAvailable: true,
    url: "pixel-7",
    company_logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    product_image_url: "https://images.unsplash.com/photo-1598327105666-5b89351aff97"
  }
];