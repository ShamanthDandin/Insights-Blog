import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignupInput } from "@sampi019/insights-common";
import axios from "axios";
import { BACKEND_URL } from "../config";

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const nav = useNavigate();
  const [postinputs, setInputs] = useState<SignupInput>({
    name: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function sendRequest() {
    console.log(postinputs);
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`,
        postinputs
      );
      const jwt = res.data;
      localStorage.setItem("token", jwt.jwt);
      console.log(jwt)
      nav("/blogs");
    } catch (e) {
      console.log(e);
      alert("Error try again")
    }
  }

  return (
    <div className="h-screen flex justify-center flex-col">
      <div className="flex justify-center ">
        <div>
          <div className="px-16">
            <div className="text-3xl font-extrabold">
              {type === "signup" ? "Create An Account" : "Login To Your Account"}
            </div>
            <div
              className={`text-slate-500 pt-2 pb-2 ${
                type === "signup" ? "pl-8" : "pl-12"
              }`}
            >
              {type === "signup"
                ? "Already have an account?"
                : "Don't have an account?"}
              <Link
                className="pl-1 underline font-semibold text-black"
                to={type === "signin" ? "/signup" : "/signin"}
              >
                {type === "signup" ? "Login" : "Create"}
              </Link>
            </div>
          </div>
          <div className={type === "signup" ? "block" : "hidden"}>
            <LabelInput
              label="Name"
              name="name"
              placeholder="Enter Your Name"
              onChan={handleInputChange}
            />
          </div>

          <LabelInput
            label="Email"
            name="email"
            placeholder="Enter Valid Email"
            onChan={handleInputChange}
          />

          <LabelInput
            label="Password"
            name="password"
            type="password"
            placeholder="Enter a Password"
            onChan={handleInputChange}
          />

          <button
            type="button"
            onClick={sendRequest}
            className="mt-7 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
          >
            {type === "signup" ? "Sign up" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

interface LabelInputType {
  label: string;
  name: string;
  placeholder: string;
  onChan: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

function LabelInput({ label, name, placeholder, onChan, type }: LabelInputType) {
  return (
    <div>
      <div>
        <label className="block mb-2 text-sm font-medium text-black pt-2">
          {label}
        </label>
        <input
          type={type || "text"}
          name={name}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder={placeholder}
          required
          onChange={onChan}
        />
      </div>
    </div>
  );
}
