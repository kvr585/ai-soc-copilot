import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

function ReportModal({ open, report, onClose, onDownload }) {
  useEffect(() => {
    if (!open) return
    const handleEsc = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex h-[80vh] w-full max-w-[1200px] flex-col overflow-hidden rounded-[32px] border border-soc-border bg-[#111827] shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
          >
            <div className="flex items-center justify-between border-b border-soc-border px-6 py-5">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Executive Report</p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-100">Generated Incident Brief</h2>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={onDownload}
                  className="rounded-2xl bg-soc-primary px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  Download Report
                </button>
                <button
                  onClick={onClose}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-soc-card text-slate-200 transition hover:bg-soc-background"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6 text-slate-200">
                <ReactMarkdown
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1 className="text-3xl font-semibold text-slate-100" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 className="text-2xl font-semibold text-slate-100" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3 className="text-xl font-semibold text-slate-100" {...props} />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="text-base leading-7 text-slate-300" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul className="ml-6 list-disc space-y-2 text-sm text-slate-200" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol className="ml-6 list-decimal space-y-2 text-sm text-slate-200" {...props} />
                    ),
                    code: ({ inline, children, ...props }) => (
                      <code
                        className={inline ? 'rounded-md bg-slate-900 px-1 py-0.5 text-soc-primary' : 'block rounded-xl bg-slate-900 p-4 text-sm text-slate-100'}
                        {...props}
                      >
                        {children}
                      </code>
                    ),
                    blockquote: ({ node, ...props }) => (
                      <blockquote className="border-l-4 border-soc-primary pl-4 italic text-slate-300" {...props} />
                    )
                  }}
                >
                  {report}
                </ReactMarkdown>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default ReportModal
