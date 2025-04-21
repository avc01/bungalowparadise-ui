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
import { Search, Plus, Pencil, Trash2, ImageIcon } from "lucide-react";
import api from "@/lib/api";

// Room type definition
type Room = {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string[];
  type: string;
  guestsPerRoom: number;
  bathrooms: number;
  status: "Available" | "Maintenance";
  roomNumber?: string;
  beds?: number;
};

// Mock room data
// const initialRooms: Room[] = [
//   {
//     id: 1,
//     name: "Deluxe Ocean View",
//     description: "Spacious room with stunning ocean views and private balcony",
//     price: 299,
//     image: "/placeholder.svg?height=300&width=500",
//     type: "deluxe",
//     capacity: 2,
//     bathrooms: 1,
//     status: "available",
//   },
//   {
//     id: 2,
//     name: "Premium Garden Suite",
//     description: "Elegant suite overlooking our tropical gardens",
//     price: 399,
//     image: "/placeholder.svg?height=300&width=500",
//     type: "suite",
//     capacity: 3,
//     bathrooms: 1,
//     status: "booked",
//   },
//   {
//     id: 3,
//     name: "Family Bungalow",
//     description: "Perfect for families with separate living area",
//     price: 499,
//     image: "/placeholder.svg?height=300&width=500",
//     type: "bungalow",
//     capacity: 4,
//     bathrooms: 2,
//     status: "available",
//   },
//   {
//     id: 4,
//     name: "Honeymoon Villa",
//     description: "Romantic villa with private plunge pool",
//     price: 599,
//     image: "/placeholder.svg?height=300&width=500",
//     type: "villa",
//     capacity: 2,
//     bathrooms: 1,
//     status: "maintenance",
//   },
// ];

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
    imageUrl: ["/placeholder.svg?height=300&width=500"],
    type: "standard",
    guestsPerRoom: 2,
    bathrooms: 1,
    status: "Available",
    beds: 1,
    roomNumber: "",
    id: 0,
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
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "capacity" || name === "bathrooms"
          ? Number(value)
          : value,
    }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Open add dialog
  const handleAddRoom = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      imageUrl: ["/placeholder.svg?height=300&width=500"],
      type: "standard",
      guestsPerRoom: 2,
      bathrooms: 1,
      status: "Available",
      beds: 1,
      roomNumber: "",
      id: 0,
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
  const handleAddSubmit = () => {
    setIsSubmitting(true);

    // Validate form
    if (
      !formData.name ||
      !formData.description ||
      formData.price === undefined
    ) {
      toast("Validation Error", {
        description: "Please fill in all required fields",
      });
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    // setTimeout(() => {
    //   const newRoom: Room = {
    //     id: Math.max(...rooms.map((r) => r.id)) + 1,
    //     name: formData.name!,
    //     description: formData.description!,
    //     price: formData.price!,
    //     image: formData.image || "/placeholder.svg?height=300&width=500",
    //     type: formData.type || "standard",
    //     capacity: formData.capacity || 2,
    //     bathrooms: formData.bathrooms || 1,
    //     status:
    //       (formData.status as "available" | "maintenance" | "booked") ||
    //       "available",
    //   };

    //   setRooms((prev) => [...prev, newRoom]);
    //   setIsSubmitting(false);
    //   setIsAddDialogOpen(false);

    //   toast(`${newRoom.name} has been added successfully.`, {
    //     description: "Room Added",
    //   });
    // }, 1000);
  };

  // Submit edit form
  const handleEditSubmit = () => {
    setIsSubmitting(true);

    // Validate form
    if (
      !formData.name ||
      !formData.description ||
      formData.price === undefined
    ) {
      toast("Validation Error", {
        description: "Please fill in all required fields",
      });
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    // setTimeout(() => {
    //   setRooms((prev) =>
    //     prev.map((room) =>
    //       room.id === currentRoom?.id
    //         ? {
    //             ...room,
    //             ...formData,
    //             price: formData.price!,
    //             capacity: formData.capacity!,
    //             bathrooms: formData.bathrooms!,
    //           }
    //         : room
    //     )
    //   );
    //   setIsSubmitting(false);
    //   setIsEditDialogOpen(false);

    //   toast(`${formData.name} has been updated successfully.`, {
    //     description: "Room Updated",
    //   });
    // }, 1000);
  };

  // Submit delete
  const handleDeleteSubmit = () => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setRooms((prev) => prev.filter((room) => room.id !== currentRoom?.id));
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);

      toast(`${currentRoom?.name} has been deleted successfully.`, {
        description: "Room Deleted",
      });
    }, 1000);
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

  useEffect(() => {
    api
      .get("api/Room/admin/rooms")
      .then((res) => {
        debugger;
        setRooms(res.data)
      })
      .catch((err) => {
        setRooms([]);
        toast("Error fetching rooms", {
          description: `Unable to load room data. Please try again later. ${err.message}`,
        });
      });
  }, []);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Manage Rooms</CardTitle>
            <CardDescription>
              Add, edit, or remove rooms from your inventory
            </CardDescription>
          </div>
          <Button onClick={handleAddRoom} className="sm:self-end">
            <Plus className="mr-2 h-4 w-4" /> Add New Room
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search rooms..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>RoomNumber</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Bathrooms</TableHead>
                <TableHead>Beds</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Images on Display</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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
                    <TableCell>{room.guestsPerRoom} guests</TableCell>
                    <TableCell>{room.bathrooms}🚽</TableCell>
                    <TableCell>{room.beds}🛏️</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(room.status)}>
                        {room.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{room.imageUrl.length}🖼️</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditRoom(room)}
                          className="h-8 w-8"
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
                  <TableCell colSpan={6} className="h-24 text-center">
                    No rooms found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Add Room Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Room</DialogTitle>
            <DialogDescription>
              Enter the details for the new room.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price
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

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select
                value={formData.type || "standard"}
                onValueChange={(value) => handleSelectChange("type", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="deluxe">Deluxe</SelectItem>
                  <SelectItem value="suite">Suite</SelectItem>
                  <SelectItem value="bungalow">Bungalow</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="capacity" className="text-right">
                Capacity
              </Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                value={formData.guestsPerRoom || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bathrooms" className="text-right">
                Bathrooms
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

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={formData.status || "available"}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="booked">Booked</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Image
              </Label>
              <div className="col-span-3 flex gap-2">
                <Input
                  id="image"
                  name="image"
                  value={formData.imageUrl || ""}
                  onChange={handleInputChange}
                  className="flex-1"
                  disabled
                />
                <Button
                  variant="outline"
                  size="icon"
                  disabled
                  className="flex-shrink-0"
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Room"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Room Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
            <DialogDescription>
              Update the details for this room.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Description
              </Label>
              <Input
                id="edit-description"
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-price" className="text-right">
                Price
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

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-type" className="text-right">
                Type
              </Label>
              <Select
                value={formData.type || "standard"}
                onValueChange={(value) => handleSelectChange("type", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="deluxe">Deluxe</SelectItem>
                  <SelectItem value="suite">Suite</SelectItem>
                  <SelectItem value="bungalow">Bungalow</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-capacity" className="text-right">
                Capacity
              </Label>
              <Input
                id="edit-capacity"
                name="capacity"
                type="number"
                value={formData.guestsPerRoom || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-bathrooms" className="text-right">
                Bathrooms
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

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right">
                Status
              </Label>
              <Select
                value={formData.status || "available"}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="booked">Booked</SelectItem>
                </SelectContent>
              </Select>
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

      {/* Delete Room Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Room</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {currentRoom?.name}? This action
              cannot be undone.
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
              {isSubmitting ? "Deleting..." : "Delete Room"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
