import img from "../assets/footerlogo.png";
import bgimg from "../assets/footer_bg.png";

const Footer = () => {
  return (
    <footer className="bg-[#171717] text-white text-base">
      {/* Main Footer Content with Background Image */}
      <div
        className="bg-cover bg-center py-8 md:py-12 h-auto px-4 md:px-6"
        style={{ backgroundImage: `url(${bgimg})` }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="text-white text-2xl font-bold">
              <a href="https://components101.com/">
                <img src={img} alt="Logo" className="max-w-full h-auto" />
              </a>
            </div>
            <p className="text-base max-w-sm leading-relaxed">
              Components101 is a resource dedicated to electronics design
              engineers, covering product news, analysis, and articles on the
              latest electronics components.
            </p>
          </div>

          {/* Important Links */}
          <div className="mt-6 md:mt-0">
            <h3 className="text-white font-medium mb-2 uppercase">
              Important Links
            </h3>
            <div className="border-t border-gray-700 p-1 w-full md:w-52"></div>

            <ul className="space-y-3 font-medium">
              {[
                { name: "Contact", link: "https://components101.com/contact" },
                {
                  name: "Advertise",
                  link: "https://components101.com/contact/advertise",
                },
                {
                  name: "Privacy Policy",
                  link: "https://components101.com/privacy-policy",
                },
                {
                  name: "Cookie Policy",
                  link: "https://components101.com/cookie-policy",
                },
              ].map((item, index) => (
                <li key={index}>
                  <a
                    href={item.link}
                    className="hover:text-white transition-colors duration-200 text-base font-normal flex items-center"
                  >
                    <div className="w-1 h-1 bg-red-500 mr-2"></div>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Tags */}
          <div className="mt-6 lg:mt-0">
            <h3 className="text-white font-medium mb-2 uppercase">
              Popular Tags
            </h3>
            <div className="border-t border-gray-700 p-1 w-full"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
              {[
                {
                  name: "Automotive",
                  link: "https://components101.com/automotive-electronics",
                },
                {
                  name: "Wearable",
                  link: "https://components101.com/wearables",
                },
                {
                  name: "IoT",
                  link: "https://components101.com/iot-internet-of-things",
                },
                {
                  name: "Telecom/5G",
                  link: "https://components101.com/telecom",
                },
                {
                  name: "Audio",
                  link: "https://components101.com/audio-electronics",
                },
                {
                  name: "Home Automation",
                  link: "https://components101.com/home-automation",
                },
                {
                  name: "Medical",
                  link: "https://components101.com/medical-electronics",
                },
                {
                  name: "Electric Vehicles",
                  link: "https://components101.com/electric-vehicles",
                },
                {
                  name: "Industrial",
                  link: "https://components101.com/industrial",
                },
                { name: "Artificial Intelligence", link: "#" },
              ].map((tag, index) => (
                <a
                  key={index}
                  href={tag.link}
                  className="hover:text-white transition-colors duration-200 text-base font-normal flex items-center"
                >
                  <div className="w-1 h-1 bg-red-500 mr-2"></div>
                  {tag.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-6xl mx-auto py-6 md:py-8 px-4 md:px-6">
        <p className="text-sm text-gray-500 text-center md:text-left">
          Copyright 2023 © Components101. All rights reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
