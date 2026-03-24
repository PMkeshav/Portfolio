import { Route, Routes } from "react-router-dom";
import ScrollManager from "./components/ScrollManager.jsx";
import SiteLayout from "./layouts/SiteLayout.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProjectDetailPage from "./pages/ProjectDetailPage.jsx";
import WorkPage from "./pages/WorkPage.jsx";

export default function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/work/:slug" element={<ProjectDetailPage />} />
        </Route>
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </>
  );
}
