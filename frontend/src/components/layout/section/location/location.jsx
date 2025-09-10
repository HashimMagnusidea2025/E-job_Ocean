import india from '../../../../media/png/india.png';

export default function Location() {
  return (
    <div className="container mx-auto  text-white py-12 px-4">

      <div className="flex justify-center items-center">
        <img
          src={india}
          alt="India Map"
          className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
        />
      </div>
    </div>
  );
}
