import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center px-4">
      <h1 className="text-4xl font-bold mb-4">404 - Página no encontrada</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Lo sentimos, la página que estás buscando no existe o ha sido movida.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild>
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            Ir a la página de inicio
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="#" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a la página anterior
          </Link>
        </Button>
      </div>
    </div>
  )
}
