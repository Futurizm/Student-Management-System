"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface CourseNumber {
  id: number;
  name: string;
}

export default function NewGroupPage() {
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [courseNumberId, setCourseNumberId] = useState<string>("");
  const [courseNumbers, setCourseNumbers] = useState<CourseNumber[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchCourseNumbers();
  }, []);

  const fetchCourseNumbers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");
      const response = await fetch("http://localhost:5000/api/courses", {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch course numbers");
      const data: CourseNumber[] = await response.json();
      setCourseNumbers(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");

      const response = await fetch("http://localhost:5000/api/groups", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ name, specialty, startDate, endDate, courseNumberId: Number(courseNumberId) }),
      });

      if (!response.ok) throw new Error("Failed to create group");
      router.push("/dashboard/groups");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Добавить группу</h1>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Название группы</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="specialty">Специальность</Label>
            <Input id="specialty" value={specialty} onChange={(e) => setSpecialty(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="startDate">Дата начала</Label>
            <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="endDate">Дата окончания</Label>
            <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="courseNumberId">Курс</Label>
            <Select onValueChange={setCourseNumberId} required>
              <SelectTrigger>
                <SelectValue placeholder="Выберите курс" />
              </SelectTrigger>
              <SelectContent>
                {courseNumbers.map((cn) => (
                  <SelectItem key={cn.id} value={cn.id.toString()}>{cn.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">Создать группу</Button>
        </form>
      </div>
    </DashboardLayout>
  );
}