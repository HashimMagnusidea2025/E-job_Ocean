import chatgpt from '../../../../media/png/chatgpt.png'


const pedagogyItems = [
    {
        logo: chatgpt,

        description: 'Hands-On Training On Real Data',
    },
    {
        logo: chatgpt,

        description: 'One-On-One Interaction With Industry Experts',
    },
    {
        logo: chatgpt,

        description: 'Learn & Practice Through Case Studies, Simulations, Questionnaires & Quizzes',
    },
    {
        logo: chatgpt,

        description: 'Free Placement Assistance, 500+ Vacancies in 30+ Firms',
    },
];

export default function UniquePedagogy() {
    return (
        <section className="text-center py-16 bg-white">
            <h2 className="text-3xl md:text-[50px] font-bold text-[#339ca0] mb-12 uppercase">
                Unique Pedagogy
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto px-4">
                {pedagogyItems.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white shadow-md rounded-lg border-b-4 border-[#339ca0] p-6 hover:-translate-y-1 transition-transform duration-300"
                    >
                        <div className="flex flex-col items-center mb-4">
                            <div className="w-24 h-24 rounded-full bg-[#339ca0] flex flex-col justify-center items-center mb-2">
                                <img src={item.logo} alt={item.title} className="w-20 h-20 mb-1" />
                           
                            </div>
                        </div>
                        <p className="text-[15px] text-gray-700">{item.description}</p>
                    </div>
                ))}
            </div>
        </section>

    );
}
