import { supabase } from "@/App";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { cn } from "@/lib/utils";

function LoginPage() {
  return (
    <>
      <div className="md:hidden">
        <img
          src="/examples/authentication-light.png"
          width={1280}
          height={843}
          alt="Authentication"
          className="block dark:hidden w-full h-screen object-cover"
        />
        <img
          src="/examples/authentication-dark.png"
          width={1280}
          height={843}
          alt="Authentication"
          className="hidden dark:block w-full h-screen object-cover"
        />
      </div>
      <div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <img
            src="https://images.unsplash.com/photo-1508624217470-5ef0f947d8be?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Ocean"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            LISETTA
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg"></p>
              <footer className="text-sm"></footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                WELCOME TO LISETTA
              </h1>
              <p className="text-sm text-muted-foreground">
                Please enter your email and password to sign in to your account
              </p>
            </div>

            {/* Componente Auth di Supabase integrato */}
            <div className={cn("grid gap-6")}>
              <Auth
                supabaseClient={supabase}
                appearance={{
                  theme: ThemeSupa,
                  style: {
                    button: {
                      background: "hsl(var(--primary))",
                      color: "hsl(var(--primary-foreground))",
                      borderRadius: "calc(var(--radius) - 2px)",
                    },
                    input: {
                      borderRadius: "calc(var(--radius) - 2px)",
                      borderColor: "hsl(var(--border))",
                    },
                  },
                  variables: {
                    default: {
                      colors: {
                        brand: "hsl(var(--primary))",
                        brandAccent: "hsl(var(--primary))",
                      },
                    },
                  },
                }}
                providers={[]} 
                view="sign_in" 
                showLinks={true}
                localization={{
                  variables: {
                    sign_in: {
                      email_label: "Email",
                      password_label: "Password",
                      button_label: "Sign In with Email",
                      loading_button_label: "Signing in...",
                      link_text: "Don't have an account? Sign up",
                    },
                    sign_up: {
                      email_label: "Email",
                      password_label: "Password",
                      button_label: "Sign Up",
                      loading_button_label: "Signing up...",
                      link_text: "Already have an account? Sign in",
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage