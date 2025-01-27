export interface Product {
    available: number;
    id: string;
    product_name: string;
    category: string;
    price: string;
    image_url: string;
    description: string
  }

  export interface Products {
    id: string;
    product_name: string;
    price: string;
    image_url: string;
  }


  
  export interface CategoryProducts {
    category: string;
    product: {
      id: string;
      product_name: string;
      category: string;
      price: string;
      description: string;
      image_url: string;
    }[];
  }
  