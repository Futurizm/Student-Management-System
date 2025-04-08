"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { TeacherTable } from "@/components/teacher-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function TeachersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Преподаватели</h1>
          <Link href="/dashboard/teachers/new">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <UserPlus className="mr-2 h-4 w-4" />
              Добавить преподавателя
            </Button>
          </Link>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <Input
              placeholder="Поиск преподавателей..."
              className="max-w-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="outline">
              <Search className="mr-2 h-4 w-4" />
              Поиск
            </Button>
          </div>
        </div>

        <TeacherTable />
      </div>
    </DashboardLayout>
  );
}