"use client";

import * as React from "react";
import { useState } from "react";
import { Target, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { createRoom } from "@/app/actions/rooms";
import { createRoom } from "@/lib/api-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CreateRoomForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState({
    name: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {
      name: "",
    };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Room name is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const room = await createRoom(formData.name, formData.description);
      console.log(room);

      //   console.log(room);
      if (room.success && room.data) {
        toast("room created");
        console.log(room);

        router.push(`/rooms/${room.data.code}`);
        setSubmitSuccess(true);
      } else {
        toast("Something went wrong! check your network and retry later ;)");
      }

      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({ name: "", description: "" });
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error creating room:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-red-950/20 to-gray-950 flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl border-red-900/20 shadow-2xl shadow-red-900/10">
        <CardHeader className="space-y-1 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
              <Target className="w-7 h-7 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold">
              Create New Room
            </CardTitle>
          </div>
          <CardDescription className="text-base">
            Set up a new room for tracking most wanted individuals. Room name is
            required.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-base font-medium flex items-center gap-2"
              >
                <User className="w-4 h-4 text-red-600" />
                Room Name *
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter room name"
                value={formData.name}
                onChange={handleChange}
                className={`h-12 ${errors.name ? "border-red-500" : ""}`}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-base font-medium flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-red-600" />
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter room description (optional)"
                value={formData.description}
                onChange={handleChange}
                className="min-h-[120px]"
              />
              <p className="text-sm text-muted-foreground">
                Provide details about the purpose or focus of this room
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                setFormData({ name: "", description: "" });
                setErrors({ name: "" });
              }}
              disabled={isSubmitting}
            >
              Clear
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-red-600 hover:bg-red-700"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Creating..."
                : submitSuccess
                ? "✓ Created!"
                : "Create Room"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
