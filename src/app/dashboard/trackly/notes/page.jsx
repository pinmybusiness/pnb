'use client';

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Search, StickyNote, Phone, Calendar,
  ChevronRight, X,
  MessageSquare, User, AlertCircle
} from "lucide-react";
import { useSelector } from "react-redux";
import apiClient from "@/lib/apiClient";
import { Card, Input } from "@/components/ui";
import Pagination from "@/components/ui/Pagination";
import Skeleton from "@/components/ui/Skeleton";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtDate = (date) => {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date(date));
};

const timeAgo = (date) => {
  if (!date) return "";
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return fmtDate(date);
};

// ─── Timeline Modal (fetches notes for a phone on open) ───────────────────────

const fmtTime = (date) => {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit", minute: "2-digit", hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(new Date(date));
};

const TimelineModal = ({ phone, onClose }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const { data } = await apiClient.get("/api/v1/calls/notes", {
          params: { phone },
        });
        if (data.success) setNotes(data.data || []);
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
  }, [phone]);

  // oldest → newest
  const sorted = [...notes].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  // Group by date
  const grouped = sorted.reduce((acc, note) => {
    const key = fmtDate(note.createdAt);
    if (!acc[key]) acc[key] = [];
    acc[key].push(note);
    return acc;
  }, {});

  const dateGroups = Object.entries(grouped);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-start sm:justify-end bg-black/60 backdrop-blur-sm p-0 "
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full sm:w-96 flex flex-col max-h-[90vh] sm:max-h-screen sm:h-full">

        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-primary flex items-center justify-center shadow-sm flex-shrink-0">
              <Phone className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900 tracking-wide font-mono">{phone}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {loading
                  ? "Fetching notes…"
                  : `${notes.length} note${notes.length !== 1 ? "s" : ""} · ${dateGroups.length} day${dateGroups.length !== 1 ? "s" : ""}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100 mx-5" />

        {/* Timeline body */}
        <div className="overflow-y-auto flex-1 px-5 py-4">
          {loading ? (
            /* Skeleton */
            <div className="space-y-5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    <Skeleton className="h-8 w-8 rounded-xl" />
                    <Skeleton className="w-0.5 h-10 rounded-full" />
                  </div>
                  <div className="flex-1 pb-2 space-y-2">
                    <Skeleton className="h-3 w-20 rounded" />
                    <Skeleton className="h-16 w-full rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : notes.length === 0 ? (
            <div className="py-12 text-center">
              <StickyNote className="h-10 w-10 text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-400">No notes for this contact</p>
            </div>
          ) : (
            <div className="space-y-0">
              {dateGroups.map(([date, dayNotes], groupIdx) => (
                <div key={date}>
                  {/* Date pill */}
                  <div className="flex items-center gap-3 mb-3 mt-1">
                    <span className="text-xs font-semibold text-primary bg-primary-light px-3 py-1 rounded-full border border-orange-100">
                      {date}
                    </span>
                    <div className="h-px flex-1 bg-gray-100" />
                  </div>

                  {/* Notes for this day */}
                  {dayNotes.map((note, noteIdx) => {
                    const isLastInGroup = noteIdx === dayNotes.length - 1;
                    const isLastGroup   = groupIdx === dateGroups.length - 1;
                    const showLine      = !(isLastInGroup && isLastGroup);

                    return (
                      <div key={note._id} className="flex gap-3 mb-1 justify-end">
                        {/* Note card — right aligned */}
                        <div className="flex-1 pb-3 min-w-0 max-w-[85%]">
                          {/* Meta row */}
                          <div className="flex items-center justify-end gap-2 mb-1.5">
                            <span className="text-xs text-gray-400">{fmtTime(note.createdAt)}</span>
                            <span className="text-gray-300">·</span>
                            <span className="text-xs font-semibold text-gray-800">
                              {note.agentName || "Unknown"}
                            </span>
                          </div>

                          {/* Note bubble */}
                          <div className="bg-primary-light border border-orange-100 rounded-2xl rounded-tr-sm px-4 py-3">
                            <p className="text-sm text-gray-800 leading-relaxed">{note.note}</p>
                          </div>
                        </div>

                        {/* Avatar + line */}
                        <div className="flex flex-col items-center flex-shrink-0 w-8">
                          <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center z-10 flex-shrink-0 shadow-sm">
                            <span className="text-xs font-bold text-white">
                              {(note.agentName || "?")[0].toUpperCase()}
                            </span>
                          </div>
                          {showLine && (
                            <div className="w-0.5 flex-1 min-h-[16px] bg-gray-200 rounded-full my-1" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Skeleton rows ────────────────────────────────────────────────────────────

const SkeletonRows = () =>
  [...Array(7)].map((_, i) => (
    <tr key={i} className="border-b border-gray-100">
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
          <Skeleton className="h-4 w-28 rounded" />
        </div>
      </td>
      <td className="px-4 py-3.5 hidden sm:table-cell">
        <Skeleton className="h-5 w-24 rounded-full" />
      </td>
      <td className="px-4 py-3.5">
        <Skeleton className="h-4 w-48 rounded" />
      </td>
      <td className="px-4 py-3.5 hidden md:table-cell text-center">
        <Skeleton className="h-6 w-10 rounded-full mx-auto" />
      </td>
      <td className="px-4 py-3.5 hidden lg:table-cell">
        <Skeleton className="h-4 w-16 rounded" />
      </td>
      <td className="px-4 py-3.5" />
    </tr>
  ));

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function NotesPage() {
  const { user } = useSelector((state) => state.auth);

  const [contacts, setContacts]       = useState([]);
  const [searchTerm, setSearchTerm]   = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [selectedPhone, setSelectedPhone] = useState(null);
  const [pagination, setPagination]   = useState({
    page: 1, limit: 20, total: 0, pages: 1,
  });

  const debounceRef = useRef(null);

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(value);
    }, 400);
  }, []);

  const fetchContacts = useCallback(async (pageNum = 1, search = "") => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await apiClient.get("/api/v1/calls/notes/branch/by-contact", {
        params: { page: pageNum, limit: 20, search: search || undefined },
      });
      if (!data.success) throw new Error(data.message || "Failed");
      setContacts(data.data);
      setPagination({
        page:  data.pagination.page,
        limit: data.pagination.limit,
        total: data.pagination.total,
        pages: data.pagination.totalPages,
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load + search trigger
  useEffect(() => {
    fetchContacts(1, debouncedSearch);
  }, [debouncedSearch, fetchContacts]);

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  const handlePageChange = useCallback((newPage) => {
    if (newPage < 1 || newPage > pagination.pages || loading) return;
    fetchContacts(newPage, debouncedSearch);
  }, [pagination.pages, loading, fetchContacts, debouncedSearch]);

  return (
    <div className="space-y-4 animate-fade-in p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Agent Notes</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {user?.role === 6
              ? "All notes added by agents in your branch"
              : "Notes from your team members"}
          </p>
        </div>

        {!loading && (
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 bg-primary-light text-primary text-sm font-medium px-3 py-1.5 rounded-full">
              <Phone className="h-3.5 w-3.5" />
              {pagination.total} contacts
            </div>
          </div>
        )}
      </div>

      {/* Search */}
      <Card className="p-3 sm:p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by phone, agent name or note content..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 text-sm"
          />
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        {error ? (
          <div className="p-12 text-center">
            <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-3" />
            <p className="text-red-600 font-medium mb-1">Failed to load notes</p>
            <p className="text-sm text-gray-500 mb-4">{error}</p>
            <button
              onClick={() => fetchContacts(1, debouncedSearch)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">
                    Agent(s)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Latest Note
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">
                    Notes
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">
                    Last Activity
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <SkeletonRows />
                ) : contacts.length === 0 ? null : (
                  contacts.map((contact) => (
                    <tr
                      key={contact.phone}
                      onClick={() => setSelectedPhone(contact.phone)}
                      className="hover:bg-orange-50/40 cursor-pointer transition-colors group border-b border-gray-100 last:border-0"
                    >
                      {/* Phone */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
                            <Phone className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-mono text-sm font-semibold text-gray-900">
                            {contact.phone}
                          </span>
                        </div>
                      </td>

                      {/* Agents */}
                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {contact.agentNames.slice(0, 2).map((name) => (
                            <span
                              key={name}
                              className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
                            >
                              <User className="h-2.5 w-2.5" />
                              {name}
                            </span>
                          ))}
                          {contact.agentNames.length > 2 && (
                            <span className="text-xs text-gray-400">
                              +{contact.agentNames.length - 2}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Latest note preview */}
                      <td className="px-4 py-3.5 max-w-xs">
                        <p className="text-sm text-gray-600 truncate">
                          {contact.latestNote || "—"}
                        </p>
                      </td>

                      {/* Count badge */}
                      <td className="px-4 py-3.5 hidden md:table-cell text-center">
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary bg-primary-light px-2.5 py-1 rounded-full">
                          <MessageSquare className="h-3.5 w-3.5" />
                          {contact.totalNotes}
                        </span>
                      </td>

                      {/* Last activity */}
                      <td className="px-4 py-3.5 hidden lg:table-cell whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                          <Calendar className="h-3.5 w-3.5" />
                          {timeAgo(contact.lastNoteAt)}
                        </div>
                      </td>

                      {/* Arrow */}
                      <td className="px-4 py-3.5 text-right">
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors ml-auto" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Empty state */}
            {!loading && contacts.length === 0 && (
              <div className="py-16 text-center">
                <StickyNote className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                <h3 className="text-base font-semibold text-gray-700 mb-1">
                  {debouncedSearch ? "No matching contacts" : "No notes yet"}
                </h3>
                <p className="text-sm text-gray-400">
                  {debouncedSearch
                    ? "Try different keywords"
                    : "Notes added by agents during calls will appear here"}
                </p>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Pagination */}
      {contacts.length > 0 && (
        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
          loading={loading}
          itemsLabel="contacts"
          showItemsCount
          showPageInfo
          className="mt-4"
        />
      )}

      {/* Timeline Modal */}
      {selectedPhone && (
        <TimelineModal
          phone={selectedPhone}
          onClose={() => setSelectedPhone(null)}
        />
      )}
    </div>
  );
}
