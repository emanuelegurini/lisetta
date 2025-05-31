import { useEffect, useState } from "react";
import { Outlet } from "react-router"
import { supabase } from "@/App";
import type { Session } from "@supabase/supabase-js";
import LoginPage from "@/pages/Login";

const PrivateRoute = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (!session) {
    return (
      <LoginPage />
    );
  }

  return <Outlet />;
};

export default PrivateRoute;
