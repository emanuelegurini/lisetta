import './App.css'
import { createClient } from "@supabase/supabase-js";
import { BrowserRouter, Navigate, Routes, Route} from 'react-router';
import PrivateRoute from './components/PrivateRoute';
import { authRoutes } from './pages/routes';

// TODO: creare un layer a parte
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL 
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

export const supabase =  createClient(supabaseUrl, supabaseKey)

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* Route pubbliche */}

        {/* Route autenticate */}
        <Route element={<PrivateRoute />}>
          {authRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
