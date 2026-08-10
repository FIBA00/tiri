export default function EventSettingsLoading() {
  return (
    <div className="flex flex-col gap-12 max-w-6xl pb-20 animate-pulse">
      <div className="flex flex-col gap-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 border-b border-hairline pb-12">
          <div className="flex flex-col gap-2">
            <div className="h-8 w-48 bg-muted/20 rounded" />
            <div className="h-4 w-full bg-muted/20 rounded" />
            <div className="h-4 w-3/4 bg-muted/20 rounded" />
          </div>
          
          <div className="card-surface p-6 md:p-8 flex flex-col gap-8 rounded-2xl border border-hairline bg-paper">
            <div className="flex flex-col gap-2">
              <div className="h-4 w-24 bg-muted/20 rounded" />
              <div className="h-12 max-w-xl bg-muted/20 rounded-xl" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl">
              <div className="flex flex-col gap-2">
                <div className="h-4 w-24 bg-muted/20 rounded" />
                <div className="h-12 w-full bg-muted/20 rounded-xl" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="h-4 w-24 bg-muted/20 rounded" />
                <div className="h-12 w-full bg-muted/20 rounded-xl" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="h-4 w-32 bg-muted/20 rounded" />
              <div className="h-32 max-w-xl bg-muted/20 rounded-xl" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 border-b border-hairline pb-12">
          <div className="flex flex-col gap-2">
            <div className="h-8 w-48 bg-muted/20 rounded" />
            <div className="h-4 w-full bg-muted/20 rounded" />
          </div>
          
          <div className="card-surface p-6 md:p-8 flex flex-col gap-8 rounded-2xl border border-hairline bg-paper">
            <div className="flex items-center justify-between">
              <div className="h-6 w-32 bg-muted/20 rounded" />
              <div className="h-8 w-32 bg-muted/20 rounded-xl" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <div className="h-4 w-24 bg-muted/20 rounded" />
                <div className="h-12 w-full bg-muted/20 rounded-xl" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="h-4 w-24 bg-muted/20 rounded" />
                <div className="h-12 w-full bg-muted/20 rounded-xl" />
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-sm aspect-[21/9] w-full bg-muted/20 border border-hairline" />
          </div>
        </div>
      </div>
    </div>
  );
}
