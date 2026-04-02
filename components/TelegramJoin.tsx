export default function TelegramJoin() {
  return (
    <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500">
          <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Get Instant Alerts on Telegram</h3>
          <p className="text-sm text-gray-600">Join our channel for instant job notifications</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {[
          { name: 'All Jobs', handle: 'NaukriAlertAI' },
          { name: 'Central Govt', handle: 'naukrialert_central' },
          { name: 'Banking', handle: 'naukrialert_banking' },
          { name: 'State Govt', handle: 'naukrialert_state' },
          { name: 'Defence', handle: 'naukrialert_defence' },
          { name: 'Teaching', handle: 'naukrialert_teaching' },
        ].map((ch) => (
          <a
            key={ch.handle}
            href={`https://t.me/${ch.handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-center text-xs font-medium text-blue-700 transition hover:bg-blue-100"
          >
            {ch.name}
          </a>
        ))}
      </div>
    </div>
  );
}
