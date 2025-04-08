"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Group {
  id: number;
  name: string;
  specialty: string;
  startDate: string;
  endDate: string;
  courseNumberId: number; // Используем courseNumberId
  courseNumber: { id: number; name: string }; // Добавляем для getGroups
}

interface CourseNumber {
  id: number;
  name: string;
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [courseNumbers, setCourseNumbers] = useState<CourseNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGroupsData();
    fetchCoursesData();
  }, []);

  const fetchGroupsData = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token);
      if (!token) throw new Error("No token found. Please log in.");

      const response = await fetch("http://localhost:5000/api/groups", {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      console.log("Groups Response Status:", response.status);
      if (!response.ok) throw new Error(`Failed to fetch groups: ${response.statusText}`);

      const data: Group[] = await response.json();
      setGroups(data);
    } catch (err: any) {
      console.error("Error fetching groups:", err.message);
      setError(err.message || "Failed to load groups");
    } finally {
      setLoading(false);
    }
  };

  const fetchCoursesData = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token (Courses):", token);
      if (!token) throw new Error("No token found. Please log in.");

      const response = await fetch("http://localhost:5000/api/courses", {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      console.log("Courses Response Status:", response.status);
      if (!response.ok) throw new Error(`Failed to fetch courses: ${response.statusText}`);

      const data: CourseNumber[] = await response.json();
      setCourseNumbers(data);
    } catch (err: any) {
      console.error("Error fetching courses:", err.message);
      setError(err.message || "Failed to load courses");
    }
  };

  if (loading) return <DashboardLayout><p>Loading groups...</p></DashboardLayout>;

  if (error) return (
    <DashboardLayout>
      <p>{error}</p>
      <Button onClick={() => { fetchGroupsData(); fetchCoursesData(); }}>Retry</Button>
    </DashboardLayout>
  );

  const groupsWithCourseNames = groups.map((group) => ({
    ...group,
    courseName: group.courseNumber?.name || courseNumbers.find((course) => course.id === group.courseNumberId)?.name || "N/A",
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Группы</h1>
          <Button asChild><Link href="/dashboard/groups/new">Добавить группу</Link></Button>
        </div>
        <Card>
          <CardHeader><CardTitle>Список групп</CardTitle></CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Название</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Специальность</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Курс</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата начала</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата окончания</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {groupsWithCourseNames.map((group) => (
                    <tr key={group.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{group.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{group.specialty}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{group.courseName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(group.startDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(group.endDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Link href={`/dashboard/groups/${group.id}`}><Button variant="ghost">Просмотр</Button></Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}