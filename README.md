# 💰 ExpenseFlow - Smart Expense & Budget Management Platform

A modern, production-ready full-stack web application for personal expense tracking and budget management. Built with a focus on excellent UI/UX, mobile-first design, and real-world usability.

![ExpenseFlow](https://via.placeholder.com/800x400/0f0f23/8B5CF6?text=ExpenseFlow)

## ✨ Features

### Core Functionality
- **Expense Tracking** - Add, edit, and delete expenses with categories
- **Budget Management** - Set monthly budgets per category with alerts
- **Analytics Dashboard** - Visualize spending with charts and insights
- **Smart Filters** - Search and filter expenses by date, category, amount

### User Experience
- 🌙 **Dark Mode First** - Premium dark theme with glassmorphism effects
- 📱 **Mobile-First Design** - Excellent experience on all devices
- ⚡ **Smooth Animations** - Micro-interactions and transitions
- 🔔 **Smart Notifications** - Toast alerts for actions and budget warnings
- 📊 **Interactive Charts** - Animated charts with Recharts

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcrypt
- **Validation**: express-validator

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Routing**: React Router v6

## 📁 Project Structure

```
expense-tracker/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Authentication logic
│   │   ├── expenseController.js
│   │   └── budgetController.js
│   ├── middleware/
│   │   ├── auth.js             # JWT verification
│   │   ├── validate.js         # Request validation
│   │   └── errorHandler.js     # Error handling
│   ├── models/
│   │   ├── User.js
│   │   ├── Expense.js
│   │   └── Budget.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── expenses.js
│   │   └── budgets.js
│   ├── utils/
│   │   └── helpers.js
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Reusable UI components
│   │   │   ├── layout/         # Layout components
│   │   │   ├── dashboard/      # Dashboard widgets
│   │   │   ├── expenses/       # Expense components
│   │   │   └── budget/         # Budget components
│   │   ├── context/            # React Context providers
│   │   ├── hooks/              # Custom hooks
│   │   ├── pages/              # Page components
│   │   ├── services/           # API services
│   │   ├── utils/              # Utilities & constants
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB running locally or a MongoDB Atlas account

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd expense-tracker/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your settings:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/expense-tracker
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=30d
   CLIENT_URL=http://localhost:5173
   ```

4. Start the server:
   ```bash
   # Development mode with hot reload
   npm run dev
   
   # Production mode
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd expense-tracker/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |
| PUT | `/api/auth/password` | Change password |

### Expenses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/expenses` | Get all expenses (with filters) |
| POST | `/api/expenses` | Create expense |
| PUT | `/api/expenses/:id` | Update expense |
| DELETE | `/api/expenses/:id` | Delete expense |
| GET | `/api/expenses/stats` | Get expense statistics |

### Budgets
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/budgets` | Get budgets for month |
| GET | `/api/budgets/status` | Get budget status with spending |
| POST | `/api/budgets` | Create/update budget |
| DELETE | `/api/budgets/:id` | Delete budget |
| POST | `/api/budgets/copy` | Copy from previous month |

## 🎨 UI/UX Design Decisions

### Visual Design
- **Dark Mode First**: Premium feel with sophisticated dark color palette
- **Glassmorphism**: Subtle blur effects and transparency for depth
- **Gradient Accents**: Vibrant purple-cyan gradients for visual interest
- **Generous Whitespace**: Clean, uncluttered layouts

### Color Palette
```
Primary:     #8B5CF6 (Purple)
Secondary:   #06B6D4 (Cyan)
Background:  #0F0F23 (Deep Navy)
Surface:     #1A1A2E (Dark Surface)
```

### Animations
- Page transitions with fade/slide effects
- Skeleton loaders for async content
- Hover effects with scale/shadow changes
- Charts with entry animations
- Toast notifications with slide-in animation

### Mobile-First
- Bottom navigation on mobile
- Touch-friendly tap targets (min 44px)
- Responsive grid layouts
- Collapsible sidebar on tablet+

## 📝 Available Scripts

### Backend
```bash
npm start      # Start production server
npm run dev    # Start development server with nodemon
```

### Frontend
```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run preview # Preview production build
```

## 🔒 Environment Variables

### Backend (.env)
| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/expense-tracker |
| JWT_SECRET | JWT signing secret | - |
| JWT_EXPIRE | Token expiration | 30d |
| CLIENT_URL | Frontend URL for CORS | http://localhost:5173 |

### Frontend (.env)
| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | http://localhost:5000/api |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ using React, Node.js, and MongoDB
