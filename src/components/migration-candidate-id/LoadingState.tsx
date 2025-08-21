// LoadingState Component
export const LoadingState: React.FC = () => {
  return (
    <div className="min-h-screen">
      <div className="animate-pulse">
        <div className="h-8 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50"
              ></div>
            ))}
          </div>
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-32 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
