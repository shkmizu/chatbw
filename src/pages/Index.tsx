import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { ChatInterface } from '@/components/ChatInterface';

const Index = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("chatbw-authenticated") === "true";

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("chatbw-authenticated");
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/90 to-primary/5">
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="gap-2"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
      <ChatInterface />
    </div>
  );
};

export default Index;
