import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

/* ================= PDF ================= */
const downloadPDF = async (el) => {
  if (!el) return alert("Invoice not ready");

  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true, // ✅ FIX
    allowTaint: true,
    backgroundColor: "#fff",
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const width = pdf.internal.pageSize.getWidth();
  const height = (canvas.height * width) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, width, height);
  pdf.save("invoice.pdf");
};

/* ================= NUMBER TO WORD ================= */
const numberToWords = (num) => {
  const a = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const inWords = (n) => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + " " + a[n % 10];
    if (n < 1000) return a[Math.floor(n / 100)] + " Hundred " + inWords(n % 100);
    if (n < 100000) return inWords(Math.floor(n / 1000)) + " Thousand " + inWords(n % 1000);
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + " Lakh " + inWords(n % 100000);
    return inWords(Math.floor(n / 10000000)) + " Crore " + inWords(n % 10000000);
  };

  return inWords(Math.floor(num)) + " Rupees Only";
};

/* ================= INVOICE ================= */
const Invoice = React.forwardRef(({ data, totals }, ref) => {
  return (
    <div ref={ref} style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.logoBox}>
          {data.logo && (
            <img src={data.logo} alt="logo" style={styles.logo} crossOrigin="anonymous" />
          )}
        </div>

        <div style={styles.companyBox}>
          <h2 style={styles.title}>TAX INVOICE</h2>
          <b>{data.company}</b>
          <br />
          {data.address && (
            <>
              {data.address}
              <br />
            </>
          )}
          {data.gstin && (
            <>
              GSTIN: {data.gstin}
              <br />
            </>
          )}
          {data.phone && <>Phone: {data.phone}</>}
        </div>

        <div style={styles.invoiceBox}>
          <b>Invoice No:</b> {data.invoiceNo}
          <br />
          <b>Date:</b> {data.date}
        </div>
      </div>

      {/* BILL TO */}
      <div style={styles.billBox}>
        <b>Bill To</b>
        <br />
        {data.clientName}
        <br />
        {data.email && (
          <>
            {data.email}
            <br />
          </>
        )}
        {data.clientGstin && <>GSTIN: {data.clientGstin}</>}
      </div>

      {/* ITEMS */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Item</th>
            {data.items.some((i) => i.hsn) && <th style={styles.th}>HSN</th>}
            <th style={styles.th}>Qty</th>
            <th style={styles.th}>Rate</th>
            <th style={styles.th}>Amount</th>
          </tr>
        </thead>

        <tbody>
          {data.items.map((item, i) => (
            <tr key={i}>
              <td style={styles.td}>{item.name}</td>

              {data.items.some((i) => i.hsn) && <td style={styles.td}>{item.hsn || "-"}</td>}

              <td style={styles.td}>{item.qty}</td>
              <td style={styles.td}>₹{item.price}</td>
              <td style={styles.td}>₹{item.qty * item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* TOTAL */}
      <div style={styles.totalBox}>
        <div>Subtotal: ₹{totals.subtotal}</div>

        {data.sgst > 0 && (
          <div>
            SGST ({data.sgst}%): ₹{totals.sgst}
          </div>
        )}

        {data.cgst > 0 && (
          <div>
            CGST ({data.cgst}%): ₹{totals.cgst}
          </div>
        )}

        <h3>Total: ₹{totals.total}</h3>
      </div>

      {/* WORDS */}
      <div style={styles.words}>
        <b>Amount in Words:</b> {numberToWords(totals.total)}
      </div>
    </div>
  );
});

Invoice.propTypes = {
  data: PropTypes.object.isRequired,
  totals: PropTypes.object.isRequired,
};

/* ================= MAIN ================= */
export default function InvoicePage() {
  const pdfRef = useRef();
  const [open, setOpen] = useState(false);

  const [data, setData] = useState({
    logo: "",
    clientName: "",
    email: "",
    company: "",
    address: "",
    gstin: "",
    phone: "",
    invoiceNo: "",
    date: "",
    clientGstin: "",
    sgst: 9,
    cgst: 9,
    items: [{ name: "", hsn: "", qty: 1, price: 0 }],
  });

  const updateItem = (i, field, value) => {
    const items = [...data.items];
    items[i][field] = value;
    setData({ ...data, items });
  };

  const addItem = () => {
    setData({
      ...data,
      items: [...data.items, { name: "", hsn: "", qty: 1, price: 0 }],
    });
  };

  const subtotal = data.items.reduce((s, i) => s + i.qty * i.price, 0);
  const sgstAmount = (subtotal * data.sgst) / 100;
  const cgstAmount = (subtotal * data.cgst) / 100;
  const total = subtotal + sgstAmount + cgstAmount;

  const totals = {
    subtotal: subtotal.toFixed(2),
    sgst: sgstAmount.toFixed(2),
    cgst: cgstAmount.toFixed(2),
    total: total.toFixed(2),
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <div style={{ padding: 20 }}>
        <h2>Invoice Generator</h2>

        <div style={styles.card}>
          <div style={styles.grid}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onloadend = () => {
                  setData({ ...data, logo: reader.result });
                };
                if (file) reader.readAsDataURL(file);
              }}
            />
            <input
              style={styles.input}
              placeholder="Client Name"
              onChange={(e) => setData({ ...data, clientName: e.target.value })}
            />

            <input
              style={styles.input}
              placeholder="Company"
              onChange={(e) => setData({ ...data, company: e.target.value })}
            />

            <input
              style={styles.input}
              placeholder="Invoice No"
              onChange={(e) => setData({ ...data, invoiceNo: e.target.value })}
            />

            <input
              style={styles.input}
              type="number"
              placeholder="SGST %"
              value={data.sgst}
              onChange={(e) => setData({ ...data, sgst: Number(e.target.value) })}
            />

            <input
              style={styles.input}
              type="number"
              placeholder="CGST %"
              value={data.cgst}
              onChange={(e) => setData({ ...data, cgst: Number(e.target.value) })}
            />

            <input
              style={styles.input}
              type="date"
              onChange={(e) => setData({ ...data, date: e.target.value })}
            />
          </div>

          <h4 style={{ marginTop: 20 }}>Items</h4>

          {data.items.map((item, i) => (
            <div key={i} style={styles.itemRow}>
              <input
                style={styles.input}
                placeholder="Item"
                onChange={(e) => updateItem(i, "name", e.target.value)}
              />

              <input
                style={styles.input}
                placeholder="HSN"
                onChange={(e) => updateItem(i, "hsn", e.target.value)}
              />

              <input
                style={styles.input}
                type="number"
                placeholder="Qty"
                onChange={(e) => updateItem(i, "qty", Number(e.target.value))}
              />

              <input
                style={styles.input}
                type="number"
                placeholder="Price"
                onChange={(e) => updateItem(i, "price", Number(e.target.value))}
              />
            </div>
          ))}

          <div style={styles.buttonBar}>
            <button style={styles.btn} onClick={addItem}>
              Add Item
            </button>
            <button style={styles.btnPrimary} onClick={() => setOpen(true)}>
              Preview
            </button>
            <button style={styles.btnSuccess} onClick={() => downloadPDF(pdfRef.current)}>
              Download
            </button>
          </div>
        </div>

        {open && (
          <div style={styles.overlay} onClick={() => setOpen(false)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <Invoice data={data} totals={totals} />
            </div>
          </div>
        )}

        <div style={{ position: "absolute", left: "-9999px" }}>
          <Invoice ref={pdfRef} data={data} totals={totals} />
        </div>
      </div>

      <Footer />
    </DashboardLayout>
  );
}

/* ================= STYLES ================= */
const styles = {
  page: {
    width: "210mm",
    padding: 25,
    background: "#fff",
    fontFamily: "Arial",
    color: "#000", // base color
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    borderBottom: "2px solid #000",
    paddingBottom: 10,
    color: "#000",
  },

  logo: { height: 60 },

  logoBox: { width: "20%" },

  companyBox: {
    width: "50%",
    textAlign: "center",
    color: "#000",
  },

  invoiceBox: {
    width: "30%",
    textAlign: "right",
    color: "#000",
  },

  title: {
    margin: 0,
    color: "#000",
    fontWeight: "bold",
  },

  billBox: {
    marginBottom: 20,
    padding: 10,
    border: "1px solid #000",
    color: "#000",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    color: "#000",
  },

  th: {
    border: "1px solid #000",
    padding: 8,
    background: "#eee",
    color: "#000",
    fontWeight: "bold",
  },

  td: {
    border: "1px solid #000",
    padding: 8,
    color: "#000",
  },

  totalBox: {
    marginTop: 20,
    textAlign: "right",
    color: "#000",
  },

  words: {
    marginTop: 20,
    color: "#000",
  },

  /* FORM (optional — keep normal UI colors) */
  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 10,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: 10,
  },

  itemRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: 10,
  },

  input: {
    padding: 10,
    border: "1px solid #ccc",
  },

  buttonBar: {
    display: "flex",
    gap: 10,
    marginTop: 20,
    justifyContent: "flex-end",
  },

  btn: {
    padding: "10px 15px",
    background: "#666",
    color: "#fff",
    border: "none",
  },

  btnPrimary: {
    padding: "10px 15px",
    background: "#000",
    color: "#fff",
    border: "none",
  },

  btnSuccess: {
    padding: "10px 15px",
    background: "#2e7d32",
    color: "#fff",
    border: "none",
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
    width: "900px",
    maxHeight: "90vh",
    overflowY: "auto",
    background: "#fff",
    padding: 20,
  },
};
