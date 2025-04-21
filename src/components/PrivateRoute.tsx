// src/components/PrivateRoute.tsx
import { useAuth } from "@/context/AuthContext";
import { JSX } from "react";
import { Navigate } from "react-router-dom";

type Props = {
  children: JSX.Element;
  adminOnly?: boolean; // 🔒 si es true, solo Admins pueden acceder
};

export default function PrivateRoute({ children, adminOnly = false }: Props) {
  const { user } = useAuth();

  // if (loading) {
  //   return <div className="text-center mt-10">Cargando...</div>;
  // }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (adminOnly && user.role !== "Admin") {
    return (
      <div className="text-center text-red-600 mt-10">
        Acceso denegado: Solo administradores
      </div>
    );
  }

  return children;
}
