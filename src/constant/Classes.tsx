export interface ProductImage {
    id: number;
    url: string;
}

export interface Product {
    id: number;
    name: string;
    isNew: boolean | null;
    isBestSeller: boolean | null;
    description: string;
    priceAfterDiscount: number | null;
    price: number;
    quantityInStock: number;
    size: number;
    postedDate: string;
    imageUrls: ProductImage[];
    category: string;
}

export interface Order {
    id: number;
    totalAmount: number;
    adresse: string;
    paymentMethod: string;
    status: string;
    creationDate: number;
    shippingDate: number;
    userFullName: string;
}

export interface StockAction {
    id: number;
    productId: number;  // Only store product ID here
    quantityBeforeAction: number;
    quantity: number;
    type: string;
    lastUpdated: string;
    status: string;
    requestedBy: string;
    approvedBy: string | null;
}