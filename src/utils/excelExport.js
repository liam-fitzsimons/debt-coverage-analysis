import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportToExcel = (transactions) => {
  const data = transactions.map(tx => ({
    Date: tx.date.toLocaleDateString(),
    Description: tx.description,
    Debit: tx.debit,
    Credit: tx.credit,
    Net: tx.credit - tx.debit
  }));

  const ws = XLSX.utils.json_to_sheet(data);

  // Add totals row
  const totalRow = {
    Date: "TOTAL",
    Description: "",
    Debit: { f: `SUM(C2:C${data.length + 1})` },
    Credit: { f: `SUM(D2:D${data.length + 1})` },
    Net: { f: `SUM(E2:E${data.length + 1})` }
  };

  XLSX.utils.sheet_add_json(ws, [totalRow], { skipHeader: true, origin: -1 });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Transactions");

  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, "DebtCoverageAnalysis.xlsx");
};
