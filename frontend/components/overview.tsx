"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    name: "Jan",
    total: 580,
  },
  {
    name: "Feb",
    total: 690,
  },
  {
    name: "Mar",
    total: 1100,
  },
  {
    name: "Apr",
    total: 1200,
  },
  {
    name: "May",
    total: 1380,
  },
  {
    name: "Jun",
    total: 1500,
  },
  {
    name: "Jul",
    total: 1200,
  },
  {
    name: "Aug",
    total: 1400,
  },
  {
    name: "Sep",
    total: 1700,
  },
  {
    name: "Oct",
    total: 1890,
  },
  {
    name: "Nov",
    total: 2190,
  },
  {
    name: "Dec",
    total: 2490,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-blue-500" />
      </BarChart>
    </ResponsiveContainer>
  )
}

