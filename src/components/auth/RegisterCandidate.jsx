// components/csr/RegisterFormContent.jsx
"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation"; // Correct import for App Router
import { toast } from "react-hot-toast";
import Select from "react-select";
import { registerCandidate } from "@/store/authThunks";

export default function RegisterCandidate({
  initialFormData,
  formFields,
  title = "Register",
  submitButtonText = "Submit",
  footerLink,
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  // Validation functions
  const validations = {
    name: (value) => (!value.trim() ? "Full name is required" : ""),
    mobile: (value) =>
      !value.match(/^[6-9]\d{9}$/) ? "Please enter a valid 10-digit Indian mobile number starting with 6-9" : "",
    password: (value) => (value.length < 8 ? "Password must be at least 8 characters long" : ""),
    location: (value) => (!value ? "Please select a city" : ""),
  };

  // Transform function for mobile
  const transformMobile = (value) => value.replace(/\D/g, "").slice(0, 10);

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    formFields.forEach((field) => {
      if (validations[field.name]) {
        const error = validations[field.name](formData[field.name]);
        if (error) newErrors[field.name] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (e, field) => {
    const { name, value } = e.target;
    const transformedValue = field.name === "mobile" ? transformMobile(value) : value;
    setFormData((prev) => ({ ...prev, [name]: transformedValue }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle select change
  const handleSelectChange = (selectedOption, field) => {
    setFormData((prev) => ({ ...prev, [field.name]: selectedOption }));
    setErrors((prev) => ({ ...prev, [field.name]: "" }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    try {
      await dispatch(
        registerCandidate({
          name: formData.name,
          mobile: formData.mobile,
          password: formData.password,
          location: formData.location?._id,
        })
      ).unwrap();
      toast.success("Registration successful!");
    //   router.refresh();
    window.location.reload();
    } catch (error) {
      console.error("Candidate registration error:", error);
      toast.error(error.message || "Candidate registration failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl  p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">{title}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {formFields.map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <div className="flex items-center border rounded-xl p-3 bg-gray-50">
                {field.icon}
                {field.prefix && <span className="text-gray-800 mr-2">{field.prefix}</span>}
                {field.type === "select" ? (
                  <Select
                    id={field.name}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={(selectedOption) => handleSelectChange(selectedOption, field)}
                    options={field.options}
                    placeholder={field.placeholder || "Select an option"}
                    className="w-full"
                    classNamePrefix="react-select"
                    required={field.required !== false}
                  />
                ) : (
                  <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={(e) => handleChange(e, field)}
                    placeholder={field.placeholder}
                    className="w-full bg-transparent focus:outline-none text-gray-800"
                    maxLength={field.maxLength}
                    required={field.required !== false}
                  />
                )}
              </div>
              {errors[field.name] && (
                <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
              )}
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold text-lg shadow-md hover:bg-orange-600 transition"
          >
            {submitButtonText}
          </button>
        </form>

        {footerLink && (
          <p className="text-center text-sm text-gray-600 mt-4">
            {footerLink.text}{" "}
            {typeof footerLink.linkText === "string" ? (
              <a href={footerLink.href} className="text-orange-500 font-semibold hover:underline">
                {footerLink.linkText}
              </a>
            ) : (
              footerLink.linkText
            )}
          </p>
        )}
      </div>
    </div>
  );
}