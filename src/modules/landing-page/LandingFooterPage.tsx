import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bed } from "lucide-react";

export default function LandingFooterPage() {
  return (
    <footer className="w-full border-t border-border bg-muted/40 text-foreground backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4 text-primary">
              <Bed className="h-6 w-6" />
              <span className="text-xl font-extrabold tracking-wide">
                Bungalow Paradise
              </span>
            </div>
            <p className="text-muted-foreground">
              Encuentra y reserva tu estancia perfecta con facilidad.
            </p>
          </div>

          {/* Compañía */}
          <div>
            <h3 className="font-semibold mb-4">Compañía</h3>
            <ul className="space-y-2 text-sm">
              {["Acerca de nosotros", "Carreras", "Blog", "Prensa"].map(
                (item, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-accent transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Soporte */}
          <div>
            <h3 className="font-semibold mb-4">Soporte</h3>
            <ul className="space-y-2 text-sm">
              {[
                "Centro de ayuda",
                "Contáctanos",
                "Política de privacidad",
                "Términos de servicio",
              ].map((item, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-accent transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Suscripción */}
          <div>
            <h3 className="font-semibold mb-4">Suscríbete</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Obtén ofertas exclusivas e inspiración para viajar.
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Tu correo electrónico"
                className="bg-background border-border"
              />
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Suscribirse
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Bungalow Paradise. Todos los
          derechos reservados.
        </div>
      </div>
    </footer>
  );
}
