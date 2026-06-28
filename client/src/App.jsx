import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Books from './pages/Books.jsx'
import BooksDetails from './pages/BooksDetails.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Profile from './pages/Profile.jsx'
import AddBook from './pages/AddBook.jsx'
import EditBook from './pages/EditBook.jsx'
import Wishlist from './pages/Wishlist.jsx'
import Cart from './pages/Cart.jsx'
import ChangePassword from './pages/ChangePassword.jsx'
import Navbar from './components/Navbar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/books" element={<ProtectedRoute><Books /></ProtectedRoute>} />
        <Route path="/books/:id" element={<ProtectedRoute><BooksDetails /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
        <Route path="/add-book" element={<ProtectedRoute requireAdmin={true}><AddBook /></ProtectedRoute>} />
        <Route path="/edit-book/:id" element={<ProtectedRoute requireAdmin={true}><EditBook /></ProtectedRoute>} />
      </Routes>
    </CartProvider>
  )
}

export default App;