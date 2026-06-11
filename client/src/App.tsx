import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import HomePage from './pages/HomePage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import ShelfPage from './pages/ShelfPage.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="shelf" element={<ShelfPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
