"use client";
import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import PasswordChecklist from "react-password-checklist";
import { close, error, loading } from "@/config/swal";
import { savePassword } from "@/service/master-user";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PasswordForm(props: { doFetch: () => void }) {
  const MySwal = withReactContent(Swal);
  const [isVisible, setIsVisible] = useState([false, false]);

  const [passwordConf, setPasswordConf] = useState("");
  const [password, setPassword] = useState("");
  const [isValidPassword, setIsValidPassword] = useState(false);

  const onSubmit = async () => {
    loading();
    const data = {
      password: password,
      confirmPassword: passwordConf,
    };
    const res = await savePassword(data);
    if (res?.error) {
      error(res.message);
      return false;
    }
    close();
    props.doFetch();
    MySwal.fire({
      title: "Sukses",
      icon: "success",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
      }
    });
  };

  const generatePassword = () => {
    const length = Math.floor(Math.random() * 9) + 8;

    const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerCaseChars = "abcdefghijklmnopqrstuvwxyz";
    const numberChars = "0123456789";
    const specialChars = "!@#$%^&*";
    const allChars =
      upperCaseChars + lowerCaseChars + numberChars + specialChars;

    let generatedPassword = "";

    generatedPassword +=
      upperCaseChars[Math.floor(Math.random() * upperCaseChars.length)];
    generatedPassword +=
      specialChars[Math.floor(Math.random() * specialChars.length)];
    generatedPassword +=
      numberChars[Math.floor(Math.random() * numberChars.length)];
    generatedPassword +=
      lowerCaseChars[Math.floor(Math.random() * lowerCaseChars.length)];

    for (let i = generatedPassword.length; i < length; i++) {
      generatedPassword +=
        allChars[Math.floor(Math.random() * allChars.length)];
    }

    generatedPassword = generatedPassword
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("");

    setPassword(generatedPassword);
  };

  return (
    <form className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <p className="text-sm">Password</p>
        <div className="relative">
          <Input
            required
            type={isVisible[0] ? "text" : "password"}
            placeholder=""
            className="w-full pr-10 border border-gray-300 rounded-lg dark:border-gray-400"
            value={password}
            onChange={(e) => {
              const target = e.target as HTMLInputElement;
              setPassword(target.value.trim());
            }}
            onPaste={(e) => {
              const target = e.target as HTMLInputElement;
              setPassword(target.value.trim());
            }}
            onCopy={(e) => {
              const target = e.target as HTMLInputElement;
              setPassword(target.value.trim());
            }}
          />
          <button
            type="button"
            onClick={() => setIsVisible([!isVisible[0], isVisible[1]])}
            className="absolute inset-y-0 right-2 flex items-center text-gray-400 focus:outline-none"
          >
            {isVisible[0] ? (
              <EyeOff className="w-5 h-5 pointer-events-none" />
            ) : (
              <Eye className="w-5 h-5 pointer-events-none" />
            )}
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm">Konfirmasi Password</p>
        <div className="relative">
          <Input
            required
            type={isVisible[1] ? "text" : "password"}
            placeholder=""
            className="w-full pr-10 border border-gray-300 rounded-lg dark:border-gray-400"
            value={passwordConf}
            onChange={(e) => {
              const target = e.target as HTMLInputElement;
              setPasswordConf(target.value.trim());
            }}
            onPaste={(e) => {
              const target = e.target as HTMLInputElement;
              setPasswordConf(target.value.trim());
            }}
            onCopy={(e) => {
              const target = e.target as HTMLInputElement;
              setPasswordConf(target.value.trim());
            }}
          />
          <button
            type="button"
            onClick={() => setIsVisible([isVisible[0], !isVisible[1]])}
            className="absolute inset-y-0 right-2 flex items-center text-gray-400 focus:outline-none"
          >
            {isVisible[1] ? (
              <EyeOff className="w-5 h-5 pointer-events-none" />
            ) : (
              <Eye className="w-5 h-5 pointer-events-none" />
            )}
          </button>
        </div>
      </div>
      <a className="cursor-pointer text-[#DD8306]" onClick={generatePassword}>
        Generate Password
      </a>
      <PasswordChecklist
        rules={["minLength", "specialChar", "number", "capital", "match"]}
        minLength={8}
        value={password}
        valueAgain={passwordConf}
        onChange={(isValid) => {
          setIsValidPassword(isValid);
        }}
        className="text-black dark:text-white text-sm my-3"
        messages={{
          minLength: "Password must be more than 8 characters",
          specialChar: "Password must include a special character",
          number: "Password must include a number",
          capital: "Password must include an uppercase letter",
          match: "Passwords match",
        }}
      />
      <Button
        className="w-fit mt-4 bg-blue-600 text-white hover:bg-blue-700"
        onClick={onSubmit}
        disabled={!isValidPassword}
      >
        Simpan
      </Button>
    </form>
  );
}
