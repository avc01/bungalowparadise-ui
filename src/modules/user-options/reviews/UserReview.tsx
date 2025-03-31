import type React from "react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

type RoomType = "Single" | "Double" | "Suite";

export default function UserReview() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState("");
  const [roomType, setRoomType] = useState<RoomType | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleRatingHover = (hoveredRating: number) => {
    setHoveredRating(hoveredRating);
  };

  const handleRatingLeave = () => {
    setHoveredRating(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (rating === 0) {
      toast.warning("Valoración requerida", {
        description: "Por favor selecciona una valoración para tu estadía",
      });

      return;
    }

    if (reviewText.trim().length < 10) {
      toast.warning("Reseña muy corta", {
        description: "Por favor, proporciona más detalles sobre tu experiencia",
      });

      return;
    }

    if (roomType === "") {
      toast.warning("Tipo de habitación requerido", {
        description:
          "Por favor, selecciona el tipo de habitación en la que te alojaste",
      });
      return;
    }

    // Submit the review
    setIsSubmitting(true);

    const reviewToSend = {
      userId: user?.id,
      comment: reviewText,
      rating: rating,
    };

    api.post("/api/review", reviewToSend).then(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);

      setRating(0);
      setReviewText("");
      setRoomType("");

      toast.success("Reseña enviada", {
        description: "¡Gracias por compartir tu experiencia!",
      });
    });
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl mb-2">¡Gracias!</CardTitle>
          <CardDescription className="text-lg">
            Tu reseña se ha enviado con éxito. ¡Agradecemos tus comentarios!
          </CardDescription>
          <Button className="mt-6" onClick={() => navigate("/bookings")}>
            Volver a Reservas
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Escribe una reseña
        </CardTitle>
        <CardDescription>
          Comparte tu experiencia en BungalowParadise para ayudar a otros
          viajeros.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Valoración */}
          <div className="space-y-2">
            <Label htmlFor="rating">Tu valoración</Label>
            <div
              className="flex items-center gap-1"
              onMouseLeave={handleRatingLeave}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => handleRatingHover(star)}
                  className="p-1 focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 ${
                      (hoveredRating ? star <= hoveredRating : star <= rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    } transition-colors`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {rating > 0
                  ? ["Malo", "Regular", "Bueno", "Muy bueno", "Excelente"][
                      rating - 1
                    ]
                  : "Selecciona una valoración"}
              </span>
            </div>
          </div>

          {/* Texto de la reseña */}
          <div className="space-y-2">
            <Label htmlFor="review">Tu reseña</Label>
            <Textarea
              id="review"
              placeholder="Cuéntanos sobre tu experiencia durante tu estadía..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={5}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {reviewText.length < 10
                ? `Se requieren al menos ${
                    10 - reviewText.length
                  } caracteres adicionales`
                : ""}
            </p>
          </div>

          {/* Tipo de habitación */}
          <div className="space-y-2">
            <Label htmlFor="roomType">Tipo de habitación</Label>
            <Select
              value={roomType}
              onValueChange={(value) => setRoomType(value as RoomType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo de habitación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Single">Single</SelectItem>
                <SelectItem value="Double">Double</SelectItem>
                <SelectItem value="Suite">Suite</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            {isSubmitting ? "Enviando..." : "Enviar reseña"}
            <Send className="h-4 w-4" />
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
