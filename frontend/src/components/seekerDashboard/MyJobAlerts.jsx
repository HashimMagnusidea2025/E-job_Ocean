import { FaTrashAlt } from "react-icons/fa";
import Layout from "./partials/layout";
const alerts = [
  { title: "Jul 22, 2025 - 17:31:11", created: " Delete" },
  { title: "Executive", created: "Jul 17, 2025 - 09:36:08" },
  { title: "Executive", created: "Jul 11, 2025 - 13:29:55" },
  { title: "Executive", created: "Jul 07, 2025 - 08:01:30" },
  { title: "Executive", created: "Jul 01, 2025 - 04:54:23" },
  { title: "Wed Designer", created: "Mar 13, 2025 - 03:12:05" },
  { title: "App Designer", created: "Mar 13, 2025 - 03:06:11" },
  { title: "UI/UX Designer", created: "Mar 09, 2025 - 06:18:07" },
];

export default function MYJobAlerts() {
  return (
    <Layout>
      <div className="p-6 w-full mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl sm:text-[30px] font-semibold">Manage Jobs Alerts</h2>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow">
            Create Alert
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg text-sm">
            <thead className="bg-gray-100 text-gray-700 text-left">
              <tr>
                <th className="p-3 font-medium text-[18px]">Alert Title</th>
                <th className="p-3 font-medium text-[18px]">Created On</th>
                <th className="p-3 font-medium text-[18px]">Action</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  <td className="p-3">{alert.title}</td>
                  <td className="p-3">{alert.created}</td>
                  <td className="p-3 text-red-600 font-medium flex items-center gap-1 cursor-pointer hover:underline">
                    <FaTrashAlt className="text-red-600" /> Delete
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
