// import { redirect } from "next/navigation";
// import { getSession } from "@/lib/auth"; // Import from lib, don't define here
import RoomDataLoader from "@/components/room-loader";

export default async function RoomView({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  console.log("its here");

  return <RoomDataLoader code={code} />;
}
