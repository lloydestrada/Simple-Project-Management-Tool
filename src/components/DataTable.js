"use client";

export default function DataTable({
  data = [],
  columns = [],
  getRowKey,
  rowActions = [],
}) {
  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-200 mt-2">
      <table className="min-w-full table-fixed divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-800">
          <tr>
            {columns.map((col) => (
              <th
                key={col.accessor}
                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
            {rowActions.length > 0 && (
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length > 0 ? (
            data.map((item) => (
              <tr
                key={getRowKey(item)}
                className="hover:bg-gray-50 transition-all duration-300"
              >
                {columns.map((col) => (
                  <td key={col.accessor} className="px-6 py-4 text-gray-900">
                    {col.render
                      ? col.render(item[col.accessor], item)
                      : item[col.accessor]}
                  </td>
                ))}

                {rowActions.length > 0 && (
                  <td className="px-6 py-4 flex space-x-2">
                    {rowActions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => action.onClick(item)}
                        className={`px-3 py-1 rounded text-white text-sm font-medium ${
                          action.color || "bg-cyan-600 hover:bg-cyan-700"
                        }`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + (rowActions.length > 0 ? 1 : 0)}
                className="px-6 py-4 text-center text-gray-500"
              >
                No data found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
