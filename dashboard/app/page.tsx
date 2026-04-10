export default function DashboardHomePage() {
  return (
    <main className="min-h-screen bg-muted/30 p-6 md:p-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <p className="text-sm text-muted-foreground">
            BB Deco Catering School
          </p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Admissions Dashboard
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage student applications, review submissions, and track
            admissions activity.
          </p>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border bg-background p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">Total Applications</p>
            <h2 className="mt-3 text-3xl font-semibold">0</h2>
          </div>

          <div className="rounded-2xl border bg-background p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">Pending Review</p>
            <h2 className="mt-3 text-3xl font-semibold">0</h2>
          </div>

          <div className="rounded-2xl border bg-background p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">Approved</p>
            <h2 className="mt-3 text-3xl font-semibold">0</h2>
          </div>
        </section>

        <section className="rounded-2xl border bg-background p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Recent Applications</h2>
              <p className="text-sm text-muted-foreground">
                Latest student submissions will appear here.
              </p>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-xl border">
            <table className="w-full text-left">
              <thead className="bg-muted/50 text-sm">
                <tr>
                  <th className="px-4 py-3 font-medium">Applicant</th>
                  <th className="px-4 py-3 font-medium">Program</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td
                    className="px-4 py-4 text-sm text-muted-foreground"
                    colSpan={4}
                  >
                    No applications loaded yet.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
