import React, { useState } from "react";
import { Dropdown, Menu } from "antd";
import { useGetStatisticsQuery } from "../../redux/apiSlices/homeSlice";
import LineChart from "./LineChart";
import {
  Marchant,
  People,
  Pending,
  SubscriptionManagement,
} from "../../components/common/Svg";
import OrderTable from "../../components/home/OrderTable";

const Home = () => {
  const items = [
    { label: "All", key: "all" },
    { label: "Today", key: "today" },
    { label: "Last 7 Days", key: "7d" },
    { label: "Last 30 Days", key: "30d" },
  ];

  // 🔹 default selected item (all)
  const [selectedKey, setSelectedKey] = useState("7d");
  const [selectedLabel, setSelectedLabel] = useState("Last 7 Days");

  // 🔹 when user clicks dropdown
  const handleMenuClick = (e) => {
    const selectedItem = items.find((item) => item.key === e.key);
    setSelectedKey(selectedItem.key); // backend key
    setSelectedLabel(selectedItem.label); // user label
  };

  // 🔹 API call with backend key
  const { data: statistics } = useGetStatisticsQuery({ range: selectedKey });

  const menu = <Menu items={items} onClick={handleMenuClick} />;

  return (
    <div className="p-2 md:p-4 space-y-4 md:space-y-6">
      <div className="flex flex-col xl:flex-row gap-10 rounded-lg">
        {/* Line Chart */}
        <div className="w-full xl:flex-1 border border-primary rounded-lg p-6">
          <LineChart />
        </div>

        {/* Stats Section */}
        <div className="w-full xl:w-1/3 border border-primary p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4 text-white">
            <h2 className="text-secondary mt-4 text-[24px] font-bold">
              Statistics
            </h2>

            {/* Dropdown */}
            <Dropdown overlay={menu} trigger={["click"]}>
              <button className="w-[150px] font-medium text-[14px] py-[12px] px-[16px] border border-primary text-secondary rounded-lg text-left flex justify-between items-center bg-white">
                {selectedLabel} <span className="ml-2">▼</span>
              </button>
            </Dropdown>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 gap-3 h-[240px]">
            <div className="bg-white border border-primary rounded-lg flex items-center justify-center">
              <div className="flex flex-col items-baseline">
                <h2 className="text-center text-[16px] font-semibold mb-1">
                  Total Customers
                </h2>
                <h3 className="text-secondary text-[24px] font-semibold flex items-center gap-3">
                  <Marchant className="w-[20px] h-[20px]" />
                  {statistics?.customers || 0}
                </h3>
              </div>
            </div>

            <div className="bg-white border border-primary rounded-lg flex items-center justify-center">
              <div className="flex flex-col items-baseline">
                <h2 className="text-center text-[16px] font-semibold mb-1">
                  Total Providers
                </h2>
                <h3 className="text-secondary text-[24px] font-semibold flex items-center gap-3">
                  <People className="w-[20px] h-[20px]" />
                  {statistics?.providers || 0}
                </h3>
              </div>
            </div>

            <div className="bg-white border border-primary rounded-lg flex items-center justify-center">
              <div className="flex flex-col items-baseline">
                <h2 className="text-center text-[16px] font-semibold mb-1">
                  Completed Jobs
                </h2>
                <h3 className="text-secondary text-[24px] font-semibold flex items-center gap-3">
                  <Pending className="w-[20px] h-[20px]" />
                  {statistics?.completedJobs || 0}
                </h3>
              </div>
            </div>

            <div className="bg-white border border-primary rounded-lg flex items-center justify-center">
              <div className="flex flex-col items-baseline">
                <h2 className="text-center text-[16px] font-semibold mb-1">
                  Subscription Revenue
                </h2>
                <h3 className="text-secondary text-[24px] font-semibold flex items-center gap-3">
                  <SubscriptionManagement className="w-[20px] h-[20px]" />
                  ${statistics?.subscriptionRevenue || 0}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <OrderTable />
    </div>
  );
};

export default Home;
