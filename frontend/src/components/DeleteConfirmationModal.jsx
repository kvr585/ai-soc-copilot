import { AnimatePresence, motion } from 'framer-motion'

function DeleteConfirmationModal({ open, loading, onCancel, onConfirm }) {
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
            className="w-full max-w-lg rounded-[32px] border border-soc-border bg-[#111827] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
          >
            <div className="space-y-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Delete investigation</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-100">Confirm removal</h2>
              </div>
              <p className="text-sm leading-7 text-slate-300">This action cannot be undone. Are you sure you want to permanently delete this investigation record?</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onCancel}
                  className="rounded-3xl border border-soc-border bg-soc-card px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-soc-primary hover:text-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={loading}
                  className="rounded-3xl bg-soc-danger px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default DeleteConfirmationModal
