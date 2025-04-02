import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserReview from "./UserReview";
import { useNavigate } from "react-router-dom";

export default function UserReviewPage() {
  const navigate = useNavigate();

  return (
    <div className="py-8">
      <Button
        variant="ghost"
        onClick={() => navigate("/")}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Inicio
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Comparte tu experiencia</h1>
        <p className="text-muted-foreground mt-2">
          Valoramos tus comentarios. Por favor, tómate un momento para evaluar
          tu estadía en BungalowParadise.
        </p>
      </div>

      <UserReview />
    </div>
  );
}
