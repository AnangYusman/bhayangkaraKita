"use client";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { close, error, loading } from "@/config/swal";
import { updateProfile } from "@/service/master-user";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  fullname: z.string().min(1, {
    message: "Harus diisi",
  }),
  username: z.string().min(1, {
    message: "Harus diisi",
  }),
  email: z
    .string()
    .email({
      message: "Email tidak valid",
    })
    .min(2, {
      message: "Harus diisi",
    }),
  nrp: z.string().min(1, {
    message: "Harus diisi",
  }),
  address: z.string().min(1, {
    message: "Harus diisi",
  }),
  gender: z.string().min(1, {
    message: "Harus diisi",
  }),
  phoneNumber: z.string().min(1, {
    message: "Harus diisi",
  }),
});

export default function ProfileForm(props: {
  profile: any;
  doFetch: () => void;
}) {
  const MySwal = withReactContent(Swal);
  const { profile } = props;
  const formOptions = {
    resolver: zodResolver(formSchema),
  };
  type UserSettingSchema = z.infer<typeof formSchema>;
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<UserSettingSchema>(formOptions);

  useEffect(() => {
    setValue("fullname", profile?.fullname);
    setValue("username", profile?.username);
    setValue("email", profile?.email);
    setValue("address", profile?.address);
    setValue("nrp", profile?.identityNumber);
    setValue("gender", profile?.genderType);
    setValue("phoneNumber", profile?.phoneNumber);
  }, [profile]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    loading();
    const req = {
      address: values.address,
      fullname: values.fullname,
      username: values.username,
      email: values.email,
      identityNumber: values.nrp,
      phoneNumber: values.phoneNumber,
      genderType: values.gender,
      userLevelId: profile.userLevelId,
      userRoleId: profile.userRoleId,
    };
    const res = await updateProfile(req);
    close();
    if (res?.error) {
      error(res.message);
      return false;
    }
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

  return (
    <form className="flex flex-col gap-3 " onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-1">
        <p className="text-sm">Username</p>
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, value } }) => (
            <Input
              type="text"
              id="username"
              placeholder=""
              readOnly
              value={value ?? ""}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-lg dark:border-gray-400"
            />
          )}
        />
        {errors?.username && (
          <p className="text-red-400 text-sm mb-3">
            {errors.username?.message}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <Controller
          control={control}
          name="fullname"
          render={({ field: { onChange, value } }) => (
            <div className="flex flex-col gap-1">
              <label htmlFor="fullname" className="text-sm">
                Nama Lengkap
              </label>
              <Input
                type="text"
                id="fullname"
                placeholder=""
                value={value}
                onChange={onChange}
                className="w-full border border-gray-300 rounded-lg dark:border-gray-400 dark:bg-transparent"
              />
            </div>
          )}
        />
        {errors?.fullname && (
          <p className="text-red-400 text-sm mb-3">
            {errors.fullname?.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm">
                Email
              </label>
              <Input
                type="email"
                id="email"
                placeholder=""
                value={value}
                onChange={onChange}
                className="w-full border border-gray-300 rounded-lg dark:border-gray-400 dark:bg-transparent"
              />
            </div>
          )}
        />
        {errors?.email && (
          <p className="text-red-400 text-sm mb-3">{errors.email?.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Controller
          control={control}
          name="nrp"
          render={({ field: { onChange, value } }) => (
            <div className="flex flex-col gap-1">
              <label htmlFor="nrp" className="text-sm">
                NRP
              </label>
              <Input
                type="number"
                id="nrp"
                placeholder=""
                value={value}
                onChange={onChange}
                className="w-full border border-gray-300 rounded-lg dark:border-gray-400 dark:bg-transparent"
              />
            </div>
          )}
        />
        {errors?.nrp && (
          <p className="text-red-400 text-sm mb-3">{errors.nrp?.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Controller
          control={control}
          name="address"
          render={({ field: { onChange, value } }) => (
            <div className="flex flex-col gap-1">
              <label htmlFor="address" className="text-sm">
                Alamat
              </label>
              <Textarea
                id="address"
                placeholder=""
                value={value}
                onChange={onChange}
                className="w-full border border-gray-300 rounded-lg dark:border-gray-400 dark:bg-transparent"
              />
            </div>
          )}
        />
        {errors?.address && (
          <p className="text-red-400 text-sm mb-3">{errors.address?.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm">Gender</p>
        <Controller
          control={control}
          name="gender"
          render={({ field: { onChange, value } }) => (
            <div className="flex flex-col gap-1">
              <RadioGroup
                value={value}
                onValueChange={onChange}
                className="flex flex-row gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <label htmlFor="male" className="text-sm">
                    Laki-laki
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <label htmlFor="female" className="text-sm">
                    Perempuan
                  </label>
                </div>
              </RadioGroup>
            </div>
          )}
        />
        {errors?.gender && (
          <p className="text-red-400 text-sm mb-3">{errors.gender?.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <Controller
          control={control}
          name="phoneNumber"
          render={({ field: { onChange, value } }) => (
            <div className="flex flex-col gap-1">
              <label htmlFor="phoneNumber" className="text-sm">
                Nomor Handphone
              </label>
              <Input
                type="number"
                id="phoneNumber"
                placeholder=""
                value={value}
                onChange={onChange}
                className="w-full border border-gray-300 rounded-lg dark:border-gray-400 dark:bg-transparent"
              />
            </div>
          )}
        />
        {errors?.phoneNumber && (
          <p className="text-red-400 text-sm mb-3">
            {errors.phoneNumber?.message}
          </p>
        )}
      </div>
      <Button color="primary" type="submit" className="w-fit mt-4">
        Simpan
      </Button>
    </form>
  );
}
