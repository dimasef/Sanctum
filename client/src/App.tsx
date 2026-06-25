import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import HomePage from './pages/HomePage.tsx';
import BookDetailsPage from './pages/BookDetailsPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import AllBooksPage from './pages/AllBooksPage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import ShelvesPage from './pages/ShelvesPage.tsx';
import ShelfDetailPage from './pages/ShelfDetailPage.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="book/:id" element={<BookDetailsPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="reading" element={<AllBooksPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="shelves" element={<ShelvesPage />} />
            <Route path="shelves/:id" element={<ShelfDetailPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
