import { GiAxeSwing } from "react-icons/gi";
import { Suspense } from "react";
import Link from "next/link";

import { AdminRoleEditForm } from "./admin-role-edit-form";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { rolesLabel } from "@/types/full-database.types";
import { runQuery } from "@/utils/supabase-run";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function MyAdmin() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <GiAxeSwing size={36} />
        <h3 className="scroll-m-20 sm:text-3xl text-2xl font-semibold tracking-tight font-headings">Users</h3>
      </div>
      <Suspense>
        <Users />
      </Suspense>
    </div>
  );
}

async function Users() {
  const users = await getUsers();
  if (users.isErr()) return <p className="text-center text-lg text-muted-foreground">Error getting users.</p>;
  if (users.value.length === 0) {
    return <p className="text-center text-lg text-muted-foreground">No users found.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.value.map((user, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>
              {user.name} ({user.username})
            </CardTitle>
            <CardDescription>{rolesLabel.find((val) => val.value === user.roles?.role)?.label}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="default">
                  View User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {user.name} ({user.username})
                  </DialogTitle>
                  {user.roles.role === "admin" && (
                    <DialogDescription>NOTE: You cannot edit an admin.</DialogDescription>
                  )}
                </DialogHeader>
                <div className="flex flex-row gap-2 mb-2">
                  <Button asChild size="sm" variant="secondary" className="w-full">
                    <Link href={`/players/${user.username}`} target="_blank">
                      Player Profile
                    </Link>
                  </Button>
                  {(user.roles.role === "dm" || user.roles.role === "admin") && (
                    <Button asChild size="sm" variant="secondary" className="w-full">
                      <Link href={`/dms/${user.username}`} target="_blank">
                        DM Profile
                      </Link>
                    </Button>
                  )}
                </div>
                <div className="grid xs:grid-cols-2 grod-cols-1 gap-4 mb-2">
                  <div className="space-y-1">
                    <p className="text-lg font-normal tracking-wide">Display Name</p>
                    <p className="text-sm text-muted-foreground font-quotes uppercase">{user.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-md font-medium">Username</p>
                    <p className="text-sm text-muted-foreground font-quotes uppercase">@{user.username}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-md font-medium">K—Number</p>
                    <p className="text-sm text-muted-foreground font-quotes uppercase">
                      {user.knumber ?? "No K—Number"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-md font-medium">Email</p>
                    <p className="text-sm text-muted-foreground font-quotes uppercase">{user.email}</p>
                  </div>
                </div>
                <AdminRoleEditForm role={user.roles} />
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

const getUsers = () => runQuery((supabase) => supabase.from("users").select("*, roles!inner(*)"));
