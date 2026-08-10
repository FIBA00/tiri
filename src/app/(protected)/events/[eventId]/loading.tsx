export default function EventDetailLoading() {
  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-paper-raised border border-hairline rounded-2xl p-6 flex items-center justify-between shadow-sm animate-pulse">
            <div className="flex flex-col gap-2">
              <div className="h-8 w-12 bg-muted/20 rounded" />
              <div className="h-4 w-20 bg-muted/20 rounded" />
            </div>
            <div className="h-14 w-14 rounded-2xl bg-muted/20" />
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-8">
          <div className="bg-paper border border-hairline rounded-2xl p-6 shadow-sm h-[400px] animate-pulse">
            <div className="h-6 w-48 bg-muted/20 rounded mb-6" />
            <div className="flex flex-col gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 w-full bg-muted/20 rounded-xl" />
              ))}
            </div>
          </div>
          
          <div className="bg-paper border border-hairline rounded-2xl p-6 shadow-sm h-[300px] animate-pulse">
            <div className="h-6 w-48 bg-muted/20 rounded mb-6" />
            <div className="h-48 w-full bg-muted/20 rounded-xl" />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-paper border border-hairline rounded-2xl p-6 h-[600px] shadow-sm animate-pulse">
            <div className="h-6 w-48 bg-muted/20 rounded mb-6" />
            <div className="h-full w-full bg-muted/20 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
