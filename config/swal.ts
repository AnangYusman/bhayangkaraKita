import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const Toast = MySwal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast: any) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

export function loading(msg?: any) {
  let timerInterval: any;
  MySwal.fire({
    title: msg || "Loading...",
    allowOutsideClick: false,
    timerProgressBar: true,
    didOpen: () => {
      MySwal.showLoading();
      timerInterval = setInterval(() => {}, 100);
    },
    willClose: () => {
      clearInterval(timerInterval);
    },
  });
}

export function error(msg?: any) {
  MySwal.fire({
    icon: "error",
    title: "Failed...",
    text: msg || "Unknown Error",
    customClass: {
      popup: "custom-popup",
      confirmButton: "custom-button",
    },
  });
}

export function successRouter(redirect: string, router?: any) {
  MySwal.fire({
    title: "Success!",
    icon: "success",
    confirmButtonColor: "#6642f5",
    confirmButtonText: "Ok",
    allowOutsideClick: false,
  }).then((result: any) => {
    if (result.isConfirmed) {
      router.push(redirect);
    }
  });
}

export function success(title: string) {
  Swal.fire({
    title: "Success!",
    icon: "success",
    confirmButtonColor: "#6642f5",
    confirmButtonText: "OK",
  });
}

export function close() {
  MySwal.close();
}

export function warning(text: string, redirect: string, router?: any) {
  MySwal.fire({
    title: text,
    icon: "warning",
    confirmButtonColor: "#3085d6",
    confirmButtonText: "OK",
  }).then((result: any) => {
    if (result.isConfirmed) {
      router.push(redirect);
    }
  });
}

export function successToast(title: string, text: string) {
  Toast.fire({
    icon: "success",
    title: title,
    text: text,
  });
}
