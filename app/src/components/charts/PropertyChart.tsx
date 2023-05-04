import React from "react";
import ReactEcharts from "echarts-for-react";
import { DateTime } from "luxon";
import type { PropertyUpdates } from "@prisma/client";

interface Props {
  updates: PropertyUpdates[];
}

const PropertyChart = ({ updates }: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const dates: string[] =
    updates?.map((update) =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      DateTime.fromISO(update.createdAt.toString()).toLocaleString(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        DateTime.DATE_SHORT
      )
    ) || [];
  const values = updates?.map((update) => update.price) || [];
  const option = {
    xAxis: {
      type: "category",
      data: [...dates],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [...values],
        type: "line",
      },
    ],
    tooltip: {
      trigger: "axis",
    },
  };
  return <ReactEcharts option={option} />;
};

export default PropertyChart;
