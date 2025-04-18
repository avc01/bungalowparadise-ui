import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserReview from "./UserReview";
import { useNavigate } from "react-router-dom";

export default function UserReviewPage() {
  const navigate = useNavigate();

  return (
    <div className="py-12 px-6 max-w-5xl mx-auto">
      <Button
        variant="ghost"
        onClick={() => navigate("/")}
        className="mb-6 text-primary hover:underline"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Inicio
      </Button>

      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">
          Comparte tu experiencia
        </h1>
        <p className="text-muted-foreground mt-2 text-sm max-w-xl">
          Valoramos tus comentarios. Por favor, tómate un momento para evaluar
          tu estadía en <strong>Bungalow Paradise</strong>.
        </p>
      </div>

      <UserReview />
    </div>
  );
}
