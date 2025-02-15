import MainLayout from "../layouts/MainLayout";
import UserLayout from "../layouts/UserLayout";


import CartPage from "../pages/CartPage/CartPage";
import CheckoutPage from "../pages/CheckoutPage/CheckoutPage";
import ContactPage from "../pages/ContactPage";
import FashionCollectionPage from "../pages/FashionCollectionPage/FashionCollectionPage";
import HomePage from "../pages/HomePage/HomePage";
import NewArrivalsPage from "../pages/NewArrivalsPage/NewArrivalsPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import ProductDetailPage from "../pages/ProductDetailPage/ProductDetailPage";
import ProductPage from "../pages/ProductPage/ProductsPage";

import SignInPage from "../pages/SignInPage/SignInPage";
import { SignUpPage } from "../pages/SignUpPage/SignUpPage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import PasswordPage from "../pages/PasswordPage/PasswordPage";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboardPage from "../pages/Admin/AdminDashboardPage";
import AdminProductPage from "../pages/Admin/AdminProductPage";
import AdminOrdersPage from "../pages/Admin/AdminOrdersPage";
import AdminUsersPage from "../pages/Admin/AdminUsersPage";
import AdminCategoriesPage from "../pages/Admin/AdminCategoriesPage";
import UserOrdersPage from "../pages/UserOrdersPage/UserOrdersPage";
import OrderTrackingPage from "../pages/OrderTrackingPage/OrderTrackingPage";
import UserVouchersPage from "../pages/UserVouchersPage/UserVouchersPage";
import NotificationPage from "../pages/NotificationPage/NotificationPage";

const routes = [
  {
    path: "/",
    page: HomePage,
    layout: MainLayout,
  },
  {
    path: "/contact",
    page: ContactPage,
    layout: MainLayout,
  },
  {
    path: "*",
    page: NotFoundPage,
   
  },
  {
    path: "/new-arrivals",
    page: NewArrivalsPage,
 
  },
  {
    path: "/products",
    page: ProductPage,
   
  },
  {
    path: "/collection",
    page: FashionCollectionPage,
   
  },
  {
    path: "/cart",
    page: CartPage,
    layout: MainLayout,
  
  },
  {
    path: "/checkout",
    page: CheckoutPage,
  
  },
  {
    path: "/user",
    layout: UserLayout, // Sử dụng layout riêng cho User
    
    children: [
      
      {
        path: "account/profile",
        page: ProfilePage,
      },
      {
        path: "account/password",
        page: PasswordPage,
      },
      {
        path:"orders",
        page: UserOrdersPage,
      },
      {
        path: "order-tracking",
        page: OrderTrackingPage,
      },
      {
        path: "my-vouchers",
        page: UserVouchersPage,
      },
      {
        path: "notification",
        page: NotificationPage,
      }
    
    ],
  },

  {
    path: "/product-detail",
    page: ProductDetailPage,
 
  },
  {
    path: "/sign-in",
    page: SignInPage,
   
  },
  {
    path: "/sign-up",
    page: SignUpPage,
    
  },
  {
    path: "/admin",
    layout: AdminLayout,
    children: [
      {
        path: "",  // Dashboard page - default route
        page: AdminDashboardPage,
      },
      {
        path: "products",
        page: AdminProductPage,
      },
      {
        path: "orders",
        page: AdminOrdersPage
      },
      {
        path: "users",
        page: AdminUsersPage,
      },
      {
        path: "categories",
        page: AdminCategoriesPage,
      }
    ]
  }
  
  
 
];
export default routes;
