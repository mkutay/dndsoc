"use client";

import { Settings, Edit } from "lucide-react";
import { useState } from "react";

import { UserEditForm } from "./user-edit-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface MyProfileProps {
  user: {
    username: string;
    name: string;
    knumber: string | null;
    auth_user_uuid: string;
    email: string;
  };
}

export function MyProfile({ user }: MyProfileProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return <UserEditForm user={user} onCancel={() => setIsEditing(false)} onSuccess={() => setIsEditing(false)} />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings size={24} className="mb-[2px]" />
          Account
        </CardTitle>
        <CardDescription>Your account information.</CardDescription>
      </CardHeader>
      <CardContent className="grid xs:grid-cols-2 grod-cols-1 gap-4">
        <div className="space-y-1">
          <p className="text-lg font-normal tracking-wide">Display Name</p>
          <p className="text-sm text-muted-foreground font-quotes uppercase">{user.name}</p>
        </div>
        <div className="space-y-1">
          <p className="text-md font-medium">Username</p>
          <p className="text-sm text-muted-foreground font-quotes uppercase">@{user.username}</p>
        </div>
        <div className="space-y-1">
          <p className="text-md font-medium">K–Number</p>
          <p className="text-sm text-muted-foreground font-quotes uppercase">{user.knumber}</p>
        </div>
        <div className="space-y-1">
          <p className="text-md font-medium">Email</p>
          <p className="text-sm text-muted-foreground font-quotes uppercase">{user.email}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => setIsEditing(true)} variant="outline">
          <Edit size={16} className="mr-2" />
          Edit Profile
        </Button>
      </CardFooter>
    </Card>
  );
}
