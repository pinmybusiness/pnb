"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import apiClient from "@/lib/apiClient";

export default function PayloadList() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("all"); // 'all', 'json', 'non-json'

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await apiClient.get('/api/contact');
        setContacts(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const formatDateTime = (date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    }).format(new Date(date)).replace(',', ', ');
  };

  const parsePayload = (message) => {
    try {
      return JSON.parse(message);
    } catch {
      return null;
    }
  };

  const isJSON = (message) => {
    try {
      JSON.parse(message);
      return true;
    } catch {
      return false;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  // Filter contacts based on view mode
  const filteredContacts = contacts.filter(contact => {
    switch (viewMode) {
      case "json":
        return isJSON(contact.message);
      case "non-json":
        return !isJSON(contact.message);
      default:
        return true; // 'all' - show everything
    }
  });

  const jsonContactsCount = contacts.filter(contact => isJSON(contact.message)).length;
  const nonJsonContactsCount = contacts.length - jsonContactsCount;

  return (
    <div className="min-h-screen py-10">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            All Contact Data
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complete contact data - {contacts.length} total records
          </p>
        </div>

        {/* View Mode Toggle */}
        {/* <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-2 flex">
            {[
              { key: "all", label: `All (${contacts.length})` },
              { key: "json", label: `JSON (${jsonContactsCount})` },
              { key: "non-json", label: `Regular (${nonJsonContactsCount})` }
            ].map((mode) => (
              <button
                key={mode.key}
                onClick={() => setViewMode(mode.key)}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  viewMode === mode.key
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div> */}

        <motion.div
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {loading && (
            <div className="text-center text-gray-600 text-lg py-12">
              Loading contacts...
            </div>
          )}
          
          {error && (
            <div className="text-center text-red-600 bg-red-50 p-6 rounded-2xl">
              {error}
            </div>
          )}
          
          {!loading && !error && filteredContacts.length === 0 && (
            <div className="text-center text-gray-600 bg-white p-12 rounded-2xl shadow-lg">
              No contacts found for selected filter
            </div>
          )}
          
          {!loading && !error && filteredContacts.map((contact, index) => {
            const payload = parsePayload(contact.message);
            const isJson = isJSON(contact.message);
            
            return (
              <motion.div
                key={contact._id}
                variants={itemVariants}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
              >
                {/* Header with contact info */}
                <div className={`p-6 text-white ${
                  isJson 
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600" 
                    : "bg-gradient-to-r from-blue-500 to-cyan-600"
                }`}>
                  <div className="flex flex-wrap justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold">
                        {contact.name} • {contact.phone}
                      </h3>
                      <p className="opacity-90 mt-1">
                        {formatDateTime(contact.createdAt)}
                      </p>
                    </div>
                    <div className="flex gap-3 mt-3 sm:mt-0">
                      {isJson ? (
                        <>
                          {/* <button
                            onClick={() => {
                              navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
                            }}
                            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg font-medium text-sm backdrop-blur-sm"
                          >
                            Copy JSON
                          </button> */}
                          <span className="bg-black bg-opacity-20 px-3 py-2 rounded-lg text-sm">
                            {Object.keys(payload).length} fields
                          </span>
                        </>
                      ) : (
                        <span className="bg-black bg-opacity-20 px-3 py-2 rounded-lg text-sm">
                          Regular Message
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-0">
                  {isJson ? (
                    <pre className="bg-gray-900 text-green-400 p-6 text-sm overflow-auto max-h-96">
                      {JSON.stringify(payload, null, 2)}
                    </pre>
                  ) : (
                    <div className="p-6 bg-gray-50">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-semibold text-gray-900">Message:</h4>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(contact.message);
                          }}
                          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                        >
                          Copy Text
                        </button>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap bg-white p-4 rounded-lg border">
                        {contact.message}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Floating action buttons */}
        {filteredContacts.length > 0 && (
          <div className="fixed bottom-6 right-6 flex flex-col gap-3">
            {viewMode === "json" && jsonContactsCount > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => {
                  const allPayloads = filteredContacts.map(contact => ({
                    id: contact._id,
                    name: contact.name,
                    phone: contact.phone,
                    createdAt: contact.createdAt,
                    payload: parsePayload(contact.message)
                  }));
                  navigator.clipboard.writeText(JSON.stringify(allPayloads, null, 2));
                }}
                className="bg-indigo-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-indigo-700 font-medium flex items-center gap-2"
              >
                <span>Copy All JSON</span>
              </motion.button>
            )}
            
            {viewMode === "all" && contacts.length > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => {
                  const allData = filteredContacts.map(contact => ({
                    id: contact._id,
                    name: contact.name,
                    phone: contact.phone,
                    createdAt: contact.createdAt,
                    message: contact.message,
                    isJSON: isJSON(contact.message),
                    ...(isJSON(contact.message) && { payload: parsePayload(contact.message) })
                  }));
                  navigator.clipboard.writeText(JSON.stringify(allData, null, 2));
                }}
                className="bg-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-700 font-medium flex items-center gap-2"
              >
                <span>Copy All Data</span>
              </motion.button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}