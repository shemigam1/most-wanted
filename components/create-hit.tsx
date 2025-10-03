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
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { createHit } from "@/app/actions/hit";

export default function CreateHit({
  onFormSubmit,
  roomId,
}: {
  onFormSubmit: () => void;
  roomId: string;
}) {
  const [formData, setFormData] = useState({
    name: "",
    offense: "",
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
      const data = { ...formData, roomId };
      const newHit = await createHit(data);
      console.log(newHit, "new hit");

      console.log("Room created:", formData);
      setSubmitSuccess(true);

      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({ name: "", offense: "" });
        setSubmitSuccess(false);
      }, 500);
      onFormSubmit();
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
    <ScrollArea>
      <Card className="w-full max-w-2xl border-red-900/20 shadow-2xl shadow-red-900/10">
        <CardHeader className="space-y-1 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
              <Target className="w-7 h-7 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold">Create A Hit</CardTitle>
          </div>
          <CardDescription className="text-base">
            We are not liable for your safety if e no work.
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
                Target Name *
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
                htmlFor="offense"
                className="text-base font-medium flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-red-600" />
                Offense
              </Label>
              <Textarea
                id="offense"
                name="offense"
                placeholder="why do you want to kill the egbon? (optional)"
                value={formData.offense}
                onChange={handleChange}
                className="min-h-[120px]"
              />
              <p className="text-sm text-muted-foreground">
                Provide as much details of your grievances as possible.
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                setFormData({ name: "", offense: "" });
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
                : "Create Hit"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </ScrollArea>
  );
}
