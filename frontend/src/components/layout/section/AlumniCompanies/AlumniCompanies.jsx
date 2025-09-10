import alumni from '../../../../media/png/alumni.png'

const companies = [
  alumni,
  alumni,
  alumni,
  alumni,
  alumni,
  alumni,
  alumni,
  alumni,
  alumni,
  alumni,
  alumni,
  alumni,
  alumni,
  alumni,
  alumni,
  alumni,
  alumni,
  alumni,
];

export default function AlumniCompanies() {
  return (
    <section className="py-16 bg-white text-center">
      <h2 className="text-3xl md:text-[50px] font-bold text-[#339ca0] mb-14">
        Where Our Alumni Work
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 max-w-7xl mx-auto px-4 items-center">
        {companies.map((logo, index) => (
          <div key={index} className="flex items-center justify-center">
            <img
              src={logo}
              alt={`Company ${index + 1}`}
              className="max-h-12 object-contain "
            />
          </div>
        ))}
      </div>
    </section>
  );
}
