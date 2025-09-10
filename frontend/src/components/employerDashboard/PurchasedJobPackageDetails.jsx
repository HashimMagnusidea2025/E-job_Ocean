export default function JobPackageDetails() {
  return (
    <div className="w-full mx-auto bg-gray-100  sm:p-6 rounded-lg shadow-sm">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
        Purchased Job Package Details
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-[800px] sm:w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-800 text-white text-left">
              <th className="px-4 py-2 font-medium whitespace-nowrap">Package Name</th>
              <th className="px-4 py-2 font-medium whitespace-nowrap">Price</th>
              <th className="px-4 py-2 font-medium whitespace-nowrap">Available quota</th>
              <th className="px-4 py-2 font-medium whitespace-nowrap">Purchased On</th>
              <th className="px-4 py-2 font-medium whitespace-nowrap">Package Expired</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white text-gray-700">
              <td className="px-4 py-2 whitespace-nowrap">dene</td>
              <td className="px-4 py-2 whitespace-nowrap">INR0</td>
              <td className="px-4 py-2 text-blue-600 font-medium whitespace-nowrap">
                <a href="#">1 / 8</a>
              </td>
              <td className="px-4 py-2 text-blue-600 font-medium whitespace-nowrap">
                <a href="#">2025-04-08 11:32:29</a>
              </td>
              <td className="px-4 py-2 text-blue-600 font-medium whitespace-nowrap">
                <a href="#">2026-12-28 00:00:00</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
