"use client";
import { Lock, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

export default function Navbar() {
  return (
    <>
      <div className="w-full bg-white ">
        <div className="flex flex-row items-center  border-black mx-5">
          <div className="relative w-full h-[113px]">
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src="/bhayangkarakita.png"
                alt="Kritik Tajam Logo"
                width={150}
                height={90}
                className="object-contain"
              />
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex border-b-2 items-center justify-between px-4 py-3">
          {/* Kiri: Hamburger */}
          <div className="flex items-center">
            <Menu className="w-6 h-6 text-black cursor-pointer" />
          </div>

          {/* Tengah: Menu Utama */}
          <nav className="hidden md:flex space-x-8 font-bold text-sm text-black">
            <a href="#" className="relative">
              <span className="border-b-2 border-black pb-1">Beranda</span>
            </a>
            <a href="#" className="hover:text-gray-700">
              Giat Utama
            </a>
            <a href="#" className="hover:text-gray-700">
              Pelayanan
            </a>
            <a href="#" className="hover:text-gray-700">
              Inspirasi
            </a>
            <a href="#" className="hover:text-gray-700">
              Opini
            </a>
            <a href="#" className="hover:text-gray-700">
              Prestasi Polri
            </a>
          </nav>

          {/* Kanan: Search Icon */}
          <div className="flex items-center space-x-4 text-black mt-2 md:mt-0 mr-3 md:mr-3 lg:mr-3 xl:mr-0  ">
            <Button className="bg-black text-white">
              <Link
                href="/auth"
                className="hover:underline flex items-center gap-1"
              >
                <Lock className="w-3 h-3" />
                Login
              </Link>
            </Button>
            <Link href="#" className="text-[#DD3333]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M7.91 20.889c8.302 0 12.845-6.885 12.845-12.845c0-.193 0-.387-.009-.58A9.2 9.2 0 0 0 23 5.121a9.2 9.2 0 0 1-2.597.713a4.54 4.54 0 0 0 1.99-2.5a9 9 0 0 1-2.87 1.091A4.5 4.5 0 0 0 16.23 3a4.52 4.52 0 0 0-4.516 4.516c0 .352.044.696.114 1.03a12.82 12.82 0 0 1-9.305-4.718a4.526 4.526 0 0 0 1.4 6.03a4.6 4.6 0 0 1-2.043-.563v.061a4.524 4.524 0 0 0 3.62 4.428a4.4 4.4 0 0 1-1.189.159q-.435 0-.845-.08a4.51 4.51 0 0 0 4.217 3.135a9.05 9.05 0 0 1-5.608 1.936A9 9 0 0 1 1 18.873a12.84 12.84 0 0 0 6.91 2.016"
                />
              </svg>
            </Link>
            <Link href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 256 180"
              >
                <path
                  fill="#f00"
                  d="M250.346 28.075A32.18 32.18 0 0 0 227.69 5.418C207.824 0 127.87 0 127.87 0S47.912.164 28.046 5.582A32.18 32.18 0 0 0 5.39 28.24c-6.009 35.298-8.34 89.084.165 122.97a32.18 32.18 0 0 0 22.656 22.657c19.866 5.418 99.822 5.418 99.822 5.418s79.955 0 99.82-5.418a32.18 32.18 0 0 0 22.657-22.657c6.338-35.348 8.291-89.1-.164-123.134"
                />
                <path
                  fill="#fff"
                  d="m102.421 128.06l66.328-38.418l-66.328-38.418z"
                />
              </svg>
            </Link>
            <Link href="#" className="text-[#DD3333]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"
                />
              </svg>
            </Link>
            <Link href="#" className="text-[#DD3333]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4z"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
