"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

export default function PayloadList() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to fetch contacts');
        }

        const data = await response.json();
        setContacts(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchContacts();
  }, [token]);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  // Filter only contacts that have JSON payload
  const jsonContacts = contacts.filter(contact => {
    const payload = parsePayload(contact.message);
    return payload && typeof payload === 'object';
  });

  return (
    <div className="min-h-screen py-10">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            All JSON Payloads
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complete webhook payload data - {jsonContacts.length} records found
          </p>
        </div>

        <motion.div
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {loading && (
            <div className="text-center text-gray-600 text-lg">Loading payloads...</div>
          )}
          
          {error && (
            <div className="text-center text-red-600 bg-red-50 p-6 rounded-2xl">
              {error}
            </div>
          )}
          
          {!loading && !error && jsonContacts.length === 0 && (
            <div className="text-center text-gray-600 bg-white p-12 rounded-2xl shadow-lg">
              No JSON payloads found in contacts
            </div>
          )}
          
          {!loading && !error && jsonContacts.map((contact, index) => {
            const payload = parsePayload(contact.message);
            
            return (
              <motion.div
                key={contact._id}
                variants={itemVariants}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
              >
                {/* Header with contact info */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
                  <div className="flex flex-wrap justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold">
                        {contact.name} • {contact.phone}
                      </h3>
                      <p className="text-indigo-100 mt-1">
                        {formatDateTime(contact.createdAt)}
                      </p>
                    </div>
                    <div className="flex gap-3 mt-3 sm:mt-0">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
                        }}
                        className="bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-gray-100 font-medium text-sm"
                      >
                        Copy JSON
                      </button>
                      <span className="bg-black bg-opacity-20 px-3 py-2 rounded-lg text-sm">
                        {Object.keys(payload).length} fields
                      </span>
                    </div>
                  </div>
                </div>

                {/* JSON Payload */}
                <div className="p-0">
                  <pre className="bg-gray-900 text-green-400 p-6 text-sm overflow-auto max-h-96">
                    {JSON.stringify(payload, null, 2)}
                  </pre>
                </div>
              </motion.div>
            );
          })}

          {/* Show non-JSON contacts count */}
          {!loading && contacts.length > 0 && (
            <motion.div 
              variants={itemVariants}
              className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center"
            >
              <p className="text-yellow-800">
                {contacts.length - jsonContacts.length} regular contact messages (non-JSON) hidden
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Floating action button to copy all JSON */}
        {jsonContacts.length > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => {
              const allPayloads = jsonContacts.map(contact => ({
                id: contact._id,
                name: contact.name,
                phone: contact.phone,
                createdAt: contact.createdAt,
                payload: parsePayload(contact.message)
              }));
              navigator.clipboard.writeText(JSON.stringify(allPayloads, null, 2));
            }}
            className="fixed bottom-6 right-6 bg-indigo-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-indigo-700 font-medium flex items-center gap-2"
          >
            <span>Copy All JSON</span>
          </motion.button>
        )}
      </section>
    </div>
  );
}