import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const colors = ['#8884d8', '#82ca9d', '#ffc658'];
const BarChartComp = ({ data }) => {
  console.log("asdadasdas", data)
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="category_name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="task_count" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default BarChartComp
