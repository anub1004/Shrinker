import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { HomePage } from '../pages/HomePage';

export const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Layout><HomePage /></Layout>} path="/" />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};
