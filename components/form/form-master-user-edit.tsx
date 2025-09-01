"use client";

import { close, error, loading } from "@/config/swal";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { z } from "zod";
import ReactSelect from "react-select";
import makeAnimated from "react-select/animated";
import { editMasterUsers, getDetailMasterUsers } from "@/service/master-user";
import { getAllUserLevels } from "@/service/user-levels-service";
import { listUserRole } from "@/service/master-user-role";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
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
  email: z.string().min(1, { message: "Required" }),
  identityNumber: z.string().min(1, { message: "Required" }),
  genderType: z.string().min(1, { message: "Required" }),
  phoneNumber: z.string().min(1, { message: "Required" }),
  address: z.string().min(1, { message: "Required" }),
  userLevelType: userSchema,
  userRoleType: userSchema,
});

export default function FormMasterUserEdit() {
  const router = useRouter();
  const MySwal = withReactContent(Swal);
  const animatedComponents = makeAnimated();
  const params = useParams();
  const id = params?.id;
  const [parentList, setParentList] = useState<any>([]);
  const [listRole, setListRole] = useState<any>([]);

  const formOptions = {
    resolver: zodResolver(masterUserSchema),
  };
  type MicroIssueSchema = z.infer<typeof masterUserSchema>;
  const {
    control,
    handleSubmit,
    formState: { errors },

    setValue,
  } = useForm<MicroIssueSchema>(formOptions);

  async function save(data: z.infer<typeof masterUserSchema>) {
    const formData = {
      address: data.address,
      email: data.email,
      fullname: data.fullname,
      genderType: data.genderType,
      identityNumber: data.identityNumber,
      phoneNumber: data.phoneNumber,
      userLevelId: data.userLevelType.id,
      userRoleId: data.userRoleType.id,
      username: data.username,
    };

    const response = await editMasterUsers(formData, String(id));

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
  }

  useEffect(() => {
    initFetch();
  }, [id]);

  const initFetch = async () => {
    loading();
    const res = await getDetailMasterUsers(String(id));
    const profile = res?.data?.data;
    const listLevel = await fetchUserLevel();
    const listRole = await fetchUserRole();
    const findLevel = listLevel?.find((a) => a.id === profile.userLevelId);
    const findRole = listRole?.find((a) => a.id === profile.userRoleId);
    setValue("fullname", profile?.fullname);
    setValue("username", profile?.username);
    setValue("email", profile?.email);
    setValue("address", profile?.address);
    setValue("identityNumber", profile?.identityNumber);
    setValue("genderType", profile?.genderType);
    setValue("phoneNumber", profile?.phoneNumber);
    if (findLevel) {
      setValue("userLevelType", findLevel);
    }
    if (findRole) {
      setValue("userRoleType", findRole);
    }
    close();
  };

  const fetchUserLevel = async () => {
    const res = await getAllUserLevels();
    if (res?.data?.data) {
      return setupParent(res?.data?.data, "level");
    }
  };
  const fetchUserRole = async () => {
    const request = {
      limit: 100,
      page: 1,
    };
    const res = await listUserRole(request);
    if (res?.data?.data) {
      return setupParent(res?.data?.data, "role");
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
    return temp;
  };

  return (
    <div className="mx-5 my-5 overflow-y-auto">
      <form
        method="POST"
        onSubmit={handleSubmit(onSubmit)}
        className="w-full lg:w-1/2 lg:ml-4"
      >
        <Card className="rounded-md p-5 flex flex-col gap-3">
          <Controller
            control={control}
            name="fullname"
            render={({ field: { onChange, value } }) => (
              <div className="w-full space-y-2">
                <Label htmlFor="title">Nama Lengkap</Label>
                <Input
                  type="text"
                  id="title"
                  placeholder="Nama Lengkap..."
                  value={value ?? ""}
                  onChange={onChange}
                  className="w-full border border-gray-300 dark:border-gray-400 rounded-lg dark:bg-transparent"
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
              <div className="w-full space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  type="text"
                  id="username"
                  placeholder="Username..."
                  value={value ?? ""}
                  onChange={onChange}
                  className="w-full border border-gray-300 dark:border-gray-400 rounded-lg dark:bg-transparent"
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
              <div className="w-full space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="Email..."
                  value={value ?? ""}
                  onChange={onChange}
                  className="w-full border border-gray-300 dark:border-gray-400 rounded-lg dark:bg-transparent"
                />
              </div>
            )}
          />
          {errors.email?.message && (
            <p className="text-red-400 text-sm">{errors.email?.message}</p>
          )}

          {/* <Controller
            control={control}
            name="identityType"
            render={({ field: { onChange, value } }) => (
              <Select
                variant="bordered"
                labelPlacement="outside"
                label="Identity Type"
                placeholder="Select"
                className="max-w-xs"
                selectedKeys={[value]}
                onChange={onChange}
              >
                {typeIdentity.map((type) => (
                  <SelectItem key={type.value}>{type.value}</SelectItem>
                ))}
              </Select>
            )}
          />
          {errors.identityType?.message && (
            <p className="text-red-400 text-sm">
              {errors.identityType?.message}
            </p>
          )} */}
          <Controller
            control={control}
            name="identityNumber"
            render={({ field: { onChange, value } }) => (
              <div className="w-full space-y-2">
                <Label htmlFor="identityNumber">NRP</Label>
                <Input
                  type="number"
                  id="identityNumber"
                  placeholder="NRP..."
                  value={value ?? ""}
                  onChange={onChange}
                  className="w-full border border-gray-300 dark:border-gray-400 rounded-lg dark:bg-transparent"
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
              <div className="w-full space-y-2">
                <Label htmlFor="alamat">Alamat</Label>
                <Textarea
                  id="alamat"
                  placeholder="Alamat..."
                  value={value ?? ""}
                  onChange={(e) => onChange(e)}
                  className="border border-gray-300 dark:border-gray-400 rounded-lg dark:bg-transparent"
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
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <RadioGroup
                  id="gender"
                  value={value}
                  onValueChange={onChange}
                  className="flex flex-row gap-6"
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
                  value={value}
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
                  value={value}
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
            name="phoneNumber"
            render={({ field: { onChange, value } }) => (
              <div className="w-full z-0 space-y-2">
                <Label htmlFor="identityNumber">No. Handphone</Label>
                <Input
                  type="number"
                  id="identityNumber"
                  placeholder="08*********"
                  value={value ?? ""}
                  onChange={onChange}
                />
              </div>
            )}
          />
          {errors.phoneNumber?.message && (
            <p className="text-red-400 text-sm">
              {errors.phoneNumber?.message}
            </p>
          )}

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
