// app/not-found.jsx
export default function NotFound() {
  console.warn("404: User attempted to access a non-existent route");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-foreground">404</h1>
        <p className="text-xl text-muted-foreground mb-4">
          Oops! Page not found
        </p>
        <a
          href="/"
          className="text-primary hover:text-primary-dark underline transition-fast"
        >
          Return to Dashboard
        </a>
      </div>
    </div>
  );
}
