"use client";

import { X } from "lucide-react";
import PropTypes from "prop-types";
import { getDurationText, getOpportunityTypeText, getStipendText } from "@/utils/opportunity";

export default function ApplicationModal({
  isOpen,
  onClose,
  opportunity,
  coverLetter,
  setCoverLetter,
  resume,
  setResume,
  onSubmit,
}) {
  if (!isOpen || !opportunity) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setResume(file);
    } else {
      alert("Please upload a PDF file.");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="application-modal-title"
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 id="application-modal-title" className="text-lg font-semibold text-gray-900">
              Apply for Opportunity
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-full p-1"
              aria-label="Close application modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-900">{opportunity.title}</h4>
            <p className="text-gray-600 text-sm">
              {opportunity.branch?.parentRestaurant?.name}
              {opportunity.branch?.location && ` • ${opportunity.branch.location.city.name}`}
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-500">
              <div className="flex items-center">
                <span className="font-medium mr-1">Stipend:</span>
                {getStipendText(opportunity.stipend)}
              </div>
              <div className="flex items-center">
                <span className="font-medium mr-1">Type:</span>
                {getOpportunityTypeText(opportunity.opportunityType)}
              </div>

            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Letter (Optional)
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm resize-none"
              placeholder="Why are you interested in this opportunity?"
            ></textarea>
          </div>
          {/* <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resume (PDF)
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {resume && (
              <p className="mt-2 text-sm text-gray-600">Selected: {resume.name}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Upload a new resume or use the one from your profile.
            </p>
          </div> */}
          <button
            onClick={onSubmit}
            className="w-full bg-orange-600 text-white py-2.5 rounded-lg font-medium hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
          >
            Submit Application
          </button>
        </div>
      </div>
    </div>
  );
}

ApplicationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  opportunity: PropTypes.object,
  coverLetter: PropTypes.string.isRequired,
  setCoverLetter: PropTypes.func.isRequired,
//   resume: PropTypes.object,
//   setResume: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};