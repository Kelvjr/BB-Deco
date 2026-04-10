export default function DashboardHomePage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 border-r bg-background lg:block">
          <div className="flex h-16 items-center border-b px-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                BB Deco
              </p>
              <h2 className="text-lg font-semibold">Admissions Admin</h2>
            </div>
          </div>

          <nav className="space-y-2 p-4">
            <a
              href="#"
              className="block rounded-lg bg-muted px-4 py-3 text-sm font-medium"
            >
              Dashboard
            </a>
            <a
              href="#"
              className="block rounded-lg px-4 py-3 text-sm text-muted-foreground hover:bg-muted"
            >
              Applications
            </a>
            <a
              href="#"
              className="block rounded-lg px-4 py-3 text-sm text-muted-foreground hover:bg-muted"
            >
              Pending
            </a>
            <a
              href="#"
              className="block rounded-lg px-4 py-3 text-sm text-muted-foreground hover:bg-muted"
            >
              Approved
            </a>
            <a
              href="#"
              className="block rounded-lg px-4 py-3 text-sm text-muted-foreground hover:bg-muted"
            >
              Settings
            </a>
          </nav>
        </aside>

        {/* Main area */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Header */}
          <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
            <div>
              <h1 className="text-lg font-semibold md:text-2xl">
                Admissions Dashboard
              </h1>
              <p className="text-xs text-muted-foreground md:text-sm">
                Manage student applications and admissions activity
              </p>
            </div>

            <div className="rounded-full border px-4 py-2 text-sm text-muted-foreground">
              Admin
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-4 md:p-6">
            <div className="mx-auto max-w-6xl space-y-6">
              <section className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border bg-background p-5 shadow-sm">
                  <p className="text-sm text-muted-foreground">
                    Total Applications
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold">0</h2>
                </div>

                <div className="rounded-2xl border bg-background p-5 shadow-sm">
                  <p className="text-sm text-muted-foreground">
                    Pending Review
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold">0</h2>
                </div>

                <div className="rounded-2xl border bg-background p-5 shadow-sm">
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <h2 className="mt-3 text-3xl font-semibold">0</h2>
                </div>
              </section>

              <section className="rounded-2xl border bg-background p-5 shadow-sm">
                <div>
                  <h2 className="text-xl font-semibold">Recent Applications</h2>
                  <p className="text-sm text-muted-foreground">
                    Latest student submissions will appear here.
                  </p>
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
        </div>
      </div>
    </div>
  );
}
