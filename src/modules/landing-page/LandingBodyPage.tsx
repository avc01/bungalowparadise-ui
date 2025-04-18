import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

export default function LandingBodyPage() {
  const images = [
    "/hotel-landpage.jpg",
    "/hotel-landpage2.jpg",
    "/hotel-landpage3.jpg",
  ];
  const [imageIndex, setImageIndex] = useState(0);
  const [testimonialGroup, setTestimonialGroup] = useState(0);

  const allTestimonials = [
    {
      name: "Sarah Johnson",
      location: "Nueva York",
      quote:
        "La mejor experiencia de reserva de hotel que he tenido.",
      avatar: "/persona1.jpg",
    },
    {
      name: "Michael Chen",
      location: "San Francisco",
      quote: "Bungalow Paradise hizo que nuestra luna de miel fuera perfecta.",
      avatar: "/persona2.jpg",
    },
    {
      name: "Emma Williams",
      location: "Londres",
      quote:
        "Ningún sitio se compara con el servicio personalizado que ofrecen.",
      avatar: "/persona3.jpg",
    },
    {
      name: "Carlos Méndez",
      location: "Costa Rica",
      quote: "Un verdadero paraíso. Volveré el próximo año sin dudarlo.",
      avatar: "/persona4.jpg",
    },
    {
      name: "Lina Ortega",
      location: "Bogotá",
      quote: "Atención al cliente impecable, y el lugar hermoso.",
      avatar: "/persona5.jpg",
    },
    {
      name: "David Lee",
      location: "Toronto",
      quote: "La vista desde la habitación era simplemente mágica.",
      avatar: "/persona6.jpg",
    },
  ];

  // Hero background rotator
  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Testimonial group rotator
  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialGroup((prev) => (prev + 1) % 2);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const testimonialsToShow = allTestimonials.slice(
    testimonialGroup * 3,
    testimonialGroup * 3 + 3
  );

  return (
    <main className="flex-1 bg-background text-foreground">
      {/* === Hero Section === */}
      <section className="relative h-[900px] overflow-hidden">
        {images.map((src, idx) => (
          <div
            key={src}
            className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ${
              idx === imageIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url('${src}')` }}
          />
        ))}
        <div className="relative z-20 flex h-full items-center justify-center">
          <h1
            className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-white text-center drop-shadow-2xl animate-fade-in"
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
                src="/why-us.jpg"
                alt="Luxury hotel room"
                className="rounded-xl shadow-xl ring-1 ring-border"
              />
            </div>
          </div>
        </div>
      </section>

      {/* === Testimonials Section === */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-10">
            Lo que dicen nuestros invitados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 transition-opacity duration-700">
            {testimonialsToShow.map((data, index) => (
              <Card
                key={index}
                className="text-center p-6 border-3 border-accent bg-card shadow-md hover:shadow-lg transition-shadow min-h-[340px] flex flex-col justify-between"
              >
                <div className="flex justify-center mb-4">
                  <img
                    src={data.avatar}
                    alt={data.name}
                    className="w-24 h-24 rounded-full object-cover border-2 shadow-sm"
                  />
                </div>

                <p className="italic mb-4">"{data.quote}"</p>
                <p className="font-semibold">{data.name}</p>
                <p className="text-sm text-muted-foreground">{data.location}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
