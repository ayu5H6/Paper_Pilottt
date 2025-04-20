// src/components/ui.jsx

// Button
export const Button = ({ className = "", ...props }) => (
  <button
    className={`bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition ${className}`}
    {...props}
  />
)

// Input
export const Input = ({ className = "", ...props }) => (
  <input
    className={`border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
    {...props}
  />
)

// Textarea
export const Textarea = ({ className = "", ...props }) => (
  <textarea
    className={`border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
    {...props}
  />
)

// Badge
export const Badge = ({ className = "", children }) => (
  <span
    className={`inline-block bg-gray-200 text-gray-800 text-xs font-semibold px-2 py-1 rounded ${className}`}
  >
    {children}
  </span>
)

// Dialog
export const Dialog = ({ open, onClose, title, children, footer }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="relative bg-white rounded-lg w-[90%] max-w-md p-6">
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        <div className="mb-4">{children}</div>
        {footer && <div className="mt-4">{footer}</div>}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
// src/components/ui.jsx

// DialogHeader Component
export const DialogHeader = ({ title }) => (
  <div className="mb-4 text-xl font-bold">{title}</div>
);

