import { useState } from "react";
import { createShortUrl } from "../api/shortUrl.api";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";

const UrlForm = () => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customSlug, setCustomSlug] = useState("");
  const [showQr, setShowQr] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setShowQr(false);

    try {
      const slug = customSlug.trim() || undefined;
      const createdUrl = await createShortUrl(url.trim(), slug);
      setShortUrl(createdUrl);

      try {
        await queryClient.invalidateQueries({ queryKey: ["userUrls"] });
      } catch (qErr) {
        console.error("Failed to invalidate queries:", qErr);
      }
    } catch (err) {
      setError(err.message || "Failed to shorten URL. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!shortUrl) return;
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleDownloadQr = async () => {
    if (!shortUrl) return;
    try {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shortUrl)}`;
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `qrcode-${customSlug || "shortly"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch {
      window.open(
        `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shortUrl)}`,
        "_blank",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* URL Input */}
      <div>
        <label
          htmlFor="url"
          className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
        >
          Enter Long URL
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </div>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/very-long-url-to-shorten"
            required
            className="w-full pl-11 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-purple-700 focus:ring-4 focus:ring-purple-100 transition-all text-sm font-medium"
          />
        </div>
      </div>

      {/* Custom Slug Input (For Authenticated Users) */}
      {isAuthenticated && (
        <div>
          <label
            htmlFor="customSlug"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Custom Slug{" "}
            <span className="text-slate-400 font-normal lowercase">
              (optional)
            </span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-sm">
              <span className="font-mono text-slate-400 font-bold">/</span>
            </div>
            <input
              type="text"
              id="customSlug"
              value={customSlug}
              onChange={(e) => setCustomSlug(e.target.value)}
              placeholder="e.g. my-product-launch"
              className="w-full pl-8 pr-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-purple-700 focus:ring-4 focus:ring-purple-100 transition-all text-sm font-mono"
            />
          </div>
        </div>
      )}

      {/* Submit Button - Matched to purple-700 */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-purple-700 hover:bg-purple-800 active:bg-purple-900 text-white font-bold py-3.5 px-6 rounded-xl shadow-md shadow-purple-700/25 border border-purple-700 hover:shadow-lg hover:shadow-purple-700/35 focus:outline-none focus:ring-4 focus:ring-purple-700/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer active:scale-[0.99] text-sm sm:text-base tracking-wide"
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            Shortening URL...
          </>
        ) : (
          <>
            <span>Shorten URL</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </>
        )}
      </button>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm animate-fadeIn">
          <svg
            className="w-5 h-5 text-red-500 shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Shortened URL Result Card */}
      {shortUrl && !error && (
        <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-sm animate-fadeIn space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              Your Shortened URL
            </span>
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-purple-700 hover:text-purple-900 font-semibold inline-flex items-center gap-1 hover:underline transition-colors"
            >
              Test link
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              readOnly
              value={shortUrl}
              className="flex-1 p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono text-sm font-bold shadow-inner focus:outline-none select-all"
            />

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-all duration-200 shadow-sm cursor-pointer ${
                  copied
                    ? "bg-emerald-600 text-white shadow-emerald-200"
                    : "bg-purple-700 hover:bg-purple-800 text-white shadow-purple-700/20"
                }`}
              >
                {copied ? (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Copy
                  </>
                )}
              </button>

              {/* QR Code Feature Toggle (for Authenticated Users) */}
              {isAuthenticated && (
                <button
                  type="button"
                  onClick={() => setShowQr(!showQr)}
                  className={`p-2.5 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer ${
                    showQr
                      ? "bg-purple-700 text-white border-purple-700 shadow-sm shadow-purple-700/20"
                      : "bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 border-slate-200 shadow-xs"
                  }`}
                  title="View QR Code"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* QR Code Viewer (Authenticated users) */}
          {isAuthenticated && showQr && (
            <div className="pt-3 border-t border-slate-200 flex flex-col items-center justify-center gap-2.5 animate-fadeIn">
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(shortUrl)}`}
                  alt="QR Code"
                  className="w-36 h-36 rounded-md"
                />
              </div>
              <button
                type="button"
                onClick={handleDownloadQr}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-purple-700 hover:bg-purple-800 active:bg-purple-900 text-white rounded-xl text-xs font-semibold shadow-xs shadow-purple-700/25 transition-all duration-200 cursor-pointer"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download QR Code (.png)
              </button>
            </div>
          )}
        </div>
      )}
    </form>
  );
};

export default UrlForm;
