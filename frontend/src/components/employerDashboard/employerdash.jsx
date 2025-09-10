import JobPackageDetails from "./PurchasedJobPackageDetails";
import UpgradeJobPackages from "./UpgradeJobPackages";
import Layout from "../seekerDashboard/partials/layout";
import {
  FaBars, FaTimes, FaPencilAlt, FaEye, FaDesktop,
  FaEnvelope, FaUser, FaSignOutAlt, FaHome,
  FaSearch, FaBriefcase, FaMapMarkerAlt, FaPhoneAlt,
  FaUserAlt, FaBlackTie, FaFileInvoice,
  FaUsers

} from "react-icons/fa";
export default function EmployerDash() {

    return (
        <>
            <Layout>
                <div className="flex  font-[Poppins] bg-[#f6f9f9] overflow-hidden">
                    <div className="flex-1 flex flex-col overflow-y-auto">
                        <div className=" space-y-10 pt-8">
                            <div className="bg-white rounded-xl shadow  p-6">
                                <h2 className="text-2xl font-semibold text-center">Welcome to Employer Dashboard</h2>
                            </div>
                            <div className="md:pt-8">
                                <div className="flex flex-wrap gap-4 justify-center">
                                    <StatCard title="Open Job" value="123" icon={<FaEye />} />
                                    <StatCard title="Followers" value="58" icon={<FaUser />} />

                                    <StatCard title="Messages" value="0" icon={<FaBriefcase />} />
                                </div>

                                <div className="pt-10">
                                    <JobPackageDetails />

                                </div>
                                <div className=" pt-10">
                                    <UpgradeJobPackages />
                                </div>
                                <div className="pt-10">
                                    <JobPackageDetails />

                                </div>
                                <div className=" pt-10">
                                    <UpgradeJobPackages />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </Layout>



        </>
    )

}



function StatCard({ title, value, icon }) {
    return (
        <div className="bg-white p-4 rounded-xl shadow flex items-center gap-4 w-40 md:w-60 lg:w-60">
            <div className={`text-xl md:text-2xl`}>{icon}</div>
            <div>
                <h2 className="text-sm md:text-base font-semibold mb-1">{title}</h2>
                <p className="text-gray-700 text-sm md:text-lg">{value}</p>
            </div>
        </div>
    );
}
