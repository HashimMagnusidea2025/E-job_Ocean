
import powercolor from '../../media/jpg/power-color.jpg';
import Layout from './partials/layout';

export default function MyJobAplications() {
  return (
    <Layout>
      <div>


        <div className="p-4 space-y-4">
          {[1, 2,].map((_, index) => (
            <div key={index} className="w-full mx-auto bg-white shadow-sm border rounded-xl p-4 sm:p-6 md:p-10 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">

              {/* Left Section */}
              <div className="flex flex-col sm:flex-row gap-4">

                <div>
                  <img
                    src={powercolor}
                    alt="Company Logo"
                    className="rounded-lg border w-full sm:w-[120px] h-[120px] object-contain"
                  />
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">UI/UX Designer</h3>
                  <p className="text-sm text-gray-600">Power Color</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-sm">
                    <span className="bg-green-200 text-green-800 font-medium px-2 py-0.5 rounded-full text-xs">
                      First Shift (Day)
                    </span>
                    <span className="text-gray-500">- Islamabad</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-2 max-w-xl line-clamp-2">
                    We are seeking a talented UI/UX Designer to join our team and lead the design efforts for our mobile applications. As a UI/UX Designer, you will be re...
                  </p>
                </div>
              </div>


              <div className="sm:mt-2 sm:self-start">
                <button className="w-full sm:w-auto border border-blue-600 text-blue-600 px-4 py-2 rounded-md text-sm hover:bg-blue-600 hover:text-white transition">
                  VIEW DETAILS
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </Layout>
  );
}