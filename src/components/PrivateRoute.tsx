import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 


export const PrivateRoute = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading session...</div>; 
  }

  return currentUser ? <Outlet /> : <Navigate to="/signin" replace />;
};

export const SellerPrivateRoute = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading session...</div>; 
  }

  return currentUser ? <Outlet /> : <Navigate to="/sellerlogin" replace />;
};