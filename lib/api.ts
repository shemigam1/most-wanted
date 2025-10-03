import type { LoginFormData, SignupFormData } from "./validation";
// import { v2 } from "cloudinary";

export interface Room {
  id: string;
  name: string;
  description?: string | null;
  code?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// export class ApiError extends Error {
//   constructor(
//     message: string,
//     public status: number,
//     public response?: unknown
//   ) {
//     super(message);
//     this.name = "ApiError";
//   }
// }

// // async function apiRequest<T>(
// //   endpoint: string,
// //   options: RequestInit = {}
// // ): Promise<ApiResponse<T>> {
// //   const url = `${API_BASE_URL}${endpoint}`;

// //   const defaultHeaders = {
// //     "Content-Type": "application/json",
// //   };

// //   const config: RequestInit = {
// //     ...options,
// //     headers: {
// //       ...defaultHeaders,
// //       ...options.headers,
// //     },
// //   };

// //   try {
// //     const response = await fetch(url, config);
// //     const data = await response.json();
// //     // console.log(data);

// //     if (!response.ok) {
// //       throw new ApiError(
// //         data.message || `HTTP error! status: ${response.status}`,
// //         response.status,
// //         data
// //       );
// //     }

// //     return {
// //       success: true,
// //       data,
// //     };
// //   } catch (error) {
// //     if (error instanceof ApiError) {
// //       return {
// //         success: false,
// //         error: error.message,
// //       };
// //     }

// //     return {
// //       success: false,
// //       error: "Network error. Please check your connection.",
// //     };
// //   }
// // }

// export async function loginUser(
//   credentials: LoginFormData
// ): Promise<ApiResponse<AuthResponse>> {
//   return apiRequest<AuthResponse>("/auth/login", {
//     method: "POST",
//     body: JSON.stringify(credentials),
//   });
// }

// export async function signupUser(
//   userData: SignupFormData
// ): Promise<ApiResponse<AuthResponse>> {
//   const { confirmPassword, ...data } = userData;
//   return apiRequest<AuthResponse>("/auth/signup", {
//     method: "POST",
//     body: JSON.stringify(data),
//   });
// }

// export async function logoutUser(): Promise<ApiResponse<AuthResponse>> {
//   return apiRequest("/auth/logout", {
//     method: "POST",
//   });
// }

// export interface UploadResponse {
//   id: string;
//   name: string;
//   size: number;
//   uploadedAt: number;
//   url?: string;
// }

// export interface PresignResponse {
//   data: Record<string, string>;
//   fileId: string;
//   headers?: Record<string, string>;
// }

// export interface SaveMetadataRequest {
//   id: string;
//   name: string;
//   size: number;
//   contentType: string;
//   url?: string;
// }

// export async function getPresignedUrl(input: {
//   fileName: string;
//   fileType: string;
//   fileSize: number;
// }): Promise<ApiResponse<PresignResponse>> {
//   const token = localStorage.getItem("auth_token");
//   // console.log(input);
//   const data = {
//     fileName: input.fileName,
//     fileType: input.fileType,
//     fileSize: input.fileSize,
//   };

//   return apiRequest<PresignResponse>("/file/signature", {
//     method: "POST",
//     headers: {
//       Authorization: token ? `Bearer ${token}` : "",
//     },
//     body: JSON.stringify(data),
//   });
// }

// export async function saveFileMetadata(
//   body: SaveMetadataRequest
// ): Promise<ApiResponse<UploadResponse>> {
//   const token = localStorage.getItem("auth_token");
//   // console.log(body);

//   const data = {
//     fileName: body.name,
//     fileType: body.contentType,
//     fileSize: body.size,
//     fileUrl: body.url,
//   };

//   return apiRequest<UploadResponse>("/file/metadata", {
//     method: "POST",
//     headers: {
//       Authorization: token ? `Bearer ${token}` : "",
//     },
//     body: JSON.stringify(data),
//   });
// }

// // Upload bytes to cloud storage presigned URL with progress
// export const uploadToPresignedUrl = async (
//   file: File,
//   // fileName: string,
//   signature: string,
//   apiKey: string,
//   apiSecret: string,
//   policy: string,
//   timestamp: string,
//   headers?: Record<string, string>
// ): Promise<
//   ApiResponse<{
//     id: string;
//     name: string;
//     size: number;
//     uploadedAt: number;
//     url?: string;
//   }>
// > => {
//   const allHeaders: Record<string, string> = {
//     "Content-Type": file.type || "application/octet-stream",
//     ...headers,
//   };

//   // return v2.uploader
//   //   .upload(file.name, {
//   //     upload_preset: "3d_bandit",
//   //     signature,
//   //     api_key: apiKey,
//   //     api_secret: apiSecret,
//   //     policy,
//   //     file,
//   //   })
//   // console.log(res);
//   const uploadUrl = `https://api.cloudinary.com/v1_1/dylca3a64/auto/upload`;

//   const formData = new FormData();

//   // 2. Append all fields to the FormData
//   formData.append("signature", signature);
//   formData.append("upload_preset", "3d_bandit");
//   formData.append("api_key", apiKey);
//   // formData.append("api_secret", apiSecret);
//   formData.append("timestamp", timestamp);
//   formData.append("file", file);

//   return (
//     fetch(uploadUrl, {
//       method: "POST",
//       // headers: allHeaders,
//       body: formData,
//     })
//       // .then((response) => {
//       //   console.log(response, "cloudinary response");
//       //   if (!response.ok) {
//       //     return {
//       //       success: false,
//       //       error: `Upload failed (${response.status})`,
//       //     } as const;
//       //     response.json();
//       //   }
//       // })
//       // .then((data) => {
//       //   console.log(data, "cloudinary upload result");
//       //   // The file URL is in data.secure_url
//       //   return { success: true, url: data }; // Return the URL
//       // })
//       .then((response) => response.json()) // First, parse the JSON from the response
//       .then((data) => {
//         console.log(data, "cloudinary upload result");
//         if (!data) {
//           return {
//             success: false,
//             error: `Upload failed (${401})`,
//           } as const;
//         }
//         // The file URL is in data.secure_url
//         return { success: true, data } as const; // Return the URL
//       })
//       .catch((error) => {
//         return {
//           success: false,
//           error: `Network error during upload: ${error.message}`,
//         } as const;
//       })
//   );
// };
