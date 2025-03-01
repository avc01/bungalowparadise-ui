import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const mockRooms = [
  { id: 1, name: "Standard Room", type: "standard", price: 100, image: "/placeholder.svg?height=200&width=300" },
  { id: 2, name: "Deluxe Room", type: "deluxe", price: 150, image: "/placeholder.svg?height=200&width=300" },
  { id: 3, name: "Suite", type: "suite", price: 250, image: "/placeholder.svg?height=200&width=300" },
  { id: 4, name: "Family Room", type: "standard", price: 180, image: "/placeholder.svg?height=200&width=300" },
  { id: 5, name: "Executive Suite", type: "suite", price: 300, image: "/placeholder.svg?height=200&width=300" },
  { id: 6, name: "Ocean View Room", type: "deluxe", price: 200, image: "/placeholder.svg?height=200&width=300" },
]

export default function RoomResults() {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Available Rooms</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockRooms.map((room) => (
          <Card key={room.id}>
            <CardHeader>
              <CardTitle>{room.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={room.image || "/placeholder.svg"}
                alt={room.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <p className="text-muted-foreground">Type: {room.type}</p>
              <p className="font-bold text-lg">${room.price} / night</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Book Now</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}