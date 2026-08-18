import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { DataProvider } from './data/DataContext'
import { AdminOnlyRoute } from './components/AdminOnlyRoute'
import { Header } from './components/Header'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ScrollToTop } from './components/ScrollToTop'
import { HomePage } from './pages/HomePage'
import { CategoryPage } from './pages/CategoryPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { SearchPage } from './pages/SearchPage'
import { LoginPage } from './pages/LoginPage'
import { AddHubPage } from './pages/add/AddHubPage'
import { AddCategoryPage } from './pages/add/AddCategoryPage'
import { AddServicePage } from './pages/add/AddServicePage'
import { AddCompanyPage } from './pages/add/AddCompanyPage'

function AppShell() {
  return (
    <div className="app-shell">
      <ScrollToTop />
      <Header />
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route
            path="/add"
            element={
              <AdminOnlyRoute>
                <AddHubPage />
              </AdminOnlyRoute>
            }
          />
          <Route
            path="/add/category"
            element={
              <AdminOnlyRoute>
                <AddCategoryPage />
              </AdminOnlyRoute>
            }
          />
          <Route
            path="/add/service"
            element={
              <AdminOnlyRoute>
                <AddServicePage />
              </AdminOnlyRoute>
            }
          />
          <Route
            path="/add/company"
            element={
              <AdminOnlyRoute>
                <AddCompanyPage />
              </AdminOnlyRoute>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/*" element={<AppShell />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  )
}
