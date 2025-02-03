import img from "../assets/footerlogo.png";
import bgimg from "../assets/footer_bg.png";

const Footer = () => {
  return (
    <footer className="bg-[#171717] text-white text-base">
      {/* Main Footer Content with Background Image */}
      <div
        className="bg-cover bg-center py-12 h-auto"
        style={{ backgroundImage: `url(${bgimg})` }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {/* Logo and Description (Left) */}
          <div className="space-y-4">
            <div className="text-white text-2xl font-bold">
              <a href="https://components101.com/">
                <img src={img} alt="Logo" className="max-w-full h-auto" />
              </a>
            </div>
            <p className="text-base max-w-xs leading-relaxed">
              Components101 is a resource dedicated to electronics design engineers,
              covering product news, analysis, and articles on the latest electronics
              components.
            </p>
          </div>

          {/* Important Links (Center-Left) */}
          <div>
            <h3 className="text-white font-medium mb-2 uppercase">Important Links</h3>
            <div className="border-t border-gray-700 p-1 w-52"></div>

            <ul className="space-y-3 font-medium">
              {[
                { name: "Contact", link: "https://components101.com/contact" },
                { name: "Advertise", link: "https://components101.com/contact/advertise" },
                { name: "Privacy Policy", link: "https://components101.com/privacy-policy" },
                { name: "Cookie Policy", link: "https://components101.com/cookie-policy" },
              ].map((item, index) => (
                <li key={index}>
                  <a
                    href={item.link}
                    target="_blank"
                    className="hover:text-white transition-colors duration-200 text-base font-normal flex items-center"
                  >
                    <div className="w-1 h-1 bg-red-500 mr-2"></div>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Tags (Right) */}
          <div className="lg:ml-0 md:col-span-2 lg:col-span-1">
            <h3 className="text-white font-medium mb-2 uppercase">Popular Tags</h3>
            <div className="border-t border-gray-700 p-1 w-full"></div>
            <div className="grid grid-cols-2 gap-y-4">
              {[
                { name: "Automotive", link: "https://components101.com/automotive-electronics" },
                { name: "Wearable", link: "https://components101.com/wearables" },
                { name: "IoT", link: "https://components101.com/iot-internet-of-things" },
                { name: "Telecom/5G", link: "https://components101.com/telecom" },
                { name: "Audio", link: "https://components101.com/audio-electronics" },
                { name: "Home Automation", link: "https://components101.com/home-automation" },
                { name: "Medical", link: "https://components101.com/medical-electronics" },
                { name: "Electric Vehicles", link: "https://components101.com/electric-vehicles" },
                { name: "Industrial", link: "https://components101.com/industrial" },
                { name: "Artificial Intelligence", link: "#" },
              ].map((tag, index) => (
                <a
                  key={index}
                  href={tag.link}
                  target="_blank"
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
      <div className="max-w-6xl mx-auto py-8 px-4">
        <p className="text-sm text-gray-500 text-center md:text-left">
          Copyright 2025 © Components101. All rights reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
