import './App.css'
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { BrowserRouter, Routes } from 'react-router';
import { createAuthRoutes } from './routes/routes';

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

// TODO: creare un layer a parte
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL 
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

export const supabase =  createClient(supabaseUrl, supabaseKey)

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const authRoutesList = createAuthRoutes()

  if (!session) {
    return <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />;
  } else {
    return (
      <BrowserRouter>
        <Routes>
          {authRoutesList.routes.map(({ component }) => component())}
        </Routes>
      </BrowserRouter>
    );
  }

}

export default App
