"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Phone, User, Baby } from "lucide-react";
import toast from "react-hot-toast";

const Entry = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    restaurantName: "Bella Vista Restaurant",
    customerName: "",
    adults: "",
    children: "",
    phone: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.adults || !formData.phone) {
      toast.error("Please fill required fields (Name, Adults, Phone)");
      return;
    }

    const waitingList = JSON.parse(localStorage.getItem("waitingList") || "[]");
    const newEntry = {
      id: Date.now(),
      ...formData,
      adults: parseInt(formData.adults),
      children: parseInt(formData.children) || 0,
      timestamp: new Date().toISOString(),
      served: false,
    };
    waitingList.push(newEntry);
    localStorage.setItem("waitingList", JSON.stringify(waitingList));

    toast.success(`${formData.customerName} added to waiting list!`);

    setFormData({
      ...formData,
      customerName: "",
      adults: "",
      children: "",
      phone: "",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">New Customer</h1>
          <p className="text-gray-500">Add to waiting list</p>
        </div>

        {/* Entry Form */}
        <div className="bg-white shadow-md rounded-xl">
          <div className="border-b border-soft px-4 py-3">
            <h2 className="text-lg font-semibold text-gray-900">
              Customer Details
            </h2>
          </div>
          <div className="p-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Name */}
              <div className="space-y-2">
                <label
                  htmlFor="customerName"
                  className="text-sm font-medium flex items-center gap-2 text-gray-700"
                >
                  <User className="w-4 h-4 text-primary" />
                  Customer Name *
                </label>
                <input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData({ ...formData, customerName: e.target.value })
                  }
                  placeholder="Enter full name"
                  className="block w-full rounded-lg border border-gray-300 focus:border-primary focus:ring-primary h-12 px-3"
                  required
                />
              </div>

              {/* Party Size */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="adults"
                    className="text-sm font-medium flex items-center gap-2 text-gray-700"
                  >
                    <Users className="w-4 h-4 text-primary" />
                    Adults *
                  </label>
                  <input
                    id="adults"
                    type="number"
                    min="1"
                    max="20"
                    value={formData.adults}
                    onChange={(e) =>
                      setFormData({ ...formData, adults: e.target.value })
                    }
                    placeholder="0"
                    className="block w-full rounded-lg border border-gray-300 focus:border-primary focus:ring-primary h-12 px-3"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="children"
                    className="text-sm font-medium flex items-center gap-2 text-gray-700"
                  >
                    <Baby className="w-4 h-4 text-primary" />
                    Children
                  </label>
                  <input
                    id="children"
                    type="number"
                    min="0"
                    max="10"
                    value={formData.children}
                    onChange={(e) =>
                      setFormData({ ...formData, children: e.target.value })
                    }
                    placeholder="0"
                    className="block w-full rounded-lg border border-gray-300 focus:border-primary focus:ring-primary h-12 px-3"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="text-sm font-medium flex items-center gap-2 text-gray-700"
                >
                  <Phone className="w-4 h-4 text-primary" />
                  Phone Number *
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="(555) 123-4567"
                  className="block w-full rounded-lg border border-gray-300 focus:border-primary focus:ring-primary h-12 px-3"
                  required
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-primary text-white rounded-lg h-12 font-medium hover:bg-primary/90 transition"
              >
                Add to Waiting List
              </button>
            </form>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/dashboard//waiting-list")}
            className="flex-1 border border-gray-300 text-gray-700 rounded-lg h-12 font-medium hover:bg-gray-100 transition"
          >
            View Waiting List
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="flex-1 bg-[#FCEAE5] rounded-lg h-12 font-medium hover:bg-[#A9D6A9] transition"
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Entry;
