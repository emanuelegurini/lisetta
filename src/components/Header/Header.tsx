import { supabase } from "@/App";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const Header = () => {
  const [user, setUser] = useState< string | null>(null)
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user?.user_metadata?.username || null);
    };

    /* const updateUsername = async (newUsername) => {
      const { data, error } = await supabase.auth.updateUser({
        data: { username: newUsername },
      });

      if (error) {
        console.error("Errore nell'aggiornare l'username:", error);
        return { success: false, error };
      }

      console.log("Username aggiornato:", data.user.user_metadata.username);
      return { success: true, user: data.user };
    }; */

    //updateUsername('nome utente')
    getUser();
  }, []);

  useEffect(() => {
    console.log(user)
  }, [user])

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };
  return (
    <div className="pt-4 flex justify-between items-center mb-8">
      <NavigationMenu>
        <NavigationMenuList className="flex space-x-4">
          <NavigationMenuItem>
            <NavigationMenuLink
              href="/"
              className="text-gray-700 hover:font-bold transition-colors duration-300"
            >
              Home
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage src={"https://github.com/shadcn.png"} />
              <AvatarFallback>
                {"nome utente"
                  .split(" ")
                  .slice(0, 2)
                  .map((name: string) => name[0].toUpperCase())
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start">
            <DropdownMenuLabel>
              <span className="font-bold">{user ? user : 'Utente'}</span>
            </DropdownMenuLabel>
            {/* <DropdownMenuGroup>
              <DropdownMenuItem>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Support</DropdownMenuItem> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Header 