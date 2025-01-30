  import React, { useState } from "react";
  import { ChevronDown, Menu } from "lucide-react";
  import { FaFacebook, FaTwitterSquare, FaPinterest } from "react-icons/fa";
  import img from "../assets/logo.png";

  const Navbar: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleSubmenuClick = (category: string, item: string) => {
      console.log(`${category} - ${item} clicked`);
    };

    const dropdownOptions = {
      PCBWAY: [
        {
          name: "PCB Instant Quote",
          url: "https://www.pcbway.com/orderonline.aspx?from=components101jan01",
        },
        {
          name: "Quick Order Online",
          url: "https://www.pcbway.com/QuickOrderOnline.aspx?from=components101jan02",
        },
        {
          name: "$29 Assembly Order",
          url: "https://www.pcbway.com/quotesmt.aspx?from=components101jan03",
        },
        {
          name: "Pick Up a Module",
          url: "https://www.pcbway.com/project/gifts.html?from=components101jan04",
        },
        {
          name: "CNC|3D Printing Prototype",
          url: "https://www.pcbway.com/rapid-prototyping/?from=components101jan05",
        },
        {
          name: "Make a Stencil",
          url: "https://www.pcbway.com/stencil.aspx?from=components101jan06",
        },
        {
          name: "How to Design a PCB?",
          url: "https://www.pcbway.com/design-services.html?from=components101jan07",
        },
        {
          name: "Electronic Design | OEM",
          url: "https://www.pcbway.com/oem.html?from=components101jan08",
        },
        {
          name: "Free Gerber Viewer",
          url: "https://www.pcbway.com/project/OnlineGerberViewer.html?from=components101jan09",
        },
        {
          name: "Shared Projects Library",
          url: "https://www.pcbway.com/project/?from=components101jan10",
        },
        {
          name: "PCBWAY PCB Capabilities",
          url: "https://www.pcbway.com/capabilities.html?from=components101jan11",
        },
        {
          name: "Ask for Sponsorship",
          url: "https://www.pcbway.com/sponsor.html?from=components101jan12",
        },
        {
          name: "Latest News",
          url: "https://www.pcbway.com/blog/?from=components101jan13",
        },
        {
          name: "Advanced PCB Service",
          url: "https://www.pcbway.com/HighQualityOrderOnline.aspx?from=components101jan14",
        },
        {
          name: "7th Project Design Contest",
          url: "https://www.pcbway.com/activity/7th-project-design-contest.html?from=components101jan15",
        },
        {
          name: "How Do You Like PCBWAY?",
          url: "https://www.pcbway.com/project/share/?from=components101jan16",
        },
      ],
      ICS: [
        { name: "Power ICS's", url: "https://components101.com/power-ics" },
        { name: "Analog ICS's", url: "https://components101.com/analog-ics" },
        { name: "Digital ICS's", url: "https://components101.com/digital-ics" },
      ],
      PASSIVE: [
        { name: "Capacitors", url: "https://components101.com/capacitors" },
        { name: "Diodes", url: "https://components101.com/diodes" },
        { name: "Resistors", url: "https://components101.com/resistors" },
        { name: "Inductors", url: "https://components101.com/inductors" },
        { name: "Switches", url: "https://components101.com/switches" },
        { name: "Transformers", url: "https://components101.com/transformers" },
      ],
      POWER: [
        { name: "Transistors", url: "https://components101.com/transistors" },
        { name: "IGBT", url: "https://components101.com/igbt" },
        { name: "MOSFET", url: "https://components101.com/mosfet" },
        { name: "TRIAC", url: "https://components101.com/triac" },
        { name: "Optocouplers", url: "https://components101.com/optocouplers" },
        { name: "Regulators", url: "https://components101.com/regulators" },
        {
          name: "Power ICs & Modules",
          url: "https://components101.com/power-ics-modules",
        },
      ],
      EMBEDDED: [
        {
          name: "Development Boards",
          url: "https://components101.com/development-boards",
        },
        {
          name: "Microcontrollers",
          url: "https://components101.com/microcontrollers",
        },
        { name: "Sensors", url: "https://components101.com/sensors" },
        { name: "Displays", url: "https://components101.com/displays" },
        { name: "Wireless", url: "https://components101.com/wireless" },
      ],
      ACTUATORS: [{ name: "Motors", url: "https://components101.com/motors" }],
      MORE: [
        { name: "Connectors", url: "https://components101.com/connectors" },
        { name: "Module", url: "https://components101.com/modules2" },
        { name: "Batteries", url: "https://components101.com/batteries" },
        { name: "Cables", url: "https://components101.com/cables" },
        { name: "Misc", url: "https://components101.com/misc" },
      ],
    };

    return (
      <header>
        {/* Top Red Bar */}
        <div className="bg-red-600 text-slate-50 text-xs h-10 flex items-center justify-center">
          <div className="w-full max-w-[1200px] flex items-center justify-between px-4 lg:px-0">
            <div className="flex space-x-6 font-normal">
              <a
                href="https://components101.com/about-us"
                className="hover:underline"
              >
                About Us
              </a>
              <a
                href="https://components101.com/contact"
                className="hover:underline"
              >
                Contact
              </a>
            </div>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/electronicscomponents101"
                className="hover:text-gray-300"
              >
                <FaFacebook className="w-4 h-4" />
              </a>
              <a
                href="https://x.com/components101"
                className="hover:text-gray-300"
              >
                <FaTwitterSquare className="w-4 h-4" />
              </a>
              <a
                href="https://www.pinterest.com/components101/"
                className="hover:text-gray-300"
              >
                <FaPinterest className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* White Navbar */}
        <div className="bg-slate-100 text-black shadow h-16 flex items-center justify-center">
          <div className="w-full max-w-[1200px] flex items-center justify-between py-3 px-4 lg:px-0">
            
              
            <a href="https://components101.com" className="flex items-center">
              <img 
                src={img} 
                alt="Logo" 
                className="scale-150 " 
              />
            </a>
            <div className="flex items-center space-x-10 lg:mx-28">
              <nav className="hidden lg:flex items-center space-x-4 text-[0.85rem] font-semibold text-slate-600">
                <div className="flex space-x-6 w-full text-nowrap">
                  <a
                    href="https://components101.com/latest-news"
                    className="h-auto w-auto max-h-10 object-containtext-red-600 transition-colors duration-300"
                  >
                    NEW PRODUCTS
                  </a>
                  <a
                    href="https://components101.com/articles"
                    className="hover:text-red-600 transition-colors duration-300"
                  >
                    DESIGN TIPS
                  </a>
                </div>

                {Object.entries(dropdownOptions).map(([category, options]) => (
                  <div key={category} className="relative group">
                    <div className="flex items-center space-x-2">
                      <a
                        href="#"
                        className="hover:text-red-600 transition-colors duration-300"
                      >
                        {category}
                        {category === "PCBWAY" && (
                          <span className="ml-2 text-xs bg-red-600 text-white px-2 py-1 rounded-full">
                            New
                          </span>
                        )}
                      </a>
                      <ChevronDown className="w-4 h-4 transform group-hover:rotate-180 transition-transform duration-300" />
                    </div>
                    <div className="absolute left-0 mt-0 hidden group-hover:block bg-white text-gray-600 text-sm rounded shadow-lg z-20">
                      {options.map((option) => (
                        <a
                          key={option.name}
                          href={option.url}
                          {...(category === "PCBWAY" ? { target: "_blank" } : {})}
                          rel="noopener noreferrer"
                          className="block py-2 px-4 text-nowrap hover:bg-gray-200 hover:text-red-600 transition-colors duration-300"
                        >
                          {option.name}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </nav>
            </div>

            <button
              className="lg:hidden text-black focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden bg-slate-50 transition-all duration-300 ${
            isMobileMenuOpen ? "max-h-screen" : "max-h-0 overflow-hidden"
          }`}
        >
          <nav className="flex flex-col items-start space-y-2 py-4 px-6 text-sm font-normal">
            <a
              href="https://components101.com/latest-news"
              className="w-full hover:text-red-600 transition-colors duration-300 "
            >
              NEW PRODUCTS
            </a>
            <a
              href="https://components101.com/articles"
              className="w-full hover:text-red-600 transition-colors duration-300"
            >
              DESIGN TIPS
            </a>

            {Object.entries(dropdownOptions).map(([category, options]) => (
              <details key={category} className="w-full">
                <summary className="cursor-pointer hover:text-red-600 transition-colors duration-300">
                  {category}
                </summary>
                <div className="pl-4 mt-2 space-y-1">
                  {options.map((option) => (
                    <a
                      key={option.name}
                      href={option.url}
                      {...(category === "PCBWAY" ? { target: "_blank" } : {})}
                      className="block px-4 py-2 hover:bg-gray-200 hover:text-red-600 transition-colors duration-300"
                    >
                      {option.name}
                    </a>
                  ))}
                </div>
              </details>
            ))}
          </nav>
        </div>
      </header>
    );
  };

  export default Navbar;
