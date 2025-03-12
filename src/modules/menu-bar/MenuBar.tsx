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
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import api from "@/lib/api";
import { AxiosError } from "axios";

export default function MenuBar() {
  const { login, logout, user } = useAuth();

  const [signupDialogOpen, setSignupDialogOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [tokenDialogOpen, setTokenDialogOpen] = useState(false);

  // Login Form Fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // SignUp Form Fields
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupLastName, setSignupLastName] = useState("");
  const [signupError, setSignupError] = useState("");

  // Reset Mail Form Fields
  const [resetEmail, setResetEmail] = useState("");
  const [resetMsg, setResetMsg] = useState("");
  const [resetError, setResetError] = useState("");

  // Reset Password Form Fields
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [tokenResetError, setTokenResetError] = useState("");
  const [tokenResetSuccess, setTokenResetSuccess] = useState("");

  const handleLogin = async () => {
    setLoginError("");
    try {
      await login(loginEmail, loginPassword);
      setLoginDialogOpen(false);

      // Reset form fields
      setLoginEmail("");
      setLoginPassword("");
      setLoginError("");
    } catch (err) {
      var exception = err as AxiosError;
      setLoginError(`Error al iniciar sesión: ${exception.response?.data}`);
    }    
  };

  const handleSignup = async () => {
    setSignupError("");
    if (signupPassword !== signupConfirmPassword) {
      setSignupError("Las contraseñas no coinciden");
      return;
    }

    try {
      await api.post("/api/auth/register", {
        email: signupEmail,
        password: signupPassword,
        phone: signupPhone,
        name: signupName,
        lastname: signupLastName,
      });
      setSignupDialogOpen(false);
      alert("Cuenta creada correctamente. Ahora puedes iniciar sesión.");

      // Reset form fields
      setSignupEmail("")
      setSignupPassword("")
      setSignupConfirmPassword("")
      setSignupPhone("")
      setSignupName("")
      setSignupLastName("")
      setSignupError("")
    } catch (err) {
      var exception = err as AxiosError;
      setSignupError(`Error al crear cuenta: ${exception.response?.data}`);
    }
  };

  const handleRequestPasswordReset = async () => {
    setResetMsg("");
    setResetError("");
    try {
      const response = await api.post(
        "/api/Auth/request-password-reset",
        resetEmail
      );
      setResetMsg(`${response.data}`);
      setTimeout(() => {
        setResetDialogOpen(false);
        setTokenDialogOpen(true);
      }, 4000);

      // Reset form fields
      setResetEmail("");
      setResetMsg("");
      setResetError("");
    } catch (err) {
      setResetError("Error al enviar el correo.");
    }
  };

  const handleResetPassword = async () => {
    setTokenResetError("");
    setTokenResetSuccess("");

    if (newPassword !== confirmNewPassword) {
      setTokenResetError("Las contraseñas no coinciden");
      return;
    }

    try {
      await api.post("/api/auth/reset-password", {
        token: resetToken,
        newPassword: newPassword,
      });
      setTokenResetSuccess("Contraseña actualizada correctamente.");
      setTimeout(() => {
        setTokenDialogOpen(false);
      }, 3000);

      // Reset form fields
      setResetToken("")
      setNewPassword("")
      setConfirmNewPassword("")
      setTokenResetError("")
      setTokenResetSuccess("")
    } catch (err) {
      setTokenResetError("Token inválido o expirado.");
    }
  };

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
            {user ? (
              <div className="ml-4 flex items-center gap-2">
                <span className="text-sm">Hola, {user.email}</span>
                <Button variant="outline" onClick={logout}>
                  Cerrar Sesión
                </Button>
              </div>
            ) : (
              <div className="ml-4 flex items-center gap-2">
                <Dialog
                  open={loginDialogOpen}
                  onOpenChange={setLoginDialogOpen}
                >
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
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="password">Contraseña</Label>
                        <Input
                          id="password"
                          type="password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" onClick={async () => handleLogin()}>
                        Iniciar Sesión
                      </Button>
                      <Button
                        variant="link"
                        className="text-sm px-0"
                        onClick={() => {
                          setLoginDialogOpen(false);
                          setResetDialogOpen(true);
                        }}
                      >
                        ¿Olvidaste tu contraseña?
                      </Button>
                    </DialogFooter>
                    {loginError && (
                      <p className="text-sm text-red-500">{loginError}</p>
                    )}
                  </DialogContent>
                </Dialog>

                <Dialog
                  open={resetDialogOpen}
                  onOpenChange={setResetDialogOpen}
                >
                  <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                      <DialogTitle>Recuperar Contraseña</DialogTitle>
                      <DialogDescription>
                        Ingresa tu correo electrónico y te enviaremos un código
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="resetEmail">Email</Label>
                        <Input
                          id="resetEmail"
                          type="email"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        onClick={async () => handleRequestPasswordReset()}
                      >
                        Enviar Código
                      </Button>
                      <Button
                        variant="link"
                        className="text-sm px-0 text-center"
                        onClick={() => {
                          setResetDialogOpen(false);
                          setTokenDialogOpen(true); // ✅ skip to token form
                        }}
                      >
                        Ya tengo un código
                      </Button>
                    </DialogFooter>
                    {resetMsg && (
                      <p className="text-sm text-green-600">{resetMsg}</p>
                    )}
                    {resetError && (
                      <p className="text-sm text-red-600">{resetError}</p>
                    )}
                  </DialogContent>
                </Dialog>

                <Dialog
                  open={tokenDialogOpen}
                  onOpenChange={setTokenDialogOpen}
                >
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Restablecer Contraseña</DialogTitle>
                      <DialogDescription>
                        Ingresa el código que recibiste por correo y tu nueva
                        contraseña
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="token">Código</Label>
                        <Input
                          id="token"
                          value={resetToken}
                          onChange={(e) => setResetToken(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="newPassword">Nueva Contraseña</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="confirmNewPassword">
                          Confirmar Contraseña
                        </Label>
                        <Input
                          id="confirmNewPassword"
                          type="password"
                          value={confirmNewPassword}
                          onChange={(e) =>
                            setConfirmNewPassword(e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button
                        type="button"
                        onClick={async () => handleResetPassword()}
                      >
                        Restablecer Contraseña
                      </Button>
                    </DialogFooter>

                    {tokenResetSuccess && (
                      <p className="text-green-600 text-sm">
                        {tokenResetSuccess}
                      </p>
                    )}
                    {tokenResetError && (
                      <p className="text-red-600 text-sm">{tokenResetError}</p>
                    )}
                  </DialogContent>
                </Dialog>

                <Dialog
                  open={signupDialogOpen}
                  onOpenChange={setSignupDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button>Crear Cuenta</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Crear Cuenta</DialogTitle>
                      <DialogDescription>
                        Únete a Bungalow Paradise para reservar las vacaciones
                        de tus sueños
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="firstName">Nombre</Label>
                          <Input
                            id="firstName"
                            type="text"
                            value={signupName}
                            onChange={(e) => setSignupName(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Apellido</Label>
                          <Input
                            id="lastName"
                            type="text"
                            value={signupLastName}
                            onChange={(e) => setSignupLastName(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="signupEmail">Email</Label>
                        <Input
                          id="signupEmail"
                          type="email"
                          placeholder="your@email.com"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="signupPhone">Phone</Label>
                        <Input
                          id="signupPhone"
                          type="tel"
                          placeholder="0000-0000"
                          value={signupPhone}
                          onChange={(e) => setSignupPhone(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="signupPassword">Contraseña</Label>
                        <Input
                          id="signupPassword"
                          type="password"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="confirmPassword">
                          Confirmar Contraseña
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={signupConfirmPassword}
                          onChange={(e) =>
                            setSignupConfirmPassword(e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        onClick={async () => handleSignup()}
                      >
                        Crear Cuenta
                      </Button>
                    </DialogFooter>
                    {signupError && (
                      <p className="text-sm text-red-500">{signupError}</p>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </header>

        <main className="flex-grow">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
