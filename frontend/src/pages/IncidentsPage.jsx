import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Search, SlidersHorizontal, ShieldAlert, Library } from "lucide-react"

import Navbar from "../components/Navbar.jsx"
import Sidebar from "../components/Sidebar.jsx"
import Loader from "../components/Loader.jsx"
import ErrorCard from "../components/ErrorCard.jsx"
import IncidentTable from "../components/IncidentTable.jsx"
import DeleteConfirmationModal from "../components/DeleteConfirmationModal.jsx"

import {
  getAllInvestigations,
  deleteInvestigation,
} from "../services/api.js"

function IncidentsPage() {
  const navigate = useNavigate()

  const [investigations, setInvestigations] = useState([])
  const [filteredInvestigations, setFilteredInvestigations] = useState([])

  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [selectedDeleteId, setSelectedDeleteId] = useState(null)

  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  const [error, setError] = useState(null)

  const [searchTerm, setSearchTerm] = useState("")
  const [filterSeverity, setFilterSeverity] = useState("All")
  const [filterRiskLevel, setFilterRiskLevel] = useState("All")

  const fetchInvestigations = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await getAllInvestigations()
      setInvestigations(result)
      setFilteredInvestigations(result)
    } catch (err) {
      setError(err.message || "Unable to reach database. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchInvestigations()
  }, [])

  const severityOptions = useMemo(() => {
    const options = new Set(
      investigations
        .map((item) => item.severity)
        .filter(Boolean)
    )
    return ["All", ...Array.from(options)]
  }, [investigations])

  const riskLevelOptions = useMemo(() => {
    const options = new Set(
      investigations
        .map((item) => item.risk_level)
        .filter(Boolean)
    )
    return ["All", ...Array.from(options)]
  }, [investigations])

  useEffect(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase()

    const filtered = investigations.filter((item) => {
      const fields = [
        item.incident_id,
        item.severity,
        item.risk_level,
        item.incident_type,
        item.summary,
        String(item.risk_score),
      ]

      const matchesSearch = normalizedTerm
        ? fields.some((field) =>
            String(field)
              .toLowerCase()
              .includes(normalizedTerm)
          )
        : true

      const matchesSeverity =
        filterSeverity === "All" ||
        item.severity === filterSeverity

      const matchesRisk =
        filterRiskLevel === "All" ||
        item.risk_level === filterRiskLevel

      return (
        matchesSearch &&
        matchesSeverity &&
        matchesRisk
      )
    })

    setFilteredInvestigations(filtered)
  }, [
    searchTerm,
    filterSeverity,
    filterRiskLevel,
    investigations,
  ])

  const handleView = (id) => {
    navigate(`/incidents/${id}`)
  }

  const handleDelete = (id) => {
    setSelectedDeleteId(id)
    setIsConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedDeleteId) return

    setIsDeleting(true)
    setError(null)

    try {
      await deleteInvestigation(selectedDeleteId)
      setSelectedDeleteId(null)
      setIsConfirmOpen(false)
      await fetchInvestigations()
    } catch (err) {
      setError(err.message || "Failed to execute delete routine.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B1220] text-slate-100 font-sans">
      <Navbar
        backendStatus={{
          online: !error,
          message: error ? "Offline" : "Online",
        }}
      />

      <div className="mx-auto w-full max-w-none px-6 py-6 xl:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
          <Sidebar />

          <main className="space-y-8 min-w-0">
            {/* Header Banner */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#111827]/40 p-6 shadow-soc backdrop-blur-md"
            >
              <div className="absolute top-0 left-0 w-24 h-[1px] bg-soc-primary shadow-[0_0_15px_#00E5FF]" />
              
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-soc-primary">
                    Historical Log Archive
                  </p>

                  <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-slate-100 sm:text-3xl">
                    Incident Repository
                  </h2>

                  <p className="mt-1 text-sm text-slate-400 font-medium">
                    Review historic threat investigations, automated response plan playbooks, and generated analyst reports.
                  </p>
                </div>

                {/* Filters and Search Panel */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center shrink-0">
                  {/* Search input with embedded icon */}
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      type="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search telemetry..."
                      className="w-full rounded-2xl border border-slate-850 bg-[#0B1220]/60 py-3.5 pl-10 pr-4 text-xs font-semibold text-slate-200 placeholder:text-slate-500 focus:border-soc-primary focus:outline-none focus:ring-1 focus:ring-soc-primary/20 sm:w-72 transition"
                    />
                  </div>

                  {/* Dropdowns */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-[#0B1220]/40 border border-slate-850 rounded-2xl px-2 py-1 shrink-0">
                      <SlidersHorizontal className="h-3 w-3 text-slate-500" />
                      <span className="text-[10px] uppercase font-bold text-slate-500 hidden sm:inline">Filters</span>
                    </div>

                    <select
                      value={filterSeverity}
                      onChange={(e) => setFilterSeverity(e.target.value)}
                      className="rounded-2xl border border-slate-850 bg-[#0B1220]/60 px-4 py-3.5 text-xs font-semibold text-slate-300 focus:border-soc-primary focus:outline-none focus:ring-1 focus:ring-soc-primary/20 transition cursor-pointer"
                    >
                      <option value="All">All Severity</option>
                      {severityOptions.filter(opt => opt !== "All").map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>

                    <select
                      value={filterRiskLevel}
                      onChange={(e) => setFilterRiskLevel(e.target.value)}
                      className="rounded-2xl border border-slate-850 bg-[#0B1220]/60 px-4 py-3.5 text-xs font-semibold text-slate-300 focus:border-soc-primary focus:outline-none focus:ring-1 focus:ring-soc-primary/20 transition cursor-pointer"
                    >
                      <option value="All">All Risk</option>
                      {riskLevelOptions.filter(opt => opt !== "All").map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Content Display */}
            {isLoading && (
              <div className="flex h-64 items-center justify-center">
                <Loader />
              </div>
            )}

            {error && (
              <ErrorCard
                message={error}
                onRetry={fetchInvestigations}
              />
            )}

            {!isLoading && !error && (
              <IncidentTable
                investigations={filteredInvestigations}
                onView={handleView}
                onDelete={handleDelete}
              />
            )}

            {/* Deletion Modal */}
            <DeleteConfirmationModal
              open={isConfirmOpen}
              loading={isDeleting}
              onCancel={() => setIsConfirmOpen(false)}
              onConfirm={confirmDelete}
            />
          </main>
        </div>
      </div>
    </div>
  )
}

export default IncidentsPage