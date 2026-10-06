import { useEffect } from 'react';
import { BrowserRouter, Navigate, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import { ThemeProvider } from './components/ThemeToggle';
import Background from './pages/Background';
import Books from './pages/Books';
import Blog from './pages/Blog';
import WealthLab from './pages/WealthLab';

function PageTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = pathname.startsWith('/blog') ? "Siyuan's blog"
      : pathname.startsWith('/wealth-lab') ? "Wealth Lab · Siyuan Song" : "Siyuan's Homepage";
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter basename="/siyuan_website">
        <PageTitle />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Background />} />
            <Route path="journey" element={<Navigate to="/blog" replace />} />
            <Route path="books" element={<Books />} />
            <Route path="reading-list" element={<Books />} />
            <Route path="wealth-lab" element={<WealthLab />} />
          </Route>
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:postId" element={<Blog />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
