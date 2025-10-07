// Helper functions to call API routes from client components

export type ApiResponse<T = any> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
  error?: string;
};
export interface Room {
  id: string;
  name: string;
  description?: string | null;
  code?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Auth APIs
export async function signIn(
  email: string,
  password: string
): Promise<ApiResponse> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
}

export async function signUp(
  username: string,
  email: string,
  password: string,
  confirmPassword: string
): Promise<ApiResponse> {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, confirmPassword }),
  });
  //   console.log(response.json(), "signup api res");

  return response.json();
}

export async function signOut(): Promise<ApiResponse> {
  const response = await fetch("/api/auth/signout", {
    method: "POST",
  });
  return response.json();
}

// Room APIs
export async function createRoom(
  name: string,
  description?: string | null
): Promise<ApiResponse<{ id: string; code: string; name: string }>> {
  const response = await fetch("/api/rooms/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, description }),
  });
  return response.json();
}

export async function getRoomByCode(
  code: string
): Promise<ApiResponse<{ id: string; code: string; name: string }>> {
  console.log(code, "api-client");

  const response = await fetch(`/api/rooms/${code}`);
  return response.json();
}

export async function deleteRoom(roomId: string): Promise<ApiResponse> {
  const response = await fetch(`/api/rooms/${roomId}`, {
    method: "DELETE",
  });
  return response.json();
}

// Hit APIs
export async function createHit(
  name: string,
  roomId: string,
  offense?: string | null
): Promise<ApiResponse> {
  const response = await fetch("/api/hits/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, offense, roomId }),
  });
  return response.json();
}

export async function deleteHit(hitId: string): Promise<ApiResponse> {
  const response = await fetch(`/api/hits/${hitId}`, {
    method: "DELETE",
  });
  return response.json();
}

export async function getHitsByRoom(roomId: string): Promise<ApiResponse> {
  const response = await fetch(`/api/hits/room/${roomId}`);
  return response.json();
}
