import type React from "react";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import api from "@/lib/api";

// Room type definition
type Room = {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string[];
  type: "Single" | "Double" | "Suite";
  guestsPerRoom: number;
  bathrooms: number;
  status: "Available" | "Maintenance";
  roomNumber?: string;
  beds?: number;
  imageUrlsToSave?: File[]; // For file upload
};

export default function AdminRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState<Partial<Room>>({
    name: "",
    description: "",
    price: 0,
    imageUrl: [],
    type: "Single",
    guestsPerRoom: 0,
    bathrooms: 0,
    status: "Available",
    beds: 0,
    roomNumber: "",
    id: 0,
    imageUrlsToSave: [], // For file upload
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter rooms based on search query
  const filteredRooms = rooms.filter(
    (room) =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;

    if (type === "file" && files) {
      // For multiple files
      setFormData((prev) => ({
        ...prev,
        imageUrlsToSave: Array.from(files), // 👈 Store File[] directly
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          name === "price" ||
          name === "capacity" ||
          name === "bathrooms" ||
          name === "beds" ||
          name === "guestsPerRoom"
            ? Number(value)
            : value,
      }));
    }
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddRoom = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      imageUrl: [],
      type: "Single",
      guestsPerRoom: 0,
      bathrooms: 0,
      status: "Available",
      beds: 0,
      roomNumber: "",
      id: 0,
      imageUrlsToSave: [], // For file upload
    });
    setIsAddDialogOpen(true);
  };

  // Open edit dialog
  const handleEditRoom = (room: Room) => {
    setCurrentRoom(room);
    setFormData({ ...room });
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const handleDeleteRoom = (room: Room) => {
    setCurrentRoom(room);
    setIsDeleteDialogOpen(true);
  };

  // Submit add form
  const handleAddSubmit = async () => {
    setIsSubmitting(true);

    // Validate required fields
    if (
      !formData.name ||
      !formData.description ||
      formData.price === undefined
    ) {
      toast("Error de Validación", {
        description: "Por favor, completa todos los campos requeridos",
      });
      setIsSubmitting(false);
      return;
    }

    const payload = new FormData();

    // Map Room model fields to SaveRoomDto names (must match backend DTO property names)
    payload.append("Name", formData.name);
    payload.append("Description", formData.description);
    payload.append("Price", formData.price.toString());
    payload.append("RoomNumber", formData.roomNumber ?? "");
    payload.append("Type", formData.type ?? "Single");
    payload.append("Status", formData.status ?? "Available");
    payload.append("Bathrooms", (formData.bathrooms ?? 1).toString());
    payload.append("Beds", (formData.beds ?? 1).toString());
    payload.append("GuestsPerRoom", (formData.guestsPerRoom ?? 2).toString());

    // Attach all selected images using the key the backend expects
    if (formData.imageUrlsToSave && formData.imageUrlsToSave.length > 0) {
      formData.imageUrlsToSave.forEach((file) => {
        payload.append("images", file); // ✅ this matches: List<IFormFile> images
      });
    }

    try {
      await api.post("/api/room/upload", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ Reload rooms from backend
      fetchRooms();

      toast.success("La habitación ha sido añadida correctamente.", {
        description: "Subida completada",
      });

      // Optionally: reset form or reload data
      setIsAddDialogOpen(false);
    } catch (error) {
      toast.error("Error al subir archivo", {
        description: "Por favor, intenta nuevamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async () => {
    setIsSubmitting(true);

    if (
      !formData.name ||
      !formData.description ||
      formData.price === undefined
    ) {
      toast("Error de Validación", {
        description: "Por favor, completa todos los campos requeridos",
      });

      setIsSubmitting(false);
      return;
    }

    const payload = new FormData();

    payload.append("Id", (formData.id ?? 0).toString());
    payload.append("Name", formData.name);
    payload.append("RoomNumber", formData.roomNumber ?? "");
    payload.append("Description", formData.description);
    payload.append("Price", formData.price.toString());
    payload.append("Type", formData.type?.toString() ?? "Single");
    payload.append("Status", formData.status?.toString() ?? "Available");
    payload.append("Bathrooms", (formData.bathrooms ?? 1).toString());
    payload.append("Beds", (formData.beds ?? 1).toString());
    payload.append("GuestsPerRoom", (formData.guestsPerRoom ?? 2).toString());

    // Attach images (if any)
    formData.imageUrlsToSave?.forEach((file) => {
      payload.append("Images", file);
    });

    try {
      await api.put("/api/room/admin/update", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Habitación actualizada correctamente");

      // ✅ Reload rooms from backend
      fetchRooms();
      setIsEditDialogOpen(false);
    } catch (err) {
      toast.error("Error al actualizar la habitación");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit delete
  const handleDeleteSubmit = () => {
    setIsSubmitting(true);

    api
      .delete(`api/room/${currentRoom?.id}`)
      .then(() => {
        toast(`${currentRoom?.name} ha sido eliminada correctamente.`, {
          description: "Habitación Eliminada",
        });

        // ✅ Reload rooms from backend
        fetchRooms();
      })
      .catch(() => {
        toast.error(`Error al eliminar ${currentRoom?.name}`, {
          description: "La habitación no fue eliminada",
        });
      })
      .finally(() => {
        setIsDeleteDialogOpen(false);
        setIsSubmitting(false);
      });
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Booked":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const fetchRooms = () => {
    api
      .get("api/Room/admin/rooms")
      .then((res) => {
        setRooms(res.data);
      })
      .catch((err) => {
        setRooms([]);
        toast("Error al obtener habitaciones", {
          description: `No se pudo cargar la información de las habitaciones. Por favor, intenta nuevamente más tarde. ${err.message}`,
        });
      });
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <Card>
      <CardHeader className="pb-4 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
              Administrar Habitaciones
            </CardTitle>
            <CardDescription className="text-muted-foreground max-w-md">
              Añade, edita o elimina habitaciones del inventario del hotel
            </CardDescription>
          </div>
          <Button
            onClick={handleAddRoom}
            className="bg-primary text-primary-foreground hover:brightness-110 transition duration-200"
          >
            <Plus className="mr-2 h-4 w-4" /> Añadir Nueva Habitación
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 mt-2">
        {/* Search Input */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar habitaciones..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-border shadow-sm bg-background/50 backdrop-blur-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="text-primary">Nombre</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Número</TableHead>
                <TableHead>Capacidad</TableHead>
                <TableHead>Baños</TableHead>
                <TableHead>Camas</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Imágenes</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRooms.length > 0 ? (
                filteredRooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell className="font-medium">{room.name}</TableCell>
                    <TableCell className="capitalize">{room.type}</TableCell>
                    <TableCell>💲{room.price}</TableCell>
                    <TableCell>🚪{room.roomNumber}</TableCell>
                    <TableCell>{room.guestsPerRoom} huésped(es)</TableCell>
                    <TableCell>{room.bathrooms} 🚽</TableCell>
                    <TableCell>{room.beds} 🛏️</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(room.status)}>
                        {room.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{room.imageUrl.length} 🖼️</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditRoom(room)}
                          className="h-8 w-8 hover:bg-muted"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteRoom(room)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No se encontraron habitaciones.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Diálogo para Añadir Habitación */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Añadir Nueva Habitación</DialogTitle>
            <DialogDescription>
              Ingresa los detalles de la nueva habitación.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Nombre */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nombre
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            {/* Descripción */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Descripción
              </Label>
              <Input
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            {/* Precio */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Precio
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            {/* Número de Habitación */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="roomNumber" className="text-right">
                Número de Habitación
              </Label>
              <Input
                id="roomNumber"
                name="roomNumber"
                value={formData.roomNumber || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            {/* Tipo */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Tipo</Label>
              <Select
                value={formData.type || "Single"}
                onValueChange={(value) => handleSelectChange("type", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-md shadow-md text-foreground">
                  <SelectItem value="Suite">Suite</SelectItem>
                  <SelectItem value="Single">Single</SelectItem>
                  <SelectItem value="Double">Double</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Estado */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Estado</Label>
              <Select
                value={formData.status || "Available"}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-md shadow-md text-foreground">
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Baños */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bathrooms" className="text-right">
                Baños
              </Label>
              <Input
                id="bathrooms"
                name="bathrooms"
                type="number"
                value={formData.bathrooms || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            {/* Camas */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="beds" className="text-right">
                Camas
              </Label>
              <Input
                id="beds"
                name="beds"
                type="number"
                value={formData.beds || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            {/* Capacidad */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="guestsPerRoom" className="text-right">
                Capacidad
              </Label>
              <Input
                id="guestsPerRoom"
                name="guestsPerRoom"
                type="number"
                value={formData.guestsPerRoom || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            {/* Subir Imágenes */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="images" className="text-right pt-2">
                Imágenes
              </Label>

              <div className="col-span-3">
                <label
                  htmlFor="images"
                  className="flex items-center justify-center w-full px-4 py-10 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer text-center hover:bg-muted transition"
                >
                  <span className="text-sm text-muted-foreground">
                    Haz clic para seleccionar o arrastra las imágenes (JPG, PNG)
                  </span>
                </label>
                <Input
                  id="images"
                  name="imageUrlsToSave"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleInputChange}
                  className="hidden"
                />
                {formData.imageUrlsToSave &&
                  formData.imageUrlsToSave.length > 0 && (
                    <p className="text-sm text-gray-500 mt-2">
                      {formData.imageUrlsToSave.length} archivo(s)
                      seleccionado(s)
                    </p>
                  )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Agregando..." : "Añadir Habitación"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para Editar Habitación */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Habitación</DialogTitle>
            <DialogDescription>
              Actualiza los detalles de esta habitación.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Número de Habitación */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-roomNumber" className="text-right">
                Habitación #
              </Label>
              <Input
                id="edit-roomNumber"
                name="roomNumber"
                value={formData.roomNumber || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            {/* Nombre */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Nombre
              </Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            {/* Descripción */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Descripción
              </Label>
              <Input
                id="edit-description"
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            {/* Precio */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-price" className="text-right">
                Precio
              </Label>
              <Input
                id="edit-price"
                name="price"
                type="number"
                value={formData.price || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            {/* Tipo */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-type" className="text-right">
                Tipo
              </Label>
              <Select
                value={formData.type || "Single"}
                onValueChange={(value) => handleSelectChange("type", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Single">Single</SelectItem>
                  <SelectItem value="Suite">Suite</SelectItem>
                  <SelectItem value="Double">Double</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Capacidad */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-capacity" className="text-right">
                Capacidad
              </Label>
              <Input
                id="edit-capacity"
                name="guestsPerRoom"
                type="number"
                value={formData.guestsPerRoom || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            {/* Baños */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-bathrooms" className="text-right">
                Baños
              </Label>
              <Input
                id="edit-bathrooms"
                name="bathrooms"
                type="number"
                value={formData.bathrooms || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            {/* Camas */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-beds" className="text-right">
                Camas
              </Label>
              <Input
                id="edit-beds"
                name="beds"
                type="number"
                value={formData.beds || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            {/* Estado */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right">
                Estado
              </Label>
              <Select
                value={formData.status || "Available"}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Subir Imágenes */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="edit-images" className="text-right pt-2">
                Nuevas Imágenes
              </Label>
              <div className="col-span-3">
                <Input
                  id="edit-images"
                  type="file"
                  name="imageUrlsToSave"
                  multiple
                  accept="image/*"
                  onChange={handleInputChange}
                />
                {formData.imageUrlsToSave &&
                  formData.imageUrlsToSave?.length > 0 && (
                    <p className="text-sm text-gray-500 mt-2">
                      {formData.imageUrlsToSave.length} archivo(s)
                      seleccionado(s)
                    </p>
                  )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleEditSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Eliminación de Habitación */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Eliminar Habitación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar {currentRoom?.name}? Esta
              acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Eliminando..." : "Eliminar Habitación"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
