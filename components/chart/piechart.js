import React from "react";
import { PieChart, Pie, Legend, ResponsiveContainer } from "recharts";

const PieChartComp = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          dataKey="count"
          startAngle={360}
          endAngle={0}
          data={data}
          outerRadius={80}
          label
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default PieChartComp
