# Hoang Nam Clothing -  Fashion & Accessories Website

## Introduction
The Fashion & Accessories Website is a modern e-commerce platform designed for users to browse, search, and purchase stylish clothing and accessories. The website provides a seamless and visually appealing shopping experience, incorporating responsive design, fast loading speeds, and intuitive navigation. Built using cutting-edge technologies, the platform ensures scalability, maintainability, and high performance for both end-users and administrators.

---

## Features
- **User-friendly Interface**: Clean, intuitive design optimized for both desktop and mobile users.
- **Product Management**: Add, edit, and delete products, including images, sizes, and colors.
- **Shopping Cart & Checkout**: Smooth shopping cart integration with secure payment options.
- **Responsive Design**: Fully optimized for all screen sizes, from mobile to desktop.
- **Search & Filtering**: Advanced search and filtering options to quickly find the desired products.
- **User Authentication**: Secure sign-up, login, and user profile management.
- **Admin Panel**: Manage products, orders, and customer data efficiently.

---

## Technologies Used

### **Frontend**
- **[Vite](https://vitejs.dev/)**: Fast and lightweight development server with instant hot module replacement.
- **[React](https://reactjs.org/)**: A JavaScript library for building user interfaces.
- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework for creating modern, responsive designs.
- **[Redux](https://redux.js.org/)**: State management library for managing global state across the application.

### **Backend**
- **[Node.js](https://nodejs.org/)**: JavaScript runtime environment for building scalable backend services.
- **[Express.js](https://expressjs.com/)**: Web framework for building RESTful APIs and backend logic.

### **Database**
- **[MongoDB](https://www.mongodb.com/)**: NoSQL database for managing and storing product, user, and order data.

---

## Installation & Setup

### Prerequisites
- Node.js (version 14 or later)
- MongoDB Atlas or local MongoDB instance

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/fashion-accessories-website.git
   cd fashion-accessories-website/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in a `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   ACCESS_TOKEN=your_access_token_secret
   REFRESH_TOKEN=your_refresh_token_secret
   ACCESS_TOKEN_LIFE=1d
   REFRESH_TOKEN_LIFE=365d
   ```
4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Access the Website
- Open your browser and visit: `http://localhost:5173`
- The backend server will run on: `http://localhost:5000`

---

## Folder Structure
```
root
├── backend
│   ├── models         # Mongoose schemas for database
│   ├── routes         # Express API routes
│   ├── controllers    # Request handlers for routes
│   ├── services       # Business logic and database queries
│   ├── app.js         # Entry point for backend
│   └── .env           # Environment variables
├── frontend
│   ├── src
│   │   ├── components # React components
│   │   ├── pages      # Application pages (Home, Product, Cart, etc.)
│   │   ├── redux      # Redux setup for state management
│   │   ├── styles     # Tailwind CSS configurations
│   │   └── App.jsx    # Main React application file
│   └── vite.config.js # Vite configuration
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: User login

### Products
- `GET /api/products`: Fetch all products
- `POST /api/products`: Add a new product (admin only)
- `PUT /api/products/:id`: Update a product (admin only)
- `DELETE /api/products/:id`: Delete a product (admin only)

### Orders
- `GET /api/orders`: Fetch all orders (admin only)
- `POST /api/orders`: Place a new order

---

## Contributors
- **Your Name**: Full-stack Developer
- **Contributor Name**: Frontend Developer
- **Contributor Name**: Backend Developer

---

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Screenshots
Add screenshots of your website here to showcase its design and features.

---

## Future Enhancements
- Integration with third-party payment gateways.
- Add user reviews and ratings for products.
- Implement real-time notifications for orders.
- Add AI-based product recommendations.

---

Feel free to contribute or provide feedback to improve the website!

