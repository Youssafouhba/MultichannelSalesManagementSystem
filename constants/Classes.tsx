export interface UserDTO {
  fullName: string,
  email: string,
  phoneNumber: string,
  dateOfCreation: string | Date,
  tradeCustomer: boolean
};
export const OPTIONS = ["Sole Trader", "Partnership", "Limited Company", "Other"];
export  const inputFields = [
  { name: "companyName", label: "Company Name (if applicable)", required: false },
  { name: "contactPerson", label: "Contact Person", required: true },
  { name: "businessAddress", label: "Business Address", required: true },
  { name: "country", label: "Country", required: true },
  { name: "city", label: "City", required: true },
  { name: "postalCode", label: "Postal Code", required: true },
  { name: "website", label: "Website (if applicable)", required: false },
];
export const isValidEmail = (email: string) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
  return emailRegex.test(email);
};
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  const phoneRegex = /^(\+)?[0-9]+$/;
  return phoneRegex.test(phoneNumber);
};
export const hearAboutUsSuggestions = [
  "Search Engine",
  "Social Media",
  "Word of Mouth",
  "Advertisement",
  "Trade Show",
  "Other"
];
export const productOptions = [
  { label: 'LED Ceiling Panel', value: 'LED Ceiling Panel' },
  { label: 'LED Strip Lighting', value: 'LED Strip Lighting' },
  { label: 'Led Profiles', value: 'Led Profiles' },
  { label: 'Suspended Ceiling & Metal Grid', value: 'Suspended Ceiling & Metal Grid' },
];
export interface Notification {
  id: number;
  title: string;
  message: string;
  postedDate: string;
  isRead: boolean
}
export interface Message {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: number; // timestamp en millisecondes
  read: boolean;
}
export interface Product {
    id: string;
    isNew: boolean;
    isBestSeller: boolean;
    name: string;
    description: string;
    price: number;
    priceAfterDiscount: number;
    quantityInStock: number;
    size: number;
    imageUrls: {id: string, url: string }[];
    category: string;
    postedDate: string;
}

export interface CommentItem {
  id: string;
  content: string;
  author: string;
  createdDate: Date;
  replies: CommentItem[];
  first: boolean;
  parentId?: string;
  rating: number
}

export interface Comment {
  id: string,
  content: string,
  first: boolean,
  rating: number
}

export interface Card {
  id: string;
  cartElements: CartElement[]
  total_amount: number
}

export interface CartElement {
  id: string;
  quantity: number;
  sub_total: number;
  product: Product;
}


export type OrderStatus = 'delivered' | 'Pending' | 'picked up' | 'cancelled';

export type paymentMethod = 'Card' | 'Cash';
export type OrderItem = {
  id: string;
  product: Product;
  quantity: number;
  sub_total: number;
};
export interface Order {
  id: string;
  creationDate: string;
  adresse: string;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: paymentMethod;
  shepingDate: Date;
  orderItems: OrderItem[]
};

export interface OrderNotif{
  order:Order;
  notification:Notification;
}

export interface ProductInfos {
  product: Product,
  comments: CommentItem[],
  raiting: number,
  saledQuantity: number,
}

export interface UserInfos {
  user: UserDTO,
  wishlist: Product[],
  shoppingList: CartElement[],
  myOrders: Order[],
  loginResponse: {message: string,token: string},
  myNotifications: Notification[]
}