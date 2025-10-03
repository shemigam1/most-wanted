import { Navbar } from "@/components/navbar";
import { RoomSkeleton } from "@/components/room-skeleton";
import { getCurrentUser } from "@/lib/dal";
// import { userAgent } from "next/server";

export default async function RoomsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  console.log(currentUser, "user in the layout");

  return <div className="">{children}</div>;
}
