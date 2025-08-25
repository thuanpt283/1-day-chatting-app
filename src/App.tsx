import Chatbox from "@/components/sections/Chatbox";
import Sidebar from "@/components/sections/Sidebar";
import { useInfo } from "@/components/context/common";
import { useEffect } from "react";
import { getTodayKey } from "@/components/utils";
import { db } from "@/services/dexie";

function App() {
  const { channel, user } = useInfo();
  useEffect(() => {
    const todayKey = getTodayKey();
    const lastKey = localStorage.getItem("lastClearDate");

    if (lastKey !== todayKey) {
      db.delete().then(() => {
        console.log("Cleared DB for new day");
      });

      localStorage.setItem("lastClearDate", todayKey);
    }
  }, []);
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex flex-wrap -mx-2">
          <div className="w-full md:w-1/2 px-2">
            <h5 className="text-2xl font-bold mb-1">1 day chat App</h5>
            <p className="text-gray-600">
              All messages will be deleted at every 00:00 UTC
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap -mx-2">
          <Sidebar/>
          {channel && user && <Chatbox key={channel}/>}
        </div>
      </div>
    </div>
  );
}

export default App;
