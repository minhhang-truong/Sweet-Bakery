const InfoTable = ({ title, variant, data, editable = false, errors = {}, onValueChange }) => {
  const headerClass = {
    red: "table-header-red",
    green: "table-header-green",
    gray: "table-header-gray",
    blue: "table-header-blue",
  }[variant];

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className={`${headerClass} text-center py-2`}>{title}</div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="py-2 px-4 text-center text-sm font-medium">
              Information
            </th>
            <th className="py-2 px-4 text-center text-sm font-medium">
              Details
            </th>
          </tr>
        </thead>

        <tbody>
          {data.map((row, index) => {
            const isReadOnly = row.readOnly === true;

            return (
              <tr
                key={index}
                className="border-b border-border last:border-b-0"
              >
                <td className="py-2 px-4 text-sm font-medium">
                  {row.label}
                </td>

                <td className="py-2 px-4">
                  {/* EDIT MODE & NOT READONLY */}
                  {editable && !isReadOnly ? (
                    <>
                    {/* SỬA: Thêm hỗ trợ Select Box */}
                    {row.type === 'select' ? (
                        <select
                            value={row.value}
                            onChange={(e) => onValueChange?.(row.key, e.target.value)}
                            className={`w-full bg-transparent text-sm border-b py-1
                                ${errors[row.key] ? "border-red-500" : "border-gray-300"}
                                focus:outline-none focus:border-primary cursor-pointer`}
                        >
                            {row.options?.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                        type={row.type || "text"}
                        value={row.value}
                        onChange={(e) =>
                            onValueChange?.(row.key, e.target.value)
                        }
                        placeholder={row.placeholder || ""}
                        className={`w-full bg-transparent text-sm py-1
                                    border-b
                                    ${errors[row.key]
                                    ? "border-red-500"
                                    : "border-gray-300"}
                                    focus:outline-none focus:border-primary`}
                        />
                    )}
                    
                    {errors[row.key] && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors[row.key]}
                      </p>
                    )}
                    </>
                  ) : (
                    /* VIEW MODE OR READONLY */
                    <span
                      className={
                        isReadOnly
                          ? "text-sm text-muted-foreground font-semibold cursor-not-allowed select-none"
                          : "text-sm text-muted-foreground"
                      }
                    >
                      {row.value || "-"}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default InfoTable;