import UrlForm from '../components/UrlForm'
import UserUrl from '../components/UserUrl'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { getAllUserUrls } from '../api/user.api'
import { useMemo } from 'react'

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth)
  const displayName = user?.name || user?.user?.name || 'User'

  // Fetch URLs for dashboard metrics overview
  const { data: urls } = useQuery({
    queryKey: ['userUrls'],
    queryFn: getAllUserUrls,
    refetchInterval: 30000,
    staleTime: 0,
  })

  const rawList = urls?.urls
  const urlList = useMemo(() => rawList || [], [rawList])

  const totalLinks = urlList.length
  const totalClicks = useMemo(() => {
    return urlList.reduce((acc, curr) => acc + (curr.clicks || 0), 0)
  }, [urlList])

  const avgClicks = totalLinks > 0 ? (totalClicks / totalLinks).toFixed(1) : 0

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-slate-50 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        {/* Dashboard Header */}
        <div className="pb-4 sm:pb-6 border-b border-slate-200/90 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Links Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Welcome back, <span className="font-semibold text-slate-700">{displayName}</span>. Create, customize, and monitor your links.
            </p>
          </div>
        </div>

        {/* Top 3-Card Metrics Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Metric 1: Total Links */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 border border-purple-100/80">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Links</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{totalLinks}</p>
            </div>
          </div>

          {/* Metric 2: Total Clicks */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100/80">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Clicks</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{totalClicks}</p>
            </div>
          </div>

          {/* Metric 3: Avg Clicks */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 border border-purple-100/80">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Avg. Clicks / Link</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{avgClicks}</p>
            </div>
          </div>
        </div>

        {/* Equal 50/50 Balanced 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          {/* Left Column: Shorten Link Form + Quick Guide */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 transition-all">
              <div className="mb-4 pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Shorten a Link</h2>
                  <p className="text-xs text-slate-400">Create a quick short URL or assign a custom slug</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              </div>
              <UrlForm />
            </div>

            {/* Balanced Helper Card */}
            <div className="bg-purple-50/50 rounded-2xl border border-purple-100/80 p-5 shadow-sm text-xs text-slate-600 space-y-2.5">
              <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                <span className="text-purple-700">💡</span> Pro Tip: Custom Slugs
              </p>
              <p className="leading-relaxed text-slate-500">
                You can specify custom keywords like <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-purple-700">portfolio</span> or <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-purple-700">launch</span> to make links recognizable.
              </p>
            </div>
          </div>

          {/* Right Column: Active Links Feed */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-0.5">
              <h2 className="text-base font-bold text-slate-900">Your Active Links</h2>
              <span className="text-xs text-slate-400">Real-time engagement</span>
            </div>
            <UserUrl />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
