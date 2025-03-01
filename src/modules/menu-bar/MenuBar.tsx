import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { Bed } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Outlet } from "react-router-dom";

export default function MenuBar() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col flex-grow">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="w-full flex h-16 items-center">
            <div className="mr-4 flex items-center gap-2">
              <Bed className="h-6 w-6" />
              <span className="text-xl font-bold">Bungalow Paradise</span>
            </div>
            <Menubar className="ml-auto rounded-none border-0 bg-transparent">
              <MenubarMenu>
                <MenubarTrigger className="font-medium">
                  Página de Inicio
                </MenubarTrigger>
              </MenubarMenu>
            </Menubar>
            <div className="ml-4 flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Iniciar Sesión</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Inicie sesión en su cuenta</DialogTitle>
                    <DialogDescription>
                      Ingresa tus credenciales para acceder a tu cuenta
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Contraseña</Label>
                      <Input id="password" type="password" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Iniciar Sesión</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Crear Cuenta</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Crear Cuenta</DialogTitle>
                    <DialogDescription>
                      Únete a Bungalow Paradise para reservar las vacaciones de
                      tus sueños
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="firstName">Nombre</Label>
                        <Input id="firstName" />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Apellido</Label>
                        <Input id="lastName" />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="signupEmail">Email</Label>
                      <Input
                        id="signupEmail"
                        type="email"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="signupPassword">Contraseña</Label>
                      <Input id="signupPassword" type="password" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="confirmPassword">
                        Confirmar Contraseña
                      </Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Crear Cuenta</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>

        <main className="flex-grow">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
