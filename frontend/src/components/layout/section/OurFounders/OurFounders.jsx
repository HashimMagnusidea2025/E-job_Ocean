import caarchitaggarwal from '../../../../media/png/ca-archit-aggarwal.png'


const founders = [
  {
    name: "Archit Agarwal",
    role: "Founder",
    image: caarchitaggarwal, 
    linkedin: "https://linkedin.com/in/architagarwal", 
    description:
      "A Chartered Accountant, an alumnus of Deloitte with 10+ years of experience. Has trained 40000+ learners across finance domains. He is partner at a leading firm of New Delhi and has handled auditing and consulting assignments of Listed Companies, Top Banks and PSU's.",
  },
  {
    name: "Pooja Sharma",
    role: "Co-Founder",
    image: caarchitaggarwal,
    linkedin: "https://linkedin.com/in/poojasharma", 
    description:
      "An MBA and Digital Content Creator with over 10 Years of Experience in Marketing & Operations. Ex-Co-founder of Online teaching platform Edu91 for CA and Commerce students.",
  },
   {
    name: "Pooja Sharma",
    role: "Co-Founder",
    image: caarchitaggarwal,
    linkedin: "https://linkedin.com/in/poojasharma", 
    description:
      "An MBA and Digital Content Creator with over 10 Years of Experience in Marketing & Operations. Ex-Co-founder of Online teaching platform Edu91 for CA and Commerce students.",
  },
];

export default function OurFounders() {
  return (
    <section className="text-center py-16 bg-white">
      <h2 className="text-3xl md:text-[50px] font-bold text-[#339ca0] mb-12">
        Our Founders
      </h2>

      <div className="flex flex-wrap justify-center gap-10  mx-auto px-4">
        {founders.map((founder, index) => (
          <div
            key={index}
            className="bg-white  shadow-lg rounded-xl p-6 max-w-[400px] w-full relative"
          >
            <div className="flex justify-center mb-4 relative">
              <img
                src={founder.image}
                alt={founder.name}
                className="w-32 h-32 object-cover rounded-full shadow-md"
              />
              <a
                href={founder.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-0 right-[35%] transform translate-y-1/2"
              >
                <img
                  src="/images/linkedin-icon.png" 
                  alt="LinkedIn"
                  className="w-6 h-6"
                />
              </a>
            </div>

            <h3 className="text-[22px] font-bold text-[#339ca0]">{founder.name}</h3>
            <p className="font-semibold text-[17px] mb-2">{founder.role}</p>
            <p className="text-sm text-gray-700">{founder.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
