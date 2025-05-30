import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

const Header = () => {
  return (
    <div className="pb-8 pt-4 flex justify-between items-center mb-8">
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
        <span className="text-gray-700 capitalize">Irene</span>
        <Avatar>
          <AvatarImage src={"https://github.com/shadcn.png"} />
          <AvatarFallback>
            {"irene giacchetta"
              .split(" ")
              .slice(0, 2)
              .map((name: string) => name[0].toUpperCase())
              .join("")}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default Header 