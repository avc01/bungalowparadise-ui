// src/components/PrivateRoute.tsx
import { useAuth } from "@/context/AuthContext";
import { JSX } from "react";
import { Navigate } from "react-router-dom";

type Props = {
  children: JSX.Element;
};

export default function PrivateRoute({ children }: Props) {
  const { user, loading } = useAuth();

  // if (loading) {
  //   return <div className="text-center mt-10">Cargando...</div>;
  // }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
