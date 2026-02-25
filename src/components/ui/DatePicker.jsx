import { useState } from "react";

const DatePicker = ({ selected, onSelect }) => {
  return (
    <div className="flex flex-col gap-3">
      <input
        type="date"
        value={selected ? selected.toISOString().split("T")[0] : ""}
        onChange={(e) => {
          const value = e.target.value;
          onSelect(value ? new Date(value) : null);
        }}
        className="border p-2 rounded-lg"
      />
    </div>
  );
};

export default DatePicker;