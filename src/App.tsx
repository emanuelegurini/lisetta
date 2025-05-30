import './App.css'
import { createClient } from "@supabase/supabase-js";
import { BrowserRouter, Routes } from 'react-router';
import { createRoutes } from './routes/routes';

// TODO: creare un layer a parte
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL 
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

export const supabase =  createClient(supabaseUrl, supabaseKey)

function App() {

  const routesList = createRoutes()

  return (
    <BrowserRouter>
      <Routes>
        {routesList.routes.map(({ component }) => component())}
      </Routes>
    </BrowserRouter>
  );
}

export default App
