import { BrowserRouter, Navigate, Routes, Route, useParams } from 'react-router-dom';
import Layout from './components/Layout';
import { ThemeProvider } from './components/ThemeToggle';
import Background from './pages/Background';
import Books from './pages/Books';
import StudyPlans from './pages/StudyPlans';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter basename="/personal_website">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Background />} />
            <Route path="journey" element={<Navigate to="/blog" replace />} />
            <Route path="books" element={<Books />} />
            <Route path="reading-list" element={<Books />} />
            <Route path="study-plans" element={<Navigate to="/blog" replace />} />
          </Route>
          <Route path="blog" element={<StudyPlans />} />
          <Route path="blog/:planId" element={<StudyPlans />} />
          <Route path="study-plans/:planId" element={<StudyPlansRedirect />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

function StudyPlansRedirect() {
  const { planId } = useParams();
  return <Navigate to={`/blog/${planId ?? ''}`} replace />;
}
