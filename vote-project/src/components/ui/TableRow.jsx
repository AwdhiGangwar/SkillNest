import React from "react";
import { Download } from "lucide-react";

function TableRow({
  transactionId,
  amount,
  partner,
  method,
  status,
}) {
  const isPaid = status === "Paid";

  return (
    <div className="w-full max-w-[1140px] px-4 py-4 flex items-center justify-between rounded-[8px] text-[12px] text-[#4F4F4F]">

      <div className="w-[120px]">{transactionId}</div>

      <div className="w-[100px]">$ {amount}</div>

      <div className="w-[160px]">{partner}</div>

      <div className="w-[160px]">{method}</div>

      <div className="w-[100px]">
        <span
          className={`px-2 py-1 rounded-[4px] text-[12px] font-medium ${
            isPaid
              ? "bg-green-100 text-[#27AE60]"
              : "bg-red-100 text-red-600"
          }`}
        >
          {status}
        </span>
      </div>

      <div className="w-[40px] flex justify-center">
        <Download
          size={18}
          className="text-[#1F80E0] cursor-pointer"
        />
      </div>
    </div>
  );
}

export default TableRow;
