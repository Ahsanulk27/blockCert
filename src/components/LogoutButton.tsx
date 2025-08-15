import { Button } from "./ui/button";
import { useAuth } from "./AuthContext";

export function LogoutButton() {
  const { logout } = useAuth();

  return (
    <Button 
      variant="outline" 
      onClick={logout}
      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
    >
      Logout
    </Button>
  );
}
