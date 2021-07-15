export const jsonToCsv = (data: object[] | string): string => {
  const array = typeof data !== "object" ? JSON.parse(data) : data;
  let csv = "";

  for (let i = 0; i < array.length; i++) {
    let line = "";
    for (let index in array[i]) {
      if (line !== "") line += ",";

      line += array[i][index];
    }

    csv += line + "\r\n";
  }

  return csv;
};

interface IExportCsvFileParams {
  headers: object;
  items: object[];
  fileTitle: string;
}

export const exportCSVFile = ({
  headers,
  items,
  fileTitle,
}: IExportCsvFileParams) => {
  if (headers) {
    items.unshift(headers);
  }

  // Convert Object to JSON
  let jsonObject = JSON.stringify(items);

  const csv = jsonToCsv(jsonObject);

  const exportedFilename = fileTitle + ".csv" || "export.csv";

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, exportedFilename);
  } else {
    const link = document.createElement("a");
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", exportedFilename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};
