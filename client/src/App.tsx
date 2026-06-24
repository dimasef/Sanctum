import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import HomePage from './pages/HomePage.tsx';
import BookDetailsPage from './pages/BookDetailsPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import ShelfPage from './pages/ShelfPage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import CollectionsPage from './pages/CollectionsPage.tsx';
import CollectionDetailPage from './pages/CollectionDetailPage.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="book/:id" element={<BookDetailsPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="shelf" element={<ShelfPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="collections" element={<CollectionsPage />} />
            <Route path="collections/:id" element={<CollectionDetailPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
