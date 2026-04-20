import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

const API = "http://127.0.0.1:5000/api/invoices";

/* ================= PDF ================= */
const downloadPDF = async (el) => {
  if (!el) return;

  const canvas = await html2canvas(el, { scale: 2 });
  const img = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const width = pdf.internal.pageSize.getWidth();
  const height = (canvas.height * width) / canvas.width;

  pdf.addImage(img, "PNG", 0, 0, width, height);
  pdf.save("invoice.pdf");
};

/* ================= MAIN ================= */
export default function InvoicePage() {
  const pdfRef = useRef();

  const [form, setForm] = useState({
    clientName: "",
    company: "",
    invoiceNo: "",
    date: "",
    sgst: 9,
    cgst: 9,
    items: [{ name: "", qty: 1, price: 0 }],
  });

  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [preview, setPreview] = useState(null);

  /* ================= FETCH ================= */
  const fetchInvoices = async () => {
    const res = await axios.get(API, {
      params: { search, filter, startDate, endDate },
    });

    setInvoices(res.data.data);
  };

  useEffect(() => {
    fetchInvoices();
  }, [search, filter, startDate, endDate]);

  /* ================= ITEMS ================= */
  const updateItem = (i, field, value) => {
    const items = [...form.items];
    items[i][field] = value;
    setForm({ ...form, items });
  };

  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { name: "", qty: 1, price: 0 }],
    });
  };

  /* ================= TOTAL ================= */
  const subtotal = form.items.reduce(
    (s, i) => s + i.qty * i.price,
    0
  );

  const sgst = (subtotal * form.sgst) / 100;
  const cgst = (subtotal * form.cgst) / 100;
  const total = subtotal + sgst + cgst;

  /* ================= SAVE ================= */
  const saveInvoice = async () => {
    await axios.post(API, {
      ...form,
      subtotal,
      total,
    });

    fetchInvoices();
    downloadPDF(pdfRef.current);
  };

  /* ================= DELETE ================= */
  const deleteInvoice = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchInvoices();
  };

  /* ================= UI ================= */
  return (
    <DashboardLayout>
      <DashboardNavbar />

      <div style={{ padding: 20 }}>
        <h2>Invoice Generator</h2>

        {/* ================= FORM ================= */}
        <div style={styles.card}>
          <div style={styles.grid}>
            <input
              placeholder="Client Name"
              onChange={(e) =>
                setForm({ ...form, clientName: e.target.value })
              }
            />

            <input
              placeholder="Company"
              onChange={(e) =>
                setForm({ ...form, company: e.target.value })
              }
            />

            <input
              placeholder="Invoice No"
              onChange={(e) =>
                setForm({ ...form, invoiceNo: e.target.value })
              }
            />

            <input
              type="date"
              onChange={(e) =>
                setForm({ ...form, date: e.target.value })
              }
            />
          </div>

          <h4>Items</h4>

          {form.items.map((item, i) => (
            <div key={i} style={styles.row}>
              <input
                placeholder="Item"
                onChange={(e) =>
                  updateItem(i, "name", e.target.value)
                }
              />
              <input
                type="number"
                placeholder="Qty"
                onChange={(e) =>
                  updateItem(i, "qty", +e.target.value)
                }
              />
              <input
                type="number"
                placeholder="Price"
                onChange={(e) =>
                  updateItem(i, "price", +e.target.value)
                }
              />
            </div>
          ))}

          <button onClick={addItem}>Add Item</button>

          <h3>Total: ₹{total.toFixed(2)}</h3>

          <button onClick={saveInvoice}>
            Save + Download
          </button>
        </div>

        {/* ================= SEARCH ================= */}
        <div style={styles.filterBar}>
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="day">Today</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>

          <input
            type="date"
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* ================= LIST ================= */}
        {invoices.map((inv) => (
          <div key={inv._id} style={styles.item}>
            <div>
              <b>{inv.clientName}</b>
              <p>{inv.invoiceNo}</p>
              <small>
                {new Date(inv.createdAt).toLocaleDateString()}
              </small>
            </div>

            <div>
              <button onClick={() => setPreview(inv)}>
                View
              </button>

              <button
                onClick={() => {
                  setForm(inv);
                  setTimeout(
                    () => downloadPDF(pdfRef.current),
                    500
                  );
                }}
              >
                Download
              </button>

              <button onClick={() => deleteInvoice(inv._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}

        {/* ================= PREVIEW ================= */}
        {preview && (
          <div style={styles.overlay} onClick={() => setPreview(null)}>
            <div style={styles.modal}>
              <div ref={pdfRef}>
                <h2>{preview.company}</h2>
                <p>{preview.clientName}</p>
                <h3>Total: ₹{preview.total}</h3>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </DashboardLayout>
  );
}

/* ================= STYLES ================= */
const styles = {
  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: 10,
  },
  row: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: 10,
    marginBottom: 10,
  },
  filterBar: {
    display: "flex",
    gap: 10,
    marginBottom: 20,
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    background: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    background: "#fff",
    padding: 20,
    borderRadius: 10,
  },
};