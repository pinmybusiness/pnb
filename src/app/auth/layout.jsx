// app/auth/layout.jsx
export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-light flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full">{children}</div>
    </div>
  );
}
