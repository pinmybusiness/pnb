'use client';
import { useState, useEffect } from "react";
import { Shield, Search, Phone, User, Calendar, Users } from "lucide-react";
import { toast } from "react-hot-toast";
import apiClient from "@/lib/apiClient";

const SpamNumbers = () => {
  const [spamNumbers, setSpamNumbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSpamNumbers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/v1/calls/spam-numbers');
      
      if (response.data.success) {
        setSpamNumbers(response.data.data || []);
      }
    } catch (error) {
      toast.error("Failed to fetch spam numbers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpamNumbers();
  }, []);

  const filteredNumbers = spamNumbers.filter(spam => 
    spam.phoneNumber?.includes(searchTerm) ||
    spam.reportedBy?.some(reporter => 
      reporter?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Spam Numbers</h1>
        <p className="text-gray-600">Manage reported spam numbers</p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search phone numbers or reporters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        {filteredNumbers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Shield className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p>No spam numbers found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredNumbers.map((spam) => (
              <div key={spam._id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <Phone className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{spam.phoneNumber}</div>
                      <div className="text-sm text-gray-500">
                        Reported {new Date(spam.lastReportedAt).toLocaleDateString('en-IN')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                      {spam.spamCount} time{spam.spamCount !== 1 ? 's' : ''}
                    </div>
                    
                    {/* 👇 Reporters show */}
                    <div className="text-xs text-gray-500 mt-1">
                      {Array.isArray(spam.reportedBy) && spam.reportedBy.length > 0 ? (
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {spam.reportedBy.length} reporter{spam.reportedBy.length !== 1 ? 's' : ''}
                        </div>
                      ) : (
                        <div>system check</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 👇 Agar reporters hain toh unke names show karo */}
                {Array.isArray(spam.reportedBy) && spam.reportedBy.length > 0 && (
                  <div className="mt-2 text-xs text-gray-600">
                    <strong>Reported by:</strong> {spam.reportedBy.map(reporter => reporter?.name || 'Unknown').join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpamNumbers;