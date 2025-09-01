"use client";
import { close, error, loading } from "@/config/swal";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { z } from "zod";
import { EyeFilledIcon, EyeSlashFilledIcon } from "../icons";
import ReactPasswordChecklist from "react-password-checklist";
import ReactSelect from "react-select";
import makeAnimated from "react-select/animated";
import { zodResolver } from "@hookform/resolvers/zod";
import { createMasterUser } from "@/service/master-user";
import { getAllUserLevels } from "@/service/user-levels-service";
import { listUserRole } from "@/service/master-user-role";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "../ui/button";

const userSchema = z.object({
  id: z.number(),
  label: z.string(),
  value: z.string(),
});

const masterUserSchema = z.object({
  fullname: z.string().min(1, { message: "Required" }),
  username: z.string().min(1, { message: "Required" }),
  password: z
    .string()
    .min(8, "Password harus memiliki minimal 8 karakter.")
    .refine((password) => /[A-Z]/.test(password), {
      message: "Password harus memiliki minimal satu huruf kapital.",
    })
    .refine((password) => /[0-9]/.test(password), {
      message: "Password harus memiliki minimal satu angka.",
    })
    .refine((password) => /[!@#$%^&*(),.?":{}|<>]/.test(password), {
      message: "Password harus memiliki minimal satu simbol.",
    }),
  passwordValidate: z.string().min(1, { message: "Required" }),
  email: z.string().min(1, { message: "Required" }),
  identityNumber: z.string().min(1, { message: "Required" }),
  genderType: z.string().min(1, { message: "Required" }),
  phoneNumber: z.string().min(1, { message: "Required" }),
  address: z.string().min(1, { message: "Required" }),
  userLevelType: userSchema,
  userRoleType: userSchema,
});

export default function FormMasterUser() {
  const router = useRouter();
  const animatedComponents = makeAnimated();

  const MySwal = withReactContent(Swal);
  const [isVisible, setIsVisible] = useState([false, false]);
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [parentList, setParentList] = useState<any>([]);
  const [listRole, setListRole] = useState<any>([]);

  const toggleVisibility = (type: number) => {
    setIsVisible(
      type === 0 ? [!isVisible[0], isVisible[1]] : [isVisible[0], !isVisible[1]]
    );
  };

  const formOptions = {
    resolver: zodResolver(masterUserSchema),
    defaultValues: { password: "", passwordValidate: "" },
  };
  type MicroIssueSchema = z.infer<typeof masterUserSchema>;
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    setValue,
  } = useForm<MicroIssueSchema>(formOptions);

  const passwordVal = watch("password");
  const passwordConfVal = watch("passwordValidate");

  async function save(data: z.infer<typeof masterUserSchema>) {
    const formData = {
      address: data.address,
      password: data.password,
      email: data.email,
      fullname: data.fullname,
      genderType: data.genderType,
      identityNumber: data.identityNumber,
      identityType: "nrp",
      phoneNumber: data.phoneNumber,
      userLevelId: data.userLevelType.id,
      userRoleId: data.userRoleType.id,
      username: data.username,
    };

    const response = await createMasterUser(formData);

    if (response?.error) {
      error(response.message);
      return false;
    }

    successSubmit("/admin/master-user");
  }

  function successSubmit(redirect: any) {
    MySwal.fire({
      title: "Sukses",
      icon: "success",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
        router.push(redirect);
      }
    });
  }

  async function onSubmit(data: z.infer<typeof masterUserSchema>) {
    if (data.password === data.passwordValidate) {
      MySwal.fire({
        title: "Simpan Data",
        text: "",
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#d33",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Simpan",
      }).then((result) => {
        if (result.isConfirmed) {
          save(data);
        }
      });
    } else {
      setError("passwordValidate", {
        type: "manual",
        message: "Password harus sama.",
      });
    }
  }

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

    setValue("password", generatedPassword);
  };

  useEffect(() => {
    fetchUserLevel();
    fetchUserRole();
  }, []);

  const fetchUserLevel = async () => {
    loading();
    const res = await getAllUserLevels();
    close();
    if (res?.data?.data) {
      setupParent(res?.data?.data, "level");
    }
  };
  const fetchUserRole = async () => {
    loading();
    const request = {
      limit: 100,
      page: 1,
    };
    const res = await listUserRole(request);
    close();
    if (res?.data?.data) {
      setupParent(res?.data?.data, "role");
    }
  };

  const setupParent = (data: any, type: "level" | "role") => {
    const temp = [];
    for (const element of data) {
      temp.push({
        id: element.id,
        label: element.name,
        value: element.aliasName || element.code,
      });
    }
    if (type === "level") {
      setParentList(temp);
    } else {
      setListRole(temp);
    }
  };

  return (
    <div className="mx-5 my-5 overflow-y-auto">
      <form method="POST" onSubmit={handleSubmit(onSubmit)}>
        <Card className="rounded-md p-5 flex flex-col gap-3">
          <Controller
            control={control}
            name="fullname"
            render={({ field: { onChange, value } }) => (
              <div className="w-full">
                <Label
                  htmlFor="title"
                  className="mb-1 block text-sm font-medium"
                >
                  Nama Lengkap
                </Label>
                <Input
                  type="text"
                  id="title"
                  placeholder="Nama Lengkap..."
                  value={value ?? ""}
                  onChange={onChange}
                  className="w-full border border-gray-300 dark:border-gray-400 rounded-lg bg-white dark:bg-transparent text-black dark:text-white"
                />
              </div>
            )}
          />
          {errors.fullname?.message && (
            <p className="text-red-400 text-sm">{errors.fullname?.message}</p>
          )}
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, value } }) => (
              <div className="w-full">
                <Label
                  htmlFor="username"
                  className="mb-1 block text-sm font-medium"
                >
                  Username
                </Label>
                <Input
                  type="text"
                  id="username"
                  placeholder="Username..."
                  value={value ?? ""}
                  onChange={onChange}
                  className="w-full border border-gray-300 dark:border-gray-400 rounded-lg bg-white dark:bg-transparent text-black dark:text-white"
                />
              </div>
            )}
          />
          {errors.username?.message && (
            <p className="text-red-400 text-sm">{errors.username?.message}</p>
          )}

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <div className="w-full">
                <Label
                  htmlFor="email"
                  className="mb-1 block text-sm font-medium"
                >
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="Email..."
                  value={value ?? ""}
                  onChange={onChange}
                  className="w-full border border-gray-300 dark:border-gray-400 rounded-lg bg-white dark:bg-transparent text-black dark:text-white"
                />
              </div>
            )}
          />
          {errors.email?.message && (
            <p className="text-red-400 text-sm">{errors.email?.message}</p>
          )}

          <Controller
            control={control}
            name="identityNumber"
            render={({ field: { onChange, value } }) => (
              <div className="w-full">
                <Label
                  htmlFor="identityNumber"
                  className="mb-1 block text-sm font-medium"
                >
                  NRP
                </Label>
                <Input
                  type="number"
                  id="identityNumber"
                  placeholder="NRP..."
                  value={value ?? ""}
                  onChange={onChange}
                  className="w-full border border-gray-300 dark:border-gray-400 rounded-lg bg-white dark:bg-transparent text-black dark:text-white"
                />
              </div>
            )}
          />
          {errors.identityNumber?.message && (
            <p className="text-red-400 text-sm">
              {errors.identityNumber?.message}
            </p>
          )}

          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, value } }) => (
              <div className="w-full">
                <Label
                  htmlFor="alamat"
                  className="mb-1 block text-sm font-medium"
                >
                  Alamat
                </Label>
                <Textarea
                  id="alamat"
                  placeholder="Alamat..."
                  value={value ?? ""}
                  onChange={(e) => onChange(e.target.value)}
                  className="border border-gray-300 dark:border-gray-400 rounded-lg bg-white dark:bg-transparent text-black dark:text-white"
                />
              </div>
            )}
          />
          {errors.address?.message && (
            <p className="text-red-400 text-sm">{errors.address?.message}</p>
          )}

          <Controller
            control={control}
            name="genderType"
            render={({ field: { onChange, value } }) => (
              <div className="w-full">
                <Label className="mb-2 block text-sm font-medium">Gender</Label>
                <RadioGroup
                  className="flex flex-row gap-4"
                  value={value}
                  onValueChange={onChange}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Male" id="male" />
                    <Label htmlFor="male">Laki-laki</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Female" id="female" />
                    <Label htmlFor="female">Perempuan</Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          />
          {errors.genderType?.message && (
            <p className="text-red-400 text-sm">{errors.genderType?.message}</p>
          )}

          <Controller
            control={control}
            name="phoneNumber"
            render={({ field: { onChange, value } }) => (
              <div className="w-full space-y-2">
                <Label htmlFor="identityNumber">No. Handphone</Label>
                <Input
                  type="number"
                  id="identityNumber"
                  placeholder="08*********"
                  value={value ?? ""}
                  onChange={onChange}
                  className="w-full"
                />
              </div>
            )}
          />
          {errors.phoneNumber?.message && (
            <p className="text-red-400 text-sm">
              {errors.phoneNumber?.message}
            </p>
          )}
          <Controller
            control={control}
            name="userLevelType"
            render={({ field: { onChange, value } }) => (
              <>
                <p className="text-sm mt-3">Level Pengguna</p>
                <ReactSelect
                  className="basic-single text-black z-50"
                  classNames={{
                    control: (state: any) =>
                      "!rounded-lg bg-white !border-1 !border-gray-200 dark:!border-stone-500",
                  }}
                  classNamePrefix="select"
                  onChange={onChange}
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isClearable={true}
                  isSearchable={true}
                  isMulti={false}
                  placeholder=""
                  name="sub-module"
                  options={parentList}
                />
              </>
            )}
          />
          {errors.userLevelType?.message && (
            <p className="text-red-400 text-sm">
              {errors.userLevelType?.message}
            </p>
          )}
          <Controller
            control={control}
            name="userRoleType"
            render={({ field: { onChange, value } }) => (
              <>
                <p className="text-sm mt-3">Peran Pengguna</p>
                <ReactSelect
                  className="basic-single text-black z-49"
                  classNames={{
                    control: (state: any) =>
                      "!rounded-lg bg-white !border-1 !border-gray-200 dark:!border-stone-500",
                  }}
                  classNamePrefix="select"
                  onChange={onChange}
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isClearable={true}
                  isSearchable={true}
                  isMulti={false}
                  placeholder=""
                  name="sub-module"
                  options={listRole}
                />
              </>
            )}
          />
          {errors.userRoleType?.message && (
            <p className="text-red-400 text-sm">
              {errors.userRoleType?.message}
            </p>
          )}
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <div className="w-full space-y-2 relative z-0">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    type={isVisible[0] ? "text" : "password"}
                    id="password"
                    placeholder="Password..."
                    value={value ?? ""}
                    onChange={onChange}
                    className="w-full pr-10"
                  />
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-2xl text-muted-foreground focus:outline-none"
                    type="button"
                    onClick={() => toggleVisibility(0)}
                  >
                    {isVisible[0] ? (
                      <EyeSlashFilledIcon className="pointer-events-none" />
                    ) : (
                      <EyeFilledIcon className="pointer-events-none" />
                    )}
                  </button>
                </div>
              </div>
            )}
          />
          {errors.password?.message && (
            <p className="text-red-400 text-sm">{errors.password?.message}</p>
          )}
          <Controller
            control={control}
            name="passwordValidate"
            render={({ field: { onChange, value } }) => (
              <div className="w-full space-y-2 relative z-0">
                <Label htmlFor="passwordValidate">Konfirmasi Password</Label>
                <div className="relative">
                  <Input
                    type={isVisible[1] ? "text" : "password"}
                    id="passwordValidate"
                    placeholder="Konfirmasi Password..."
                    value={value ?? ""}
                    onChange={onChange}
                    className="w-full pr-10"
                  />
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-2xl text-muted-foreground focus:outline-none"
                    type="button"
                    onClick={() => toggleVisibility(1)}
                  >
                    {isVisible[1] ? (
                      <EyeSlashFilledIcon className="pointer-events-none" />
                    ) : (
                      <EyeFilledIcon className="pointer-events-none" />
                    )}
                  </button>
                </div>
              </div>
            )}
          />
          {errors.passwordValidate?.message && (
            <p className="text-red-400 text-sm">
              {errors.passwordValidate?.message}
            </p>
          )}

          <a
            className="cursor-pointer text-[#DD8306]"
            onClick={generatePassword}
          >
            Generate Password
          </a>
          <ReactPasswordChecklist
            rules={["minLength", "specialChar", "number", "capital", "match"]}
            minLength={8}
            value={passwordVal}
            valueAgain={passwordConfVal}
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
          <div className="flex justify-end gap-3">
            <Link href={`/admin/master-user`}>
              <Button color="danger" variant="ghost">
                Cancel
              </Button>
            </Link>
            <Button type="submit" color="primary" variant="default">
              Save
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
