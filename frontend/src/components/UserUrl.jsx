import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllUserUrls } from "../api/user.api";
import { deleteShortUrlApi } from "../api/shortUrl.api";

const UserUrl = () => {
  const queryClient = useQueryClient();
  const {
    data: urls,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userUrls"],
    queryFn: getAllUserUrls,
    refetchInterval: 30000,
    staleTime: 0,
  });

  const [copiedId, setCopiedId] = useState(null);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [selectedQr, setSelectedQr] = useState(null);

  const handleCopy = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    setActionError(null);
    try {
      await deleteShortUrlApi(id);
      setConfirmDeleteId(null);
      await queryClient.invalidateQueries({ queryKey: ["userUrls"] });
    } catch (err) {
      setActionError(err.message || "Failed to delete URL");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownloadQr = async (shortUrl, slug) => {
    try {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shortUrl)}`;
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `qrcode-${slug || "link"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch {
      window.open(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shortUrl)}`, "_blank");
    }
  };

  const rawList = urls?.urls;
  const urlList = useMemo(() => rawList || [], [rawList]);

  // Filter links by search query
  const filteredList = useMemo(() => {
    const list = [...urlList].reverse();
    if (!search.trim()) return list;
    const query = search.toLowerCase();
    return list.filter(
      (item) =>
        item.short_url.toLowerCase().includes(query) ||
        item.full_url.toLowerCase().includes(query)
    );
  }, [urlList, search]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-700 border-t-transparent mb-3"></div>
        <p className="text-xs text-slate-400">Loading your links...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm">
        Error loading your URLs: {error?.message || "Unknown error"}
      </div>
    );
  }

  if (urlList.length === 0) {
    return (
      <div className="text-center py-12 px-6 bg-white rounded-2xl border border-slate-200/90 shadow-sm">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mb-4 shadow-inner">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-slate-800">No links created yet</h3>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
          Shorten a URL on the left to start tracking clicks and manage your active links.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Action Error Notice */}
      {actionError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center justify-between">
          <span>{actionError}</span>
          <button onClick={() => setActionError(null)} className="text-red-500 font-bold ml-2">✕</button>
        </div>
      )}

      {/* Search and Count Bar */}
      <div className="flex items-center justify-between gap-3 bg-white p-3 sm:p-3.5 rounded-2xl border border-slate-200/90 shadow-sm">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">
          {filteredList.length} {filteredList.length === 1 ? "Link" : "Links"}
        </span>

        {/* Search Input */}
        <div className="relative w-full sm:w-56">
          <input
            type="text"
            placeholder="Search links..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-700 transition-all"
          />
          <svg
            className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Links List Feed with Hidden Scrollbars & Smooth Scrolling */}
      <div className="max-h-[34rem] overflow-y-auto no-scrollbar space-y-3 scroll-smooth">
        {filteredList.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-2xl border border-slate-200 text-xs text-slate-400">
            No links matching "{search}"
          </div>
        ) : (
          filteredList.map((item) => {
            const fullShortUrl = `http://localhost:5000/${item.short_url}`;
            const isCopied = copiedId === item._id;
            const isConfirmingDelete = confirmDeleteId === item._id;
            const isDeleting = deletingId === item._id;

            return (
              <div
                key={item._id}
                className="group bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-4.5 shadow-sm hover:shadow-md hover:border-purple-200 hover:-translate-y-0.5 transition-all duration-200 ease-out flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4"
              >
                {/* Left: Icon & URL Details */}
                <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                  {/* Decorative Icon */}
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 border border-purple-100 group-hover:scale-105 transition-transform">
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                  </div>

                  {/* URL Text Container */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <a
                        href={fullShortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm sm:text-base font-mono font-bold text-slate-900 group-hover:text-purple-700 hover:underline transition-colors truncate"
                      >
                        localhost:5000/{item.short_url}
                      </a>
                      <a
                        href={fullShortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open short link"
                        className="text-slate-400 hover:text-purple-700 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>

                    {/* Destination preview */}
                    <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-500">
                      <span className="text-slate-400">↳</span>
                      <span className="truncate max-w-[200px] sm:max-w-xs lg:max-w-sm font-normal" title={item.full_url}>
                        {item.full_url}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Clicks Pill, Copy Button, QR Code, Delete Action */}
                <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                  {/* Clicks Pill */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-700"></span>
                    <span>{item.clicks} {item.clicks === 1 ? "click" : "clicks"}</span>
                  </div>

                  {/* Copy Button */}
                  <button
                    onClick={() => handleCopy(fullShortUrl, item._id)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 shadow-sm ${
                      isCopied
                        ? "bg-emerald-600 text-white shadow-emerald-200"
                        : "bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200/80 active:scale-95 cursor-pointer"
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  {/* QR Code Feature Button (Authenticated User) */}
                  <button
                    onClick={() => setSelectedQr(item)}
                    className="p-1.5 text-slate-400 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-all duration-200 cursor-pointer"
                    title="View & Download QR Code"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  </button>

                  {/* Delete / Invalidate Button & Confirmation */}
                  {isConfirmingDelete ? (
                    <div className="flex items-center gap-1 animate-fadeIn">
                      <button
                        onClick={() => handleDelete(item._id)}
                        disabled={isDeleting}
                        className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
                        title="Confirm deletion"
                      >
                        {isDeleting ? "..." : "Delete"}
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-medium transition-all cursor-pointer"
                        title="Cancel"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(item._id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                      title="Delete / Invalidate link"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* QR Code Modal for Selected Link */}
      {selectedQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7 max-w-sm w-full text-center space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">QR Code</h3>
              <button
                onClick={() => setSelectedQr(null)}
                className="text-slate-400 hover:text-slate-600 text-sm p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(`http://localhost:5000/${selectedQr.short_url}`)}`}
                alt="QR Code"
                className="w-48 h-48 rounded-lg shadow-xs"
              />
            </div>

            <div>
              <p className="text-sm font-mono font-bold text-slate-800">
                localhost:5000/{selectedQr.short_url}
              </p>
              <p className="text-xs text-slate-400 mt-1 truncate max-w-xs mx-auto">
                {selectedQr.full_url}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => handleDownloadQr(`http://localhost:5000/${selectedQr.short_url}`, selectedQr.short_url)}
                className="flex-1 bg-purple-700 hover:bg-purple-800 active:bg-purple-900 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-all duration-200 shadow-sm shadow-purple-700/25 cursor-pointer"
              >
                Download PNG
              </button>
              <button
                onClick={() => setSelectedQr(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-all duration-200 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserUrl;
