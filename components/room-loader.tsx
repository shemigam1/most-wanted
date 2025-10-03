import { fetchRoomData, getRoomByCode } from "@/app/actions/rooms";
import RoomClientComponent from "@/components/room";
import ErrorPage from "./error";

export default async function RoomDataLoader({ code }: { code: string }) {
  console.log("its here too");
  const roomData = await getRoomByCode(code);
  console.log(roomData, "room data");

  if (!roomData?.data || roomData.success === false) {
    console.log("no room");

    return <ErrorPage />;
  }

  const roomId = roomData.data.id;
  const data = await fetchRoomData(code, roomId);
  console.log(data, "roomdata");

  if (!data) {
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
