import { fetchRoomData, getRoomByCode } from "@/app/actions/rooms";
import RoomClientComponent from "@/components/room";
import ErrorPage from "./error";
// import { getRoomByCode, getHitsByRoom } from "@/lib/api-client";
// import { getCurrentUser } from "@/lib/dal";

export default async function RoomDataLoader({ code }: { code: string }) {
  console.log("its here too");
  console.log(code, "room loader");

  const roomData = await getRoomByCode(code);
  console.log(roomData, "room data");
  // const user = await getCurrentUser();

  if (!roomData?.data || roomData.success === false) {
    console.log("no room");

    return <ErrorPage />;
  }

  const roomId = roomData.data.id;
  const data = await fetchRoomData(code, roomId);
  // const hitsResponse = await getHitsByRoom(roomData.data.id);
  // console.log(data, "roomdata");

  if (!data?.hitsResponse) {
    return <ErrorPage />;
  }

  const { roomResponse, hitsResponse, userId } = data;

  return (
    <RoomClientComponent
      roomData={roomResponse}
      hitsData={hitsResponse}
      code={code}
      userId={userId}
    />
  );
}
