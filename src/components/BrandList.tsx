const brands = [
  {
    name: "Robu",
    env: import.meta.env.VITE_ROBU_ALLOWED,
    image: "/components-radar/robu.png",
  },
  {
    name: "Sunrom",
    env: import.meta.env.VITE_SUNROM_ALLOWED,
    image: "/components-radar/sunrom.png",
  },
  {
    name: "Evelta",
    env: import.meta.env.VITE_EVELTA_ALLOWED,
    image: "/components-radar/evelta.webp",
  },
  {
    name: "RoboKits",
    env: import.meta.env.VITE_ROBOKIT_ALLOWED,
    image: "/components-radar/robokit.png",
  },
  {
    name: "Quartz",
    env: import.meta.env.VITE_QUARTZ_ALLOWED,
    image: "/components-radar/quartz.png",
  },
  {
    name: "Zbotics",
    env: import.meta.env.VITE_ZBOTICS_ALLOWED,
    image: "/components-radar/zbotics.webp",
  },
].filter((brand) => brand.env === "true");

// Double the brands array to create a seamless loop
const duplicatedBrands = [...brands, ...brands];

const BrandCarousel = () => {
  return (
    <div className=" p-6 bg-gray-100 rounded-lg py-2">
      <h2 className="text-xl font-semibold mb-4">
        Built for Engineers by Engineers
      </h2>

      <div className="relative overflow-hidden mb-6">
        <div className="animate-marquee flex whitespace-nowrap">
          {duplicatedBrands.map((brand, index) => (
            <div
              key={`${brand.name}-${index}`}
              className="flex items-center gap-3 px-4 py-2 bg-white shadow rounded-md mx-4 min-w-[200px]"
            >
              <img
                src={brand.image}
                alt={`${brand.name} logo`}
                className="w-12 h-12 object-contain"
              />
              <span className="font-medium">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-4 text-gray-600">
        The fastest way to find electronic components across Indian component
        distributors
      </p>
    </div>
  );
};

export default BrandCarousel;
