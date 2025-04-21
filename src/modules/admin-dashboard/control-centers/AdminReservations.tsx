import type React from "react";

import { useState } from "react";
import { format } from "date-fns";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { Search, Plus, Pencil, Trash2, CalendarIcon } from "lucide-react";
import type { Reservation } from "@/modules/user-options/reservations/ReservationCard";
import { addDays, subDays } from "date-fns";

// Mock room data for selection
const roomOptions = [
  { id: 1, name: "Deluxe Ocean View", type: "deluxe" },
  { id: 2, name: "Premium Garden Suite", type: "suite" },
  { id: 3, name: "Family Bungalow", type: "bungalow" },
  { id: 4, name: "Honeymoon Villa", type: "villa" },
  { id: 5, name: "Standard Garden View", type: "standard" },
  { id: 6, name: "Beachfront Bungalow", type: "bungalow" },
];

// Mock reservation data
const initialReservations: Reservation[] = [
  {
    rooms: [{ name: "Deluxe Ocean View", type: "deluxe" }],
    checkIn: addDays(new Date(), 30),
    checkOut: addDays(new Date(), 35),
    numberOfGuests: 2,
    totalPrice: 1495,
    status: "Confirmed",
    location: "North Wing, Floor 3",
    reservationId: "res-001",
  },
  {
    rooms: [
      { name: "Premium Garden Suite", type: "suite" },
      { name: "Family Bungalow", type: "bungalow" },
    ],
    checkIn: new Date(),
    checkOut: addDays(new Date(), 5),
    numberOfGuests: 3,
    totalPrice: 1995,
    status: "Completed",
    location: "East Wing, Floor 2",
    reservationId: "res-004",
  },
  {
    rooms: [
      { name: "Family Bungalow", type: "bungalow" },
      { name: "Standard Garden View", type: "standard" },
    ],
    checkIn: subDays(new Date(), 20),
    checkOut: subDays(new Date(), 15),
    numberOfGuests: 6,
    totalPrice: 3495,
    status: "Cancelled",
    location: "Beachfront Area",
    reservationId: "res-003",
  },
  {
    rooms: [
      { name: "Standard Garden View", type: "standard" },
      { name: "Deluxe Ocean View", type: "deluxe" },
      { name: "Premium Garden Suite", type: "suite" },
    ],
    checkIn: subDays(new Date(), 60),
    checkOut: subDays(new Date(), 57),
    numberOfGuests: 7,
    totalPrice: 2997,
    status: "Confirmed",
    location: "South Wing, Floor 1",
    reservationId: "res-002",
  },
];

export default function AdminReservations() {
  const [reservations, setReservations] =
    useState<Reservation[]>(initialReservations);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentReservation, setCurrentReservation] =
    useState<Reservation | null>(null);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [formData, setFormData] = useState<Partial<Reservation>>({
    checkIn: new Date(),
    checkOut: addDays(new Date(), 3),
    numberOfGuests: 2,
    totalPrice: 0,
    status: "Completed",
    location: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter reservations based on search query
  const filteredReservations = reservations.filter(
    (reservation) =>
      reservation.reservationId
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      reservation.rooms.some((room) =>
        room.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      reservation.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "guests" || name === "totalPrice" ? Number(value) : value,
    }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle date changes
  const handleDateChange = (name: string, date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, [name]: date }));
    }
  };

  // Handle room selection
  const handleRoomSelection = (roomName: string) => {
    setSelectedRooms((prev) => {
      if (prev.includes(roomName)) {
        return prev.filter((name) => name !== roomName);
      } else {
        return [...prev, roomName];
      }
    });
  };

  // Open add dialog
  const handleAddReservation = () => {
    setFormData({
      checkIn: new Date(),
      checkOut: addDays(new Date(), 3),
      numberOfGuests: 2,
      totalPrice: 0,
      status: "Confirmed",
      location: "North Wing",
    });
    setSelectedRooms([]);
    setIsAddDialogOpen(true);
  };

  // Open edit dialog
  const handleEditReservation = (reservation: Reservation) => {
    setCurrentReservation(reservation);
    setFormData({ ...reservation });
    setSelectedRooms(reservation.rooms.map((room) => room.name));
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const handleDeleteReservation = (reservation: Reservation) => {
    setCurrentReservation(reservation);
    setIsDeleteDialogOpen(true);
  };

  // Submit add form
  const handleAddSubmit = () => {
    setIsSubmitting(true);

    // Validate form
    if (!formData.checkIn || !formData.checkOut || selectedRooms.length === 0) {
      toast.error(
        "Please fill in all required fields and select at least one room",
        {
          description: "Validation Error",
        }
      );
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      const newReservation: Reservation = {
        rooms: selectedRooms.map((name) => {
          const roomOption = roomOptions.find((r) => r.name === name);
          return { name, type: roomOption?.type || "standard" };
        }),
        checkIn: formData.checkIn!,
        checkOut: formData.checkOut!,
        numberOfGuests: formData.numberOfGuests || 2,
        totalPrice: formData.totalPrice || 0,
        status: formData.status as "Cancelled" | "Confirmed" | "Completed",
        location: formData.location || "North Wing",
        reservationId: `res-${Date.now().toString().slice(-6)}`,
      };

      setReservations((prev) => [...prev, newReservation]);
      setIsSubmitting(false);
      setIsAddDialogOpen(false);

      toast.success("Reservation Added", {
        description: `Reservation ${newReservation.reservationId} has been added successfully.`,
      });
    }, 1000);
  };

  // Submit edit form
  const handleEditSubmit = () => {
    setIsSubmitting(true);

    // Validate form
    if (!formData.checkIn || !formData.checkOut || selectedRooms.length === 0) {
      toast.error(
        "Please fill in all required fields and select at least one room",
        {
          description: "Validation Error",
        }
      );
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setReservations((prev) =>
        prev.map((reservation) =>
          reservation.reservationId === currentReservation?.reservationId
            ? {
                ...reservation,
                rooms: selectedRooms.map((name) => {
                  const roomOption = roomOptions.find((r) => r.name === name);
                  return { name, type: roomOption?.type || "standard" };
                }),
                checkIn: formData.checkIn!,
                checkOut: formData.checkOut!,
                numberOfGuests: formData.numberOfGuests || 2,
                totalPrice: formData.totalPrice || 0,
                status: formData.status as
                  | "Confirmed"
                  | "Completed"
                  | "Cancelled",
                location: formData.location || "North Wing",
              }
            : reservation
        )
      );
      setIsSubmitting(false);
      setIsEditDialogOpen(false);

      toast.success("Reservation Updated", {
        description: `Reservation ${currentReservation?.reservationId} has been updated successfully.`,
      });
    }, 1000);
  };

  // Submit delete
  const handleDeleteSubmit = () => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setReservations((prev) =>
        prev.filter(
          (reservation) =>
            reservation.reservationId !== currentReservation?.reservationId
        )
      );
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);

      toast.success("Reservation Deleted", {
        description: `Reservation ${currentReservation?.reservationId} has been deleted successfully.`,
      });
    }, 1000);
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Manage Reservations</CardTitle>
            <CardDescription>
              View, add, edit, or cancel guest reservations
            </CardDescription>
          </div>
          <Button onClick={handleAddReservation} className="sm:self-end">
            <Plus className="mr-2 h-4 w-4" /> Add New Reservation
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reservations..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Confirmation #</TableHead>
                <TableHead>Rooms</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead>Guests</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReservations.length > 0 ? (
                filteredReservations.map((reservation) => (
                  <TableRow key={reservation.reservationId}>
                    <TableCell className="font-medium">
                      {reservation.reservationId}
                    </TableCell>
                    <TableCell>
                      {reservation.rooms.length > 1
                        ? `${reservation.rooms.length} rooms`
                        : reservation.rooms[0].name}
                    </TableCell>
                    <TableCell>
                      {format(reservation.checkIn, "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      {format(reservation.checkOut, "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>{reservation.numberOfGuests}</TableCell>
                    <TableCell>${reservation.totalPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(reservation.status)}>
                        {reservation.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditReservation(reservation)}
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteReservation(reservation)}
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
                  <TableCell colSpan={8} className="h-24 text-center">
                    No reservations found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Add Reservation Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Reservation</DialogTitle>
            <DialogDescription>
              Enter the details for the new reservation.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Select Rooms</Label>
              <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto border rounded-md p-2">
                {roomOptions.map((room) => (
                  <div key={room.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`room-${room.id}`}
                      checked={selectedRooms.includes(room.name)}
                      onChange={() => handleRoomSelection(room.name)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor={`room-${room.id}`} className="text-sm">
                      {room.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Check-in Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.checkIn
                        ? format(formData.checkIn, "MMM dd, yyyy")
                        : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.checkIn}
                      onSelect={(date) => handleDateChange("checkIn", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Check-out Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.checkOut
                        ? format(formData.checkOut, "MMM dd, yyyy")
                        : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.checkOut}
                      onSelect={(date) => handleDateChange("checkOut", date)}
                      disabled={(date) =>
                        !formData.checkIn || date <= formData.checkIn
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guests">Number of Guests</Label>
                <Input
                  id="guests"
                  name="guests"
                  type="number"
                  value={formData.numberOfGuests || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalPrice">Total Price</Label>
                <Input
                  id="totalPrice"
                  name="totalPrice"
                  type="number"
                  value={formData.totalPrice || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status || "upcoming"}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Reservation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Reservation Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Reservation</DialogTitle>
            <DialogDescription>
              Update the details for this reservation.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Select Rooms</Label>
              <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto border rounded-md p-2">
                {roomOptions.map((room) => (
                  <div key={room.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`edit-room-${room.id}`}
                      checked={selectedRooms.includes(room.name)}
                      onChange={() => handleRoomSelection(room.name)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor={`edit-room-${room.id}`} className="text-sm">
                      {room.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Check-in Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.checkIn
                        ? format(formData.checkIn, "MMM dd, yyyy")
                        : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.checkIn}
                      onSelect={(date) => handleDateChange("checkIn", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Check-out Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.checkOut
                        ? format(formData.checkOut, "MMM dd, yyyy")
                        : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.checkOut}
                      onSelect={(date) => handleDateChange("checkOut", date)}
                      disabled={(date) =>
                        !formData.checkIn || date <= formData.checkIn
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-guests">Number of Guests</Label>
                <Input
                  id="edit-guests"
                  name="guests"
                  type="number"
                  value={formData.numberOfGuests || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-totalPrice">Total Price</Label>
                <Input
                  id="edit-totalPrice"
                  name="totalPrice"
                  type="number"
                  value={formData.totalPrice || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={formData.status || "upcoming"}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  name="location"
                  value={formData.location || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Reservation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Reservation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete reservation{" "}
              {currentReservation?.reservationId}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Deleting..." : "Delete Reservation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
