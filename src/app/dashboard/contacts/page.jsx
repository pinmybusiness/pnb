"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import apiClient from "@/lib/apiClient";

export default function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen py-10">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Contact Submissions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            View all contact form submissions below.
          </p>
        </div>

        <motion.div
          className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-200"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {loading && <p className="text-center text-gray-600">Loading...</p>}
          {error && <p className="text-center text-red-600">{error}</p>}
          {!loading && !error && contacts.length === 0 && (
            <p className="text-center text-gray-600">No submissions found.</p>
          )}
          {!loading && !error && contacts.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted At</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contacts.map((contact) => (
                    <motion.tr key={contact._id} variants={itemVariants}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{contact.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{contact.phone}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{contact.message}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDateTime(contact.createdAt)}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </section>
    </div>
  );
}