export default function PlayIcon() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="rounded-full bg-black bg-opacity-50 p-4 transition-transform hover:scale-110">
        <svg
          className="h-12 w-12 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    </div>
  );
} 