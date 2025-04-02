import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import PaymentMethod from "./PaymentMethod";
import { useNavigate } from "react-router-dom";

export default function PaymentMethodPage() {
  const navigate = useNavigate();

  return (
    <div className="py-8">
      <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Inicio
      </Button>

      <div className="bg-card rounded-xl shadow-md p-6">
        <PaymentMethod />
      </div>
    </div>
  );
}
