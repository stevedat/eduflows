import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl font-semibold">Eduflows — Demo</h1>
        <p className="text-gray-600">Quick links for testing:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><Link className="text-blue-600 underline" href="/login">/login</Link></li>
          <li><Link className="text-blue-600 underline" href="/diagnostics">/diagnostics</Link></li>
          <li><Link className="text-blue-600 underline" href="/whoami">/whoami</Link></li>
          <li><Link className="text-blue-600 underline" href="/logout">/logout</Link></li>
        </ul>
      </div>
    </main>
  )
}
