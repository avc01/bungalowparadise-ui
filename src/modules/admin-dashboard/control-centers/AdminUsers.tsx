import type React from "react";
import { useState } from "react";
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

// User type definition
type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "guest" | "admin" | "staff";
  status: "active" | "inactive" | "blocked";
  reservations: number;
  joinDate: Date;
};

// Mock user data
const initialUsers: User[] = [
  // {
  //   id: 1,
  //   name: "John Doe",
  //   email: "john@example.com",
  //   phone: "+1 (555) 123-4567",
  //   role: "guest",
  //   status: "active",
  //   reservations: 3,
  //   joinDate: new Date(2023, 1, 15),
  // },
  // {
  //   id: 2,
  //   name: "Jane Smith",
  //   email: "jane@example.com",
  //   phone: "+1 (555) 987-6543",
  //   role: "admin",
  //   status: "active",
  //   reservations: 0,
  //   joinDate: new Date(2022, 10, 5),
  // },
  // {
  //   id: 3,
  //   name: "Robert Johnson",
  //   email: "robert@example.com",
  //   phone: "+1 (555) 456-7890",
  //   role: "guest",
  //   status: "inactive",
  //   reservations: 1,
  //   joinDate: new Date(2023, 5, 22),
  // },
  // {
  //   id: 4,
  //   name: "Emily Davis",
  //   email: "emily@example.com",
  //   phone: "+1 (555) 234-5678",
  //   role: "staff",
  //   status: "active",
  //   reservations: 0,
  //   joinDate: new Date(2023, 3, 10),
  // },
  // {
  //   id: 5,
  //   name: "Michael Wilson",
  //   email: "michael@example.com",
  //   phone: "+1 (555) 876-5432",
  //   role: "guest",
  //   status: "blocked",
  //   reservations: 2,
  //   joinDate: new Date(2022, 8, 18),
  // },
];

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({
    name: "",
    email: "",
    phone: "",
    role: "guest",
    status: "active",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery)
  );

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Open add dialog
  const handleAddUser = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "guest",
      status: "active",
    });
    setIsAddDialogOpen(true);
  };

  // Open edit dialog
  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setFormData({ ...user });
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const handleDeleteUser = (user: User) => {
    setCurrentUser(user);
    setIsDeleteDialogOpen(true);
  };

  // Submit add form
  const handleAddSubmit = () => {
    setIsSubmitting(true);

    // Validate form
    if (!formData.name || !formData.email) {
      toast.error("Please fill in all required fields", {
        description: "Validation Error",
      });
      setIsSubmitting(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address", {
        description: "Invalid Email",
      });
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      const newUser: User = {
        id: Math.max(...users.map((u) => u.id)) + 1,
        name: formData.name!,
        email: formData.email!,
        phone: formData.phone || "",
        role: (formData.role as "guest" | "admin" | "staff") || "guest",
        status:
          (formData.status as "active" | "inactive" | "blocked") || "active",
        reservations: 0,
        joinDate: new Date(),
      };

      setUsers((prev) => [...prev, newUser]);
      setIsSubmitting(false);
      setIsAddDialogOpen(false);

      toast.success(`${newUser.name} has been added successfully.`, {
        description: "User Added",
      });
    }, 1000);
  };

  // Submit edit form
  const handleEditSubmit = () => {
    setIsSubmitting(true);

    // Validate form
    if (!formData.name || !formData.email) {
      toast.error("Please fill in all required fields", {
        description: "Validation Error",
      });
      setIsSubmitting(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address", {
        description: "Invalid Email",
      });
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === currentUser?.id
            ? {
                ...user,
                name: formData.name!,
                email: formData.email!,
                phone: formData.phone || "",
                role: (formData.role as "guest" | "admin" | "staff") || "guest",
                status:
                  (formData.status as "active" | "inactive" | "blocked") ||
                  "active",
              }
            : user
        )
      );
      setIsSubmitting(false);
      setIsEditDialogOpen(false);

      toast.success(`${formData.name} has been updated successfully.`, {
        description: "User Updated",
      });
    }, 1000);
  };

  // Submit delete
  const handleDeleteSubmit = () => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setUsers((prev) => prev.filter((user) => user.id !== currentUser?.id));
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);

      toast.success(`${currentUser?.name} has been deleted successfully.`, {
        description: "User Deleted",
      });
    }, 1000);
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "inactive":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "blocked":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get role badge color
  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "staff":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "guest":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Manage Users</CardTitle>
            <CardDescription>
              Add, edit, or remove users from the system
            </CardDescription>
          </div>
          <Button disabled onClick={handleAddUser} className="sm:self-end">
            <Plus className="mr-2 h-4 w-4" /> Add New User
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
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
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reservations</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.reservations}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditUser(user)}
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteUser(user)}
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
                    <Badge variant="secondary" className="text-xs ml-1">
                      Terminar en Sprint #4 ✅
                    </Badge>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Add User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Enter the details for the new user.
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
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select
                value={formData.role || "guest"}
                onValueChange={(value) => handleSelectChange("role", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="guest">Guest</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={formData.status || "active"}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update the details for this user.
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
              <Label htmlFor="edit-email" className="text-right">
                Email
              </Label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                value={formData.email || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-phone" className="text-right">
                Phone
              </Label>
              <Input
                id="edit-phone"
                name="phone"
                value={formData.phone || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-role" className="text-right">
                Role
              </Label>
              <Select
                value={formData.role || "guest"}
                onValueChange={(value) => handleSelectChange("role", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="guest">Guest</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right">
                Status
              </Label>
              <Select
                value={formData.status || "active"}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
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

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {currentUser?.name}? This action
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
              {isSubmitting ? "Deleting..." : "Delete User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
