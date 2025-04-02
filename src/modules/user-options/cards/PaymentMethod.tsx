import { useEffect, useState } from "react";
import { CreditCard, Trash2, Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { AxiosError } from "axios";

// Simplified payment method type
type PaymentMethod = {
  id: string;
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  cardType: "visa" | "mastercard" | "amex";
};

export default function PaymentMethods() {
  const { user } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddCardDialog, setShowAddCardDialog] = useState(false);
  const [showReplaceCardDialog, setShowReplaceCardDialog] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDeleteCard = () => {
    setShowDeleteDialog(true);
  };

  const confirmDeleteCard = () => {
    setPaymentMethod(null);

    api.delete(`api/CardDetail/${paymentMethod?.id}`).then(() =>
      toast.success("Tarjeta eliminada", {
        description: "Tu método de pago ha sido eliminado exitosamente.",
      })
    );

    setShowDeleteDialog(false);
  };

  const handleAddCardClick = () => {
    if (paymentMethod) {
      // If a card already exists, show replace confirmation
      setShowReplaceCardDialog(true);
    } else {
      // If no card exists, show add card dialog
      setShowAddCardDialog(true);
    }
  };

  const confirmReplaceCard = () => {
    setShowReplaceCardDialog(false);
    setShowAddCardDialog(true);
  };

  const handleAddCard = () => {
    setIsSubmitting(true);

    const newCardDetailToSend = {
      oldCardId: paymentMethod?.id,
      userId: user?.id,
      cardNumber: newCard.cardNumber,
      cardHolder: newCard.cardHolder,
      expiryMonth: newCard.expiryMonth,
      expiryYear: newCard.expiryYear,
      cvv: newCard.cvv,
    };

    api
      .post("api/CardDetail/new-card", newCardDetailToSend)
      .then((res) => {
        const newCard = res.data as PaymentMethod;

        setPaymentMethod(newCard);

        // Reset form
        setNewCard({
          cardNumber: "",
          cardHolder: "",
          expiryMonth: "",
          expiryYear: "",
          cvv: "",
        });

        setIsSubmitting(false);
        setShowAddCardDialog(false);

        toast.success(
          paymentMethod ? "Tarjeta actualizada" : "Tarjeta añadida",
          {
            description: paymentMethod
              ? "Tu método de pago ha sido actualizado correctamente."
              : "Tu nuevo método de pago ha sido añadido correctamente.",
          }
        );
      })
      .catch((ex) => {
        const error = ex as AxiosError;

        toast(error.response?.data as string);

        setIsSubmitting(false);
        setShowAddCardDialog(false);
      });
  };

  const getCardIcon = (type: string) => {
    // In a real app, you would use actual card brand SVGs
    return (
      <CreditCard
        className={`h-6 w-6 ${
          type === "visa"
            ? "text-blue-600"
            : type === "mastercard"
            ? "text-red-600"
            : type === "amex"
            ? "text-green-600"
            : "text-orange-600"
        }`}
      />
    );
  };

  useEffect(() => {
    api
      .get(`api/CardDetail/user-card?userId=${user?.id}`)
      .then((res) => setPaymentMethod(res.data))
      .catch(() => setPaymentMethod(null));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Métodos de Pago</h1>
        <p className="text-muted-foreground mt-2">
          Visualiza y administra tu método de pago registrado.
        </p>
      </div>

      {!paymentMethod ? (
        <Card>
          <CardContent className="pt-6 pb-4 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <CreditCard className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">Sin Método de Pago</h3>
            <p className="text-muted-foreground mb-4">
              Aún no tienes ningún método de pago guardado.
            </p>
            <Button onClick={() => setShowAddCardDialog(true)}>
              Agregar Método de Pago
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Tu Tarjeta de Pago</h2>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={handleAddCardClick}
            >
              <Plus className="h-4 w-4" />
              Reemplazar Tarjeta
            </Button>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {getCardIcon(paymentMethod.cardType)}
                  <div>
                    <p className="font-medium">{paymentMethod.cardNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {paymentMethod.cardHolder} • Expira{" "}
                      {paymentMethod.expiryMonth}/{paymentMethod.expiryYear}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={handleDeleteCard}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Alert
            variant="default"
            className="bg-muted border-muted-foreground/20"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              La información de tu tarjeta está encriptada y almacenada de forma
              segura. Nunca guardamos el número completo de tu tarjeta ni el
              CVV.
            </AlertDescription>
          </Alert>
        </>
      )}

      {/* Diálogo de Confirmación de Eliminación */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Eliminar Método de Pago</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este método de pago? Esta
              acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 sm:space-x-0 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDeleteCard}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Confirmación de Reemplazo */}
      <Dialog
        open={showReplaceCardDialog}
        onOpenChange={setShowReplaceCardDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reemplazar Método de Pago</DialogTitle>
            <DialogDescription>
              Solo puedes tener un método de pago a la vez. ¿Deseas reemplazar
              tu tarjeta actual por una nueva?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 sm:space-x-0 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setShowReplaceCardDialog(false)}
            >
              Cancelar
            </Button>
            <Button onClick={confirmReplaceCard}>Continuar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para Agregar Tarjeta */}
      <Dialog open={showAddCardDialog} onOpenChange={setShowAddCardDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {paymentMethod
                ? "Reemplazar Método de Pago"
                : "Agregar Método de Pago"}
            </DialogTitle>
            <DialogDescription>
              Ingresa los detalles de tu tarjeta para{" "}
              {paymentMethod
                ? "reemplazar tu método de pago actual"
                : "guardar un nuevo método de pago"}
              .
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Número de Tarjeta</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={newCard.cardNumber}
                onChange={(e) =>
                  setNewCard({
                    ...newCard,
                    cardNumber: e.target.value.replace(/\D/g, "").slice(0, 16),
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardHolder">Nombre del Titular</Label>
              <Input
                id="cardHolder"
                placeholder="Juan Pérez"
                value={newCard.cardHolder}
                onChange={(e) =>
                  setNewCard({ ...newCard, cardHolder: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Mes de Expiración</Label>
                <Select
                  value={newCard.expiryMonth}
                  onValueChange={(value) =>
                    setNewCard({ ...newCard, expiryMonth: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => {
                      const month = i + 1;
                      return (
                        <SelectItem
                          key={month}
                          value={month.toString().padStart(2, "0")}
                        >
                          {month.toString().padStart(2, "0")}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Año de Expiración</Label>
                <Select
                  value={newCard.expiryYear}
                  onValueChange={(value) =>
                    setNewCard({ ...newCard, expiryYear: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="AA" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = new Date().getFullYear() + i;
                      return (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  maxLength={4}
                  value={newCard.cvv}
                  onChange={(e) =>
                    setNewCard({
                      ...newCard,
                      cvv: e.target.value.replace(/\D/g, "").slice(0, 4),
                    })
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddCardDialog(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleAddCard} disabled={isSubmitting}>
              {isSubmitting
                ? "Procesando..."
                : paymentMethod
                ? "Reemplazar Tarjeta"
                : "Agregar Tarjeta"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
