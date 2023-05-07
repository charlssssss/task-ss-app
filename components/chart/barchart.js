import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const BarChartComp = ({ data }) => {
  console.log("asdadasdas", data)
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="category_name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="task_count" name="Task Count" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default BarChartComp
