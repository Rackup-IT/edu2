"use client";

import { useEffect, useMemo, useState } from "react";

type Subscriber = {
  _id: string;
  email: string;
  createdAt: string;
};

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
};

const escapeCsvValue = (value: string) => {
  const needsQuotes = /[",\n\r]/.test(value);
  const escaped = value.replace(/"/g, '""');
  return needsQuotes ? `"${escaped}"` : escaped;
};

export default function SubscribersDashboardPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/subscribers");
      const data = await res.json();
      if (data.success) {
        setSubscribers(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch subscribers", error);
    } finally {
      setLoading(false);
    }
  };

  const csv = useMemo(() => {
    const header = ["email", "subscribed_at"];
    const rows = subscribers.map((s) => [s.email ?? "", s.createdAt ?? ""]);
    return [header, ...rows]
      .map((row) => row.map((cell) => escapeCsvValue(String(cell))).join(","))
      .join("\n");
  }, [subscribers]);

  const exportCsv = () => {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `subscribers-${date}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-neutral-900">Subscribers</h1>
            <p className="text-neutral-500 mt-2">
              {loading ? "Loading..." : `${subscribers.length} subscriber${subscribers.length === 1 ? "" : "s"}`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchSubscribers}
              className="border border-neutral-200 text-neutral-900 px-6 py-3 rounded-full font-bold hover:bg-neutral-50 transition-colors"
              disabled={loading}
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={exportCsv}
              className="bg-brand-yellow text-neutral-900 px-4 py-2 flex items-center gap-2 rounded-lg font-medium hover:bg-(--brand-yellow-hover) transition-colors"
              disabled={subscribers.length === 0}
            >
              Export CSV
            </button>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-4 font-semibold text-neutral-600">Email</th>
                  <th className="px-6 py-4 font-semibold text-neutral-600">Subscribed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {loading ? (
                  <tr>
                    <td colSpan={2} className="px-6 py-8 text-center text-neutral-500">
                      Loading...
                    </td>
                  </tr>
                ) : subscribers.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-6 py-8 text-center text-neutral-500">
                      No subscribers yet.
                    </td>
                  </tr>
                ) : (
                  subscribers.map((subscriber) => (
                    <tr key={subscriber._id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-neutral-900">{subscriber.email}</td>
                      <td className="px-6 py-4 text-neutral-600">{formatDate(subscriber.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

