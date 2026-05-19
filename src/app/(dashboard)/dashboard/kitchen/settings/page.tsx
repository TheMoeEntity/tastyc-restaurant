export default function KitchenSettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-white font-bold text-xl mb-1">Kitchen Settings</h1>
        <p className="text-white/40 text-sm">
          Configure kitchen display and order handling preferences
        </p>
      </div>

      {[
        {
          title: "Display",
          description: "Screen layout, font size, and auto-refresh interval",
        },
        {
          title: "Order Routing",
          description: "Which stations receive which order types",
        },
        {
          title: "Alerts",
          description: "Sound alerts and escalation timing for pending orders",
        },
      ].map(({ title, description }) => (
        <div
          key={title}
          className="rounded-2xl border border-white/5 p-5 flex items-center justify-between"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <div>
            <p className="text-white font-semibold text-sm">{title}</p>
            <p className="text-white/40 text-xs mt-0.5">{description}</p>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-yellow-500/60 border border-yellow-500/20 rounded-md px-2 py-1">
            Coming soon
          </span>
        </div>
      ))}
    </div>
  );
}
