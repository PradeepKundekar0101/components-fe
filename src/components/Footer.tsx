import img from "../assets/footerlogo.png";
import bgimg from "../assets/footer_bg.png";

const Footer = () => {
  return (
    <footer className="bg-[#171717] text-gray-300 mt-[107px] ">
      {/* Main Footer Content with Background Image */}
      <div
        className="bg-cover bg-center py-12 h-64"
        style={{ backgroundImage: `url(${bgimg})` }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="text-white text-2xl font-bold">
              <img src={img} alt="Logo" />
            </div>
            <p className="text-sm">
              Components101 is a resource dedicated for electronics design
              engineers, covering product news, analysis, and articles on the
              latest electronics components.
            </p>
          </div>

          {/* Important Links */}
          <div>
            <h3 className="text-white font-medium mb-4 uppercase">
              Important Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-200 text-sm flex items-center"
                >
                  <div className="w-1 h-1 bg-red-500 mr-2"></div>
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-200 text-sm flex items-center"
                >
                  <div className="w-1 h-1 bg-red-500 mr-2"></div>
                  Advertise
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-200 text-sm flex items-center"
                >
                  <div className="w-1 h-1 bg-red-500 mr-2"></div>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-200 text-sm flex items-center"
                >
                  <div className="w-1 h-1 bg-red-500 mr-2"></div>
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Popular Tags */}
          <div>
            <h3 className="text-white font-medium mb-4 uppercase">Popular Tags</h3>
            <div className="grid grid-cols-2 gap-y-2 -ml-8">
              <a
                href="#"
                className="hover:text-white transition-colors duration-200 text-sm flex items-center"
              >
                <div className="w-1 h-1 bg-red-500 mr-2"></div>
                Automotive
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors duration-200 text-sm flex items-center"
              >
                <div className="w-1 h-1 bg-red-500 mr-2"></div>
                Wearable
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors duration-200 text-sm flex items-center"
              >
                <div className="w-1 h-1 bg-red-500 mr-2"></div>
                IoT
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors duration-200 text-sm flex items-center"
              >
                <div className="w-1 h-1 bg-red-500 mr-2"></div>
                Telecom/5G
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors duration-200 text-sm flex items-center"
              >
                <div className="w-1 h-1 bg-red-500 mr-2"></div>
                Audio
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors duration-200 text-sm flex items-center"
              >
                <div className="w-1 h-1 bg-red-500 mr-2"></div>
                Home Automation
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors duration-200 text-sm flex items-center"
              >
                <div className="w-1 h-1 bg-red-500 mr-2"></div>
                Medical
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors duration-200 text-sm flex items-center"
              >
                <div className="w-1 h-1 bg-red-500 mr-2"></div>
                Electric vehicles
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors duration-200 text-sm flex items-center"
              >
                <div className="w-1 h-1 bg-red-500 mr-2"></div>
                Industrial
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors duration-200 text-sm flex items-center"
              >
                <div className="w-1 h-1 bg-red-500 mr-2"></div>
                Artificial Intelligence
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-6xl mx-auto p-5 border-t border-gray-800">
        <p className="text-sm text-gray-500">
          Copyright 2023 © Components101. All rights reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
