import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Background from './pages/Background';
import Books from './pages/Books';
import StudyPlans from './pages/StudyPlans';

export default function App() {
  return (
    <BrowserRouter basename="/personal_website">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Background />} />
          <Route path="journey" element={<Navigate to="/study-plans" replace />} />
          <Route path="books" element={<Books />} />
          <Route path="reading-list" element={<Books />} />
          <Route path="study-plans" element={<StudyPlans />} />
        </Route>
        <Route path="study-plans/:planId" element={<StudyPlans />} />
      </Routes>
    </BrowserRouter>
  );
}
