"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { User, Phone, Lock, MapPin } from "lucide-react";
import Select from "react-select";
import axios from "axios";
import { registerCandidate } from "@/store/authThunks";

export default function RegisterForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [cities, setCities] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    password: "",
    location: null, // Store city object for react-select
  });
  const [errors, setErrors] = useState({});

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.mobile.match(/^[6-9]\d{9}$/)) {
      newErrors.mobile = "Please enter a valid 10-digit Indian mobile number starting with 6-9";
    }
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }
    if (!formData.location) newErrors.location = "Please select a city";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile") {
      const cleanedValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData({ ...formData, [name]: cleanedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCityChange = (selectedOption) => {
    setFormData({ ...formData, location: selectedOption });
    setErrors((prev) => ({ ...prev, location: "" }));
  };

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
      router.push("/jobs");
    } catch (error) {
      console.error("Candidate registration error:", error);
      toast.error(error || "Candidate registration failed. Please try again.");
    }
  };

  // Fetch cities
  useEffect(() => {
    const fetchData = async () => {
      try {
        const citiesRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/cities`);
        setCities(citiesRes.data.data);

        // Set default city (Hyderabad, Telangana)
        const hyderabad = citiesRes.data.data.find(
          (city) => city.name === "Hyderabad" && city.stateName === "Telangana"
        );
        if (hyderabad) {
          setFormData((prev) => ({
            ...prev,
            location: {
              value: hyderabad._id,
              label: `${hyderabad.name}, ${hyderabad.stateName}`,
              _id: hyderabad._id,
            },
          }));
        }
      } catch (error) {
        console.error("Fetch cities error:", error);
        toast.error("Failed to fetch cities");
      }
    };
    fetchData();
  }, []);

  // Format cities for react-select
  const cityOptions = cities.map((city) => ({
    value: city._id,
    label: `${city.name}, ${city.stateName}`,
    _id: city._id,
  }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Register for Job
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <div className="flex items-center border rounded-xl p-3 bg-gray-50">
              <User className="w-5 h-5 text-gray-500 mr-2" />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full bg-transparent focus:outline-none text-gray-800"
                required
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Mobile */}
          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number
            </label>
            <div className="flex items-center border rounded-xl p-3 bg-gray-50">
              <Phone className="w-5 h-5 text-gray-500 mr-2" />
              <span className="text-gray-800 mr-2">+91</span>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="9876543210"
                className="w-full bg-transparent focus:outline-none text-gray-800"
                maxLength={10}
                required
              />
            </div>
            {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="flex items-center border rounded-xl p-3 bg-gray-50">
              <Lock className="w-5 h-5 text-gray-500 mr-2" />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full bg-transparent focus:outline-none text-gray-800"
                required
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* City */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <div className="flex items-center border rounded-xl p-3 bg-gray-50">
              <MapPin className="w-5 h-5 text-gray-500 mr-2" />
              <Select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleCityChange}
                options={cityOptions}
                placeholder="Select a city"
                className="w-full"
                classNamePrefix="react-select"
                required
              />
            </div>
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold text-lg shadow-md hover:bg-orange-600 transition"
          >
            Register Now
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-orange-500 font-semibold hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}