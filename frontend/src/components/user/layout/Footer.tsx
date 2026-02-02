import { Camera } from "lucide-react";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white py-16 px-6 lg:px-24 border-t border-[#195de6]/5">
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row justify-between items-center gap-12">
        <div className="flex flex-col items-center lg:items-start gap-4">
          <h3 className="text-2xl font-bold tracking-[0.4em] uppercase text-black">
            Hoang Nam
          </h3>
          <p className="text-[#4e6797] text-sm">
            © 2024 Hoang Nam Official. All rights reserved.
          </p>
        </div>

        <nav className="flex flex-wrap justify-center gap-8 text-sm font-semibold tracking-widest uppercase">
          <a
            className="hover:text-[#195de6] transition-colors text-black"
            href="#"
          >
            Privacy
          </a>
          <a
            className="hover:text-[#195de6] transition-colors text-black"
            href="#"
          >
            Terms
          </a>
          <a
            className="hover:text-[#195de6] transition-colors text-black"
            href="#"
          >
            Shipping
          </a>
          <a
            className="hover:text-[#195de6] transition-colors text-black"
            href="#"
          >
            Contact
          </a>
        </nav>

        <div className="flex gap-6">
          <a
            className="w-10 h-10 flex items-center justify-center rounded-full border border-[#195de6]/20 text-[#4e6797] hover:bg-[#195de6] hover:text-white transition-all"
            href="#"
          >
            <span className="material-symbols-outlined text-xl">
              <FaFacebook />
            </span>
          </a>
          <a
            className="w-10 h-10 flex items-center justify-center rounded-full border border-[#195de6]/20 text-[#4e6797] hover:bg-[#195de6] hover:text-white transition-all"
            href="#"
          >
            <span className="material-symbols-outlined text-xl">
              <FaTiktok />
            </span>
          </a>
          <a
            className="w-10 h-10 flex items-center justify-center rounded-full border border-[#195de6]/20 text-[#4e6797] hover:bg-[#195de6] hover:text-white transition-all"
            href="#"
          >
            <span className="material-symbols-outlined text-xl">
              <FaInstagram />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
