import React, { useState } from "react";
import * as XLSX from "xlsx";
import { useUploadInventoryExcelMutation } from "../../api/projectApi";

const inventoryFields = [
  { key: "date_added", label: "Date Added" },
  { key: "item_name", label: "Item Name" },
  { key: "quantity", label: "Quantity" },
  { key: "in", label: "In" },
  { key: "out", label: "Out" },
  { key: "receiver_name", label: "Receiver Name" },
  { key: "vendorId", label: "Vendor ID" },
  { key: "remarks", label: "Remarks" },
];

const AddProject = () => {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [mapping, setMapping] = useState({});

  const [uploadProject] = useUploadInventoryExcelMutation();

  const handleFileChange = async (e) => {
    const f = e.target.files[0];
    if (!f) return;

    setFile(f);

    const buffer = await f.arrayBuffer();
    const workbook = XLSX.read(buffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    setRows(json);

    if (json.length > 0) {
      const cols = Object.keys(json[0]);
      setColumns(cols);

      const autoMap = {};
      inventoryFields.forEach((field) => {
        const found = cols.find(
          (c) => c.toLowerCase() === field.key.toLowerCase(),
        );
        if (found) autoMap[field.key] = found;
      });

      setMapping(autoMap);
    }
  };

  const handleMappingChange = (field, column) => {
    setMapping((prev) => ({ ...prev, [field]: column }));
  };

  const transformRows = () => {
    return rows.map((row) => {
      const obj = {};
      inventoryFields.forEach((field) => {
        const col = mapping[field.key];
        obj[field.key] = col ? row[col] : null;
      });
      return obj;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !file) return;

    try {
      const mappedRows = transformRows();
      await uploadProject({ name, inventory: mappedRows }).unwrap();

      alert("Project and inventory imported successfully");

      setName("");
      setFile(null);
      setRows([]);
      setColumns([]);
      setMapping({});
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Add Project</h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Project Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Upload Excel</label>
          <input
            type="file"
            className="form-control"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            required
          />
        </div>

        {columns.length > 0 && (
          <div className="mb-4">
            <h5>Column Mapping</h5>
            {inventoryFields.map((field) => (
              <div className="row mb-2 align-items-center" key={field.key}>
                <div className="col-3">{field.label}</div>
                <div className="col-6">
                  <select
                    className="form-select"
                    value={mapping[field.key] || ""}
                    onChange={(e) =>
                      handleMappingChange(field.key, e.target.value)
                    }
                  >
                    <option value="">Select Column</option>
                    {columns.map((col) => (
                      <option key={col} value={col}>
                        {col}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}

        {rows.length > 0 && (
          <div className="mb-4">
            <h5>Excel Preview ({rows.length} rows)</h5>
            <div className="table-responsive" style={{ maxHeight: "500px" }}>
              <table className="table table-bordered table-striped table-hover">
                <thead className="table-light">
                  <tr>
                    {columns.map((col) => (
                      <th key={col}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 20).map((row, i) => (
                    <tr key={i}>
                      {columns.map((col) => (
                        <td key={col + i}>{row[col]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <button type="submit" className="btn btn-primary">
          Create Project
        </button>
      </form>
    </div>
  );
};

export default AddProject;
