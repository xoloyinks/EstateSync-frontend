import { IconType } from "react-icons";

export type userType =  {
  id?: string,
  _id?: string,
  first_name: string,
  last_name: string,
  email: string,
  phone_number: string,
  role?: string,
  image: string,
  createdAt?: string,
  updatedAt?: string,
  gender?: string
}

export interface PropertyType {
  id: string; 
  images: string[]; 
  location: string;
  agent: userType;
  title: string;
  bedrooms: string;
  price: string;
  description: string;
  mode: string; 
  acquired?: userType,
  planCode?: string, // Optional field for plan code
}

export type Navs = {
    id: number,
    name: string,
    ref: string,
    icon: IconType
}

export type agentType = {
    _id: string;
    user: userType,
    assignedProperties: PropertyType[],
    __v: number
}

export type tenantsType = {
  _id: string;
  user: userType,
  acquiredProperty:PropertyType;
  status: string;
  __v: number;
};

export type issuesType = {
  _id: string,
  user: userType,
  property: PropertyType,
  category: string,
  issue:string,
  description: string,
  agent: string,
  createdAt: Date,
  __v: number,
  status: string
}

export type ApplicationsType = {
  id: string,
  user: userType,
  property: PropertyType,
  proof: string,
  status: string,
  code: string,
  createdAt: Date
}

export type PaymentType = {
  plan_code: string,
  user: userType,
  subscription_code: string,
  customer_code: string,
  amount: number,
  paid_at: Date,
  next_payment_date: Date,
  created_at: Date,
  reference: string,
  method: string,
  status: string
}