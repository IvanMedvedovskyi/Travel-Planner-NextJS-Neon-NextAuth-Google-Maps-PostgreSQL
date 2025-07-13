import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function TripsPage() {
  const session = await auth();

  const trips = await prisma.trip.findMany({
    where: {
      userId: session?.user?.id,
    },
  });

  const sortedTrips = [...trips].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingTrips = sortedTrips.filter(
    (trip) => new Date(trip.startDate) >= today
  );

  if (!session)
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
        Please log in to view your trips.
      </div>
    );

  return (
    <div className="space-y-6 container mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Link href="/trips/new">
          <Button>New Trip</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome Back, {session.user?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            {trips.length === 0
              ? "No trips found."
              : `You have ${trips.length} ${
                  trips.length > 1 ? "trips" : "trip"
                } planned. ${
                  upcomingTrips.length > 0
                    ? `Here are your upcoming trips: ${upcomingTrips.length}`
                    : ""
                }`}
          </p>
        </CardContent>
      </Card>
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Recent Trips</h2>
        {trips.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col py-8 items-center justify-center">
              <h3 className="text-xl font-medium mb-2">No trips found.</h3>
              <p className="text-center mb-4 max-w-med">
                Start planning your adventures today!
              </p>
              <Link href="/trips/new">
                <Button variant="outline">Create a Trip</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedTrips.slice(0, 6).map((trip, key) => (
              <Link key={key} href={`/trips/${trip.id}`}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader className="line-clamp-1">{trip.title}</CardHeader>
                  <CardContent>
                    <p className="text-sm line-clamp-2 mb-2">
                      {trip.description}
                    </p>
                    <div className="text-sm">
                      {trip.startDate && trip.endDate
                        ? `${new Date(
                            trip.startDate
                          ).toLocaleDateString()} - ${new Date(
                            trip.endDate
                          ).toLocaleDateString()}`
                        : "No date"}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
