import React, { useState } from "react";
import {  ChevronDown, Menu } from "lucide-react";
import { FaFacebook, FaTwitterSquare, FaPinterest } from "react-icons/fa";

import img from "../assets/logo.png";

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Custom click handler for submenu items
  const handleSubmenuClick = (category: string, item: string) => {
    console.log(`${category} - ${item} clicked`);
    // Define custom behavior or navigation here
  };

  // Define dropdown options for each category
  const dropdownOptions = {
    PCBWAY: [
        "PCB Instant Quote",
        "Quick Order Online",
        "$29 Assembly Order",
        "Pick Up a Module",
        "CNC|3D Printing Prototype",
        "Make a Stencil",
        "How to Design a PCB?",
        "Electronic Design | OEM",
        "Free Gerber Viewer",
        "Shared Projects Library",
        "PCBWAY PCB Capabilities",
        "Ask for Sponsorship",
        "Latest News",
        "Advanced PCB Service",
        "7th Project Design Contest",
        "How Do You Like PCBWAY?",
      
    ],
    ICS: [
      "Power ICS's",
      "Analog ICS's",
      "Digital ICS's",
      
    ],
    PASSIVE: [
      "Capacitors",
      "Diodes",
      "Resistors",
      "Inductors",
      "Switches",
      "Transformers"
    ],
    POWER: [
      "Transistors",
      "IGBT",
      "MOSFET",
      "TRIAC",
      "Optocouplers",
      "Regulators",
      "Power ICs & Modules",
    ],
    EMBEDDED: [
      "Development Boards",
      "Microcontrollers",
      "Sensors",
      "Displays",
      "Wireless",
    ],
    ACTUATORS: [
      "Motors",
    ],
    MORE: [
      'Connectors',
      'module',
      "battery ",
      "cables",
      "Misc"
    ],
  };

  return (
    <header>
      {/* Top Red Bar */}
      <div className="bg-red-600 text-slate-50 text-xs h-10 flex items-center justify-center">
        <div className="flex items-center justify-center gap-[900px]">
          <div className="flex space-x-6 font-normal">
            <a href="#" className="hover:underline">About Us</a>
            <a href="#" className="hover:underline">Contact</a>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-gray-300">
              <FaFacebook className="w-4 h-4" />
            </a>
            <a href="#" className="hover:text-gray-300">
              <FaTwitterSquare className="w-4 h-4" />
            </a>
            <a href="#" className="hover:text-gray-300">
              <FaPinterest className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* White Navbar */}
      <div className="bg-slate-100 text-black shadow h-16 flex items-center justify-center">
        <div className="container mx-auto flex items-center justify-between py-3 px-6">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-10 mx-28">
            {/* Logo */}
            <a href="#" >
              <img src={img} alt="Logo" className="h-8" />
            </a>

            {/* Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-4 text-[0.85rem] font-semibold text-slate-600">
              <a href="#" className="hover:text-red-600 transition-colors duration-300">NEW PRODUCTS</a>
              <a href="#" className="hover:text-red-600 transition-colors duration-300">DESIGN TIPS</a>

              {/* Dropdowns for Desktop */}
              {Object.entries(dropdownOptions).map(([category, options]) => (
                <div
                key={category}
                className="relative group"
              >
                <div className="flex items-center space-x-2">
                  <a href="#" className="hover:text-red-600 transition-colors duration-300">
                    {category}
                    {category === "PCBWAY" && (
                      <span className="ml-2 text-xs bg-red-600 text-white px-2 py-1 rounded-full">New</span>
                    )}
                  </a>
                  <ChevronDown className="w-4 h-4 transform group-hover:rotate-180 transition-transform duration-300" />
                </div>
                <div className="absolute left-0 mt-0 hidden group-hover:block bg-white text-gray-600 text-sm rounded shadow-lg z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:text-nowrap group-hover:p-3">
                  {options.map((option) => (
                    <a
                      key={option}
                      href="#"
                      onClick={() => handleSubmenuClick(category, option)}
                      className="block px-4 py-2 hover:bg-gray-200 hover:text-red-600 transition-colors duration-300"
                    >
                      {option}
                    </a>
                  ))}
                </div>
              </div>
              ))}
            </nav>
          </div>

          {/* Hamburger Menu for Mobile */}
          <button className="lg:hidden text-black focus:outline-none" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div className={`lg:hidden bg-slate-50 transition-all duration-300 ${isMobileMenuOpen ? "max-h-[500px]" : "max-h-0 overflow-hidden"}`}>
        <nav className="flex flex-col items-start space-y-2 py-4 px-6 text-sm font-normal">
          <a href="#" className="w-full hover:text-red-600 transition-colors duration-300">NEW PRODUCTS</a>
          <a href="#" className="w-full hover:text-red-600 transition-colors duration-300">DESIGN TIPS</a>

          {/* Mobile Dropdowns */}
          {Object.entries(dropdownOptions).map(([category, options]) => (
            <details key={category} className="w-full">
              <summary className="cursor-pointer hover:text-red-600 transition-colors duration-300">{category}</summary>
              <div className="pl-4 mt-2 space-y-1">
                {options.map((option) => (
                  <a
                    key={option}
                    href="#"
                    onClick={() => handleSubmenuClick(category, option)}
                    className="block px-4 py-2 hover:bg-gray-200 hover:text-red-600 transition-colors duration-300"
                  >
                    {option}
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
