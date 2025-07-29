"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { authenticate } from '@/utils/actions';
import { getSession, signIn } from "next-auth/react";
import { sendRequest } from "@/utils/api";
import { useTranslation } from "react-i18next";

export default function LoginForm() {
  const { t } = useTranslation()
  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    name: "",
  });

  const commonPasswords = ['12345678', 'password', 'qwerty', 'abc123', '123456789'];
  const isCommonPassword = (password: string) => {
    return commonPasswords.includes(password.toLowerCase());
  };

  const isNumericOnly = (password: string) => {
    return /^\d+$/.test(password);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const username = formData.email;
    const password = formData.password;
    const data = await authenticate(username, password);

    if(data?.code === 1){
      toast.error(data?.error);
    }
    else{
      const session = await getSession();
      if (session) {
        router.push("/");
      } else {
        toast.error("Failed to retrieve session");
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!formData.email.includes("@"))
    {
      toast.error("Invalid email");
      return;
    }
    if(formData.name == "")
    {
      toast.error("Name is required");
      return;
    }
    if(formData.password.length < 8)
    {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (isCommonPassword(formData.password)) {
      toast.error("This password is too common");
      return;
    }

    if (isNumericOnly(formData.password)) {
      toast.error("Password cannot be entirely numeric");
      return;
    }
    if(formData.password !== formData.passwordConfirm)
    {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await sendRequest<IBackendRes<ILogin>>({
        method: "POST",
        url: 'http://127.0.0.1:8000/api/auth/register/',
        body: {
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.passwordConfirm,
          full_name: formData.name,
          phone: "0123456789"
        }
      });
      toast.success("Registration successful");
    } catch (err: any) {
      toast.error(err?.message || "Registration failed");
    }
  }

  return (
    <div className="flex-grow">
      <div className="flex h-full w-full items-center justify-center mt-12">
        <ToastContainer position="top-center" />
        <div className="card p-4 w-full max-w-sm border border-gray-300 rounded-lg">
          <div className="flex mb-6 border-b border-gray-300 dark:border-gray-600">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 text-center py-2 font-semibold ${
                isLogin ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"
              }`}
            >
              { t("login") }
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 text-center py-2 font-semibold ${
                !isLogin ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"
              }`}
            >
              { t("register") }
            </button>
          </div>
          <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
            { !isLogin &&
              <>
                <div>
                  <label className="block text-sm font-medium mb-1"> {t("Full name")} <span className="text-red-600">(*)</span> </label>
                  <input
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email <span className="text-red-600">(*)</span></label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{ t("password") } <span className="text-red-600">(*)</span></label>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{ t("Confirm Password") }<span className="text-red-600">(*)</span></label>
                  <input
                    type="password"
                    name="passwordConfirm"
                    required
                    value={formData.passwordConfirm}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </>
            }

            { isLogin &&
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{ t("password") }</label>
                  <div className="relative">
                    <input
                      type={ showPass ? "text" : "password" }
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2"
                    />
                    <button type="button" className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600 hover:text-gray-800"
                      onClick={() => setShowPass(!showPass)}
                    >
                      <svg className="shrink-0 size-3.5" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" >
                        {showPass ? (
                          <>
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                            <circle cx="12" cy="12" r="3" />
                          </>
                        ) : (
                          <>
                            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                            <line x1="2" y1="2" x2="22" y2="22" />
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                    
                </div>
              </>
            }
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            > {isLogin ? t("login") : t("register")} </button>
          </form>
          { isLogin && 
            <div className="flex justify-between">
              <div className="mt-4 flex justify-between text-sm">
                <Link href="/forgot-password" className="text-blue-600 hover:underline">
                  {t("Forgot Password?")}
                </Link>
              </div>

              <div className="flex justify-center gap-2 rounded">
                <button onClick={() => signIn("google")} className="bg-red-600 text-white px-2 py-2 rounded hover:bg-red-700 mt-2">
                  <FaGoogle className="text-lg" />
                </button>
                <button className="bg-blue-600 text-white px-2 py-2 rounded hover:bg-blue-700 mt-2">
                  <FaFacebookF className="text-lg" />
                </button>
              </div>
            </div>
          }
        </div>
      </div>
    </div>

  );
}