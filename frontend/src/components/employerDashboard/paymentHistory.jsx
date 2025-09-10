
import Layout from "../seekerDashboard/partials/layout"

export default function PaymentHistory() {


    return (
        <>
            <Layout>
                <div className="w-full  mx-auto px-4 py-6 space-y-6">
                    {/* Table Section */}
                    <div className="bg-gray-100 p-4 sm:p-6 rounded-lg shadow-sm overflow-x-auto">
                        <h2 className="text-lg sm:text-[25px] font-semibold text-gray-800 mb-4">
                            Payment History
                        </h2>
                        <table className="min-w-[800px] sm:w-full table-auto border-collapse">
                            <thead>
                                <tr className="bg-gray-800 text-white text-left">
                                    <th className="px-4 py-2 font-medium whitespace-nowrap">Package Name</th>
                                    <th className="px-4 py-2 font-medium whitespace-nowrap">Price</th>
                                    <th className="px-4 py-2 font-medium whitespace-nowrap">Jobs Quota</th>
                                    <th className="px-4 py-2 font-medium whitespace-nowrap">Payment Method</th>
                                    <th className="px-4 py-2 font-medium whitespace-nowrap">Package Start Date</th>
                                    <th className="px-4 py-2 font-medium whitespace-nowrap">	Package End Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-white text-gray-700">
                                    <td className="px-4 py-2 whitespace-nowrap">dene</td>
                                    <td className="px-4 py-2 whitespace-nowrap">INR 0</td>
                                    <td className="px-4 py-2 text-blue-600 font-medium whitespace-nowrap">
                                        <a href="#"> 8</a>
                                    </td>
                                    <td className="px-4 py-2 text-blue-600 font-medium whitespace-nowrap">Offline (Added by Admin)</td>
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
            </Layout>
        </>
    )
}