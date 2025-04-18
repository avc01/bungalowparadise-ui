import { Card } from "@/components/ui/card";
import { User } from "lucide-react";

export default function LandingBodyPage() {
  return (
    <main className="flex-1 bg-background text-foreground">
      {/* === Hero Section === */}
      <section className="relative h-[900px] overflow-hidden">
        <div
          className="absolute inset-0 w-screen h-full bg-cover bg-center"
          style={{
            backgroundImage: "url('/hotel-landpage.jpg?height=500&width=1200')",
          }}
        />
        {/* <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-background/80 z-10" /> */}
        <div className="relative z-20 flex h-full items-center justify-center">
          <h1
            className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-white text-center drop-shadow-2xl transition-opacity duration-700 animate-fade-in"
            style={{ textShadow: "2px 2px 6px rgba(0, 0, 0, 0.8)" }}
          >
            Encuentra Tu Escapada Perfecta
          </h1>
        </div>
      </section>

      {/* === Why Us Section === */}
      <section className="bg-muted py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-6 text-foreground">
                ¿Por qué elegir Bungalow Paradise?
              </h2>
              <ul className="space-y-6">
                {[
                  {
                    title: "Mejor Precio Garantizado",
                    desc: "¿Encontró un precio más bajo? Lo igualaremos y le daremos un 10 % de descuento adicional.",
                  },
                  {
                    title: "Cancelación Gratuita",
                    desc: "Solo aplica con 24 horas de anterioridad.",
                  },
                  {
                    title: "Atención al cliente 24/7",
                    desc: "Nuestro equipo de atención al cliente está disponible las 24 horas del día para ayudarle.",
                  },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="rounded-full bg-primary p-2 mt-1 shadow">
                      <svg
                        className="h-4 w-4 text-primary-foreground"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        viewBox="0 0 24 24"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <img
                src="/why-us.jpg?height=400&width=600"
                alt="Luxury hotel room"
                className="rounded-xl shadow-xl ring-1 ring/30"
              />
            </div>
          </div>
        </div>
      </section>

      {/* === Testimonials === */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-10">
            Lo que dicen nuestros invitados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => {
              const data = [
                {
                  name: "Sarah Johnson",
                  location: "Nueva York",
                  quote:
                    "La mejor experiencia de reserva de hotel que he tenido. El personal fue increíblemente útil y la habitación superó mis expectativas.",
                },
                {
                  name: "Michael Chen",
                  location: "San Francisco",
                  quote:
                    "Bungalow Paradise hizo que nuestra luna de miel fuera perfecta. El resort que nos recomendaron fue absolutamente impresionante y exactamente lo que queríamos.",
                },
                {
                  name: "Emma Williams",
                  location: "Londres",
                  quote:
                    "He utilizado muchos sitios de reservas de hoteles, pero ninguno se compara con el servicio personalizado y la atención al detalle que Bungalow Paradise ofrece.",
                },
              ][index];

              return (
                <Card
                  key={index}
                  className="text-center p-6 border border-border bg-card shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-accent p-2 shadow-sm">
                      <User className="h-8 w-8 text-accent-foreground" />
                    </div>
                  </div>
                  <p className="italic mb-4">"{data.quote}"</p>
                  <p className="font-semibold">{data.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {data.location}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
