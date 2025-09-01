"use client";
import React, { useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { close, error, loading } from "@/config/swal";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  checkUsernames,
  emailValidation,
  getProfile,
  postSignIn,
  setupEmail,
} from "@/service/master-user";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { EyeFilledIcon, EyeSlashFilledIcon } from "../icons";
import { saveActivity } from "@/service/activity-log";

export default function Login() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleSetup, setIsVisibleSetup] = useState([false, false]);
  const [oldEmail, setOldEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [passwordSetup, setPasswordSetup] = useState("");
  const [confPasswordSetup, setConfPasswordSetup] = useState("");

  const toggleVisibility = () => setIsVisible(!isVisible);
  const [needOtp, setNeedOtp] = useState(false);
  const [isFirstLogin, setFirstLogin] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [accessData, setAccessData] = useState<any>();
  const [profile, setProfile] = useState<any>();
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [checkUsernameValue, setCheckUsernameValue] = useState("");
  const MySwal = withReactContent(Swal);

  const setValUsername = (e: any) => {
    const uname = e.replaceAll(/[^\w.-]/g, "");
    setUsername(uname.toLowerCase());
  };

  const onSubmit = async () => {
    const data = {
      username: username,
      password: password,
    };

    if (!username || !password) {
      error("Username & Password Wajib Diisi !");
    } else {
      loading();
      const response = await postSignIn(data);
      if (response?.error) {
        error("Username / Password Tidak Sesuai");
      } else {
        const profile = await getProfile(response?.data?.data?.access_token);
        const dateTime: any = new Date();

        const newTime: any = dateTime.getTime() + 10 * 60 * 1000;

        Cookies.set("access_token", response?.data?.data?.access_token, {
          expires: 1,
        });
        Cookies.set("refresh_token", response?.data?.data?.refresh_token, {
          expires: 1,
        });
        Cookies.set("time_refresh", newTime, {
          expires: 1,
        });
        Cookies.set("is_first_login", "true", {
          secure: true,
          sameSite: "strict",
        });
        await saveActivity(
          {
            activityTypeId: 1,
            url: "https://dev.mikulnews.com/auth",
            userId: profile?.data?.data?.id,
          },
          response?.data?.data?.access_token
        );
        Cookies.set("profile_picture", profile?.data?.data?.profilePictureUrl, {
          expires: 1,
        });
        Cookies.set("uie", profile?.data?.data?.id, {
          expires: 1,
        });
        Cookies.set("ufne", profile?.data?.data?.fullname, {
          expires: 1,
        });
        Cookies.set("ulie", profile?.data?.data?.userLevelGroup, {
          expires: 1,
        });
        Cookies.set("username", profile?.data?.data?.username, {
          expires: 1,
        });
        Cookies.set("fullname", profile?.data?.data?.fullname, {
          expires: 1,
        });
        Cookies.set("urie", profile?.data?.data?.roleId, {
          expires: 1,
        });
        Cookies.set("roleName", profile?.data?.data?.roleName, {
          expires: 1,
        });
        Cookies.set("masterPoldaId", profile?.data?.data?.masterPoldaId, {
          expires: 1,
        });
        Cookies.set("ulne", profile?.data?.data?.userLevelId, {
          expires: 1,
        });
        Cookies.set("urce", profile?.data?.data?.roleCode, {
          expires: 1,
        });
        Cookies.set("email", profile?.data?.data?.email, {
          expires: 1,
        });
        router.push("/admin/dashboard");
        Cookies.set("status", "login", {
          expires: 1,
        });

        close();
      }
    }
  };

  const checkUsername = async () => {
    const res = await checkUsernames(checkUsernameValue);
    if (res?.error) {
      error("Username tidak ditemukan");
      return false;
    }
    MySwal.fire({
      title: "",
      text: "",
      html: (
        <>
          <p>
            Kami telah mengirimkan tautan untuk mengatur ulang kata sandi ke
            email Anda
          </p>
          <p className="text-xs">
            Apakah Anda sudah menerima emailnya? Jika belum, periksa folder spam
            Anda
          </p>
        </>
      ),
      icon: "info",
      cancelButtonColor: "#d33",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Oke",
    }).then((result) => {
      if (result.isConfirmed) {
      }
    });
  };

  const submitCheckEmail = async () => {
    const req = {
      oldEmail: oldEmail,
      newEmail: newEmail,
      username: username,
      password: password,
    };

    const res = await setupEmail(req);
    if (res?.error) {
      if (res.message?.messages[0]) {
        error(res.message?.messages[0]);
      } else {
        error(res?.message);
      }

      return false;
    }
    close();
    setNeedOtp(true);
    setFirstLogin(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Logo Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-800 via-black to-red-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex items-center justify-center w-full p-12">
          <div className="text-center">
            <Link href={"/"}>
              <div className="pl-16 border bg-white rounded-md">
                <img
                  src="/bhayangkarakita.png"
                  alt="Mikul News Logo"
                  className="max-w-xs h-auto drop-shadow-lg"
                />
              </div>
            </Link>
            <div className="mt-8 text-white/90">
              <h2 className="text-2xl font-bold mb-2">
                Portal BhayangkaraKita
              </h2>
              <p className="text-sm opacity-80">
                Platform berita terpercaya untuk informasi terkini
              </p>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href={"/"}>
              <img
                src="/mikul.png"
                alt="Mikul News Logo"
                className="h-12 mx-auto"
              />
            </Link>
          </div>

          {isFirstLogin ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Setup Akun
                </h2>
                <p className="text-gray-600">Lengkapi informasi email Anda</p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label
                    htmlFor="old-email"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    Email Lama
                  </Label>
                  <Input
                    id="old-email"
                    type="email"
                    required
                    placeholder="Masukkan email lama"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    value={oldEmail}
                    onChange={(e) => setOldEmail(e.target.value)}
                  />
                </div>

                <div>
                  <Label
                    htmlFor="new-email"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    Email Baru
                  </Label>
                  <Input
                    id="new-email"
                    type="email"
                    required
                    placeholder="Masukkan email baru"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </div>

                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  onClick={submitCheckEmail}
                >
                  Submit
                </Button>
              </div>
            </div>
          ) : needOtp ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Verifikasi OTP
                </h2>
                <p className="text-gray-600">
                  Masukkan kode OTP yang telah dikirim
                </p>
              </div>
            </div>
          ) : isResetPassword ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Reset Password
                </h2>
                <p className="text-gray-600">
                  Masukkan username untuk reset password
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label
                    htmlFor="reset-username"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    Username
                  </Label>
                  <Input
                    id="reset-username"
                    type="text"
                    required
                    placeholder="Masukkan username"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    value={checkUsernameValue}
                    onChange={(e) =>
                      setCheckUsernameValue(e.target.value.trim())
                    }
                    onPaste={(e) =>
                      setCheckUsernameValue(e.currentTarget.value.trim())
                    }
                    onCopy={(e) =>
                      setCheckUsernameValue(e.currentTarget.value.trim())
                    }
                  />
                </div>

                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={checkUsername}
                  disabled={checkUsernameValue === ""}
                >
                  Check Username
                </Button>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <Link
                    href={`/`}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors lg:hidden"
                  >
                    Beranda
                  </Link>

                  <button
                    className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                    onClick={() => setIsResetPassword(false)}
                  >
                    Kembali ke Login
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Selamat Datang
                </h2>
                <p className="text-gray-600">
                  Portal BhayangkaraKita - Platform berita terpercaya
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label
                    htmlFor="username"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    Username
                  </Label>
                  <Input
                    id="username"
                    required
                    type="text"
                    placeholder="Masukkan username"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    value={username}
                    onChange={(e) => setValUsername(e.target.value.trim())}
                    onPaste={(e) =>
                      setValUsername(e.currentTarget.value.trim())
                    }
                    onCopy={(e) => setValUsername(e.currentTarget.value.trim())}
                  />
                </div>

                <div>
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      required
                      type={isVisible ? "text" : "password"}
                      placeholder="Masukkan password"
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={toggleVisibility}
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                    >
                      {isVisible ? (
                        <EyeSlashFilledIcon className="w-5 h-5" />
                      ) : (
                        <EyeFilledIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  onClick={onSubmit}
                >
                  Masuk ke Portal
                </Button>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <Link
                    href={`/`}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors lg:hidden"
                  >
                    Beranda
                  </Link>

                  <button
                    className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                    onClick={() => setIsResetPassword(true)}
                  >
                    Lupa Password?
                  </button>
                </div>
              </div>

              {/* <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Informasi Portal</p>
                    <p className="text-blue-700">Akses informasi terkini dan status permintaan informasi yang telah diajukan.</p>
                  </div>
                </div>
              </div> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
