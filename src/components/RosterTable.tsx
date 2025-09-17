'use client'

type RosterRow = {
  tenant_id: string
  class_id: string
  student_id: string
  full_name: string
}

export function RosterTable({ rows }: { rows: RosterRow[] }) {
  if (!rows.length) {
    return (
      <div className="border rounded-xl p-4 text-sm text-gray-600">
        Không có học sinh trong lớp (hoặc bạn chưa có dữ liệu/đúng tenant).
      </div>
    )
  }

  return (
    <div className="overflow-x-auto border rounded-xl">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left px-3 py-2 border-b">Student</th>
            <th className="text-left px-3 py-2 border-b">Student ID</th>
            <th className="text-left px-3 py-2 border-b">Class ID</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.student_id} className="hover:bg-gray-50">
              <td className="px-3 py-2 border-b">{r.full_name}</td>
              <td className="px-3 py-2 border-b font-mono text-xs">{r.student_id}</td>
              <td className="px-3 py-2 border-b font-mono text-xs">{r.class_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
