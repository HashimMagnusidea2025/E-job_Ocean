import { useState, useEffect, Suspense, lazy } from "react";
import NoImg from '../../media/png/no-image.png'
import { TestimonialCard } from "../../components/ui/cards/cards"
import as from '../../media/jpg/CA-A.jpg';

import axios from '../../utils/axios.js'
export default function TestimonialsPage() {


const [data, setData] = useState()
    const fetchCompanydata = async () => {
        try {
            const response = await axios.get('/general-settings'); // backend endpoint
            console.log("✅ Full Response:", response);              // logs full Axios response object
            console.log("✅ Data Received:", response.data);          // logs only your actual data

            setData(response.data);
        } catch (error) {
            console.error("❌ Failed to fetch company logo:", error);
        }
    };

    useEffect(() => {
        fetchCompanydata();
    }, []);

    return (
        <>
            <div className="bg-[#0c0800] rounded-2xl text-center py-20 px-4 font-[Poppins]">
                <h2 className="text-white text-6xl font-semibold mb-4 " >
                    What Our Students Say
                </h2>
                <p className="text-[#ffb800] italic text-lg max-w-3xl mx-auto">
                    Here's What Our Students Have To Say About Their Experience With {data?.name}.
                </p>
            </div>

            <div className="flex flex-wrap gap-6 justify-center my-10 p-3">
                <TestimonialCard
                    img={as}
                    title="I would like to thanks Archit Sir for taking this initiative of providing insightful & practical courses. I was able to take practical exposure of audit and able to clear my interview at EY"
                    name="Manisha Gupta"
                    companyimg={NoImg}
                />
                <TestimonialCard
                    img={as}
                    title="I would like to thanks Archit Sir for taking this initiative of providing insightful & practical courses. I was able to take practical exposure of audit and able to clear my interview at EY"
                    name="Manisha Gupta"
                    companyimg={NoImg}
                />
                <TestimonialCard
                    img={as}
                    title="I would like to thanks Archit Sir for taking this initiative of providing insightful & practical courses. I was able to take practical exposure of audit and able to clear my interview at EY"
                    name="Manisha Gupta"
                    companyimg={NoImg}
                />
            </div>



        </>
    )
}