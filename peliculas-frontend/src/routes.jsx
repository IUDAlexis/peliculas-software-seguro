import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout y Home
import Layout from "./app/shared/components/Layout";
import Home from "./app/shared/components/Home";

// Módulos
import GeneroList from "./app/modules/genero/pages/GeneroList";
import GeneroForm from "./app/modules/genero/pages/GeneroForm";
import DirectorList from "./app/modules/director/pages/DirectorList";
import DirectorForm from "./app/modules/director/pages/DirectorForm";
import ProductoraList from "./app/modules/productora/pages/ProductoraList";
import ProductoraForm from "./app/modules/productora/pages/ProductoraForm";
import TipoList from "./app/modules/tipo/pages/TipoList";
import TipoForm from "./app/modules/tipo/pages/TipoForm";
import MediaList from "./app/modules/media/pages/MediaList";
import MediaForm from "./app/modules/media/pages/MediaForm";

export default function AppRoutes() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Géneros */}
          <Route path="/generos" element={<GeneroList />} />
          <Route path="/generos/nuevo" element={<GeneroForm />} />

          {/* Directores */}
          <Route path="/directores" element={<DirectorList />} />
          <Route path="/directores/nuevo" element={<DirectorForm />} />

          {/* Productoras */}
          <Route path="/productoras" element={<ProductoraList />} />
          <Route path="/productoras/nuevo" element={<ProductoraForm />} />

          {/* Tipos */}
          <Route path="/tipos" element={<TipoList />} />
          <Route path="/tipos/nuevo" element={<TipoForm />} />

          {/* Media */}
          <Route path="/media" element={<MediaList />} />
          <Route path="/media/nuevo" element={<MediaForm />} />
        </Routes>
      </Layout>
    </Router>
  );
}
