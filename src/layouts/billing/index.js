import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Avatar from "@mui/material/Avatar";
import {
  Card,
  Grid,
  TextField,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  IconButton,
  Paper,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import go2webLogo from "assets/images/logo.png";

import {
  fetchInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice as apiDeleteInvoice,
} from "./api/invoiceApi";

/* ================= CONSTANTS ================= */
const FIXED_COMPANY_DETAILS = {
  company: "Go2Web Solution",
  address: "Sanjay Place",
  gstin: "27AAACS1234A1Z1",
  phone: "9876543210",
  logo: go2webLogo,
};

/* ================= PDF ================= */
const downloadPDF = async (el) => {
  if (!el) return alert("Invoice not ready");

  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
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
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen",
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

/* ================= INVOICE COMPONENT ================= */
const Invoice = React.forwardRef(({ data, totals }, ref) => {
  return (
    <div ref={ref} style={styles.page}>
      <div style={styles.headerRow}>
        <div style={styles.headerLeft}>
          {data.logo && <img src={data.logo} alt="logo" style={styles.logo} crossOrigin="anonymous" />}
        </div>
        <div style={styles.headerCenter}>
          <div style={styles.invoiceTitle}>TAX INVOICE</div>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.metaText}><b>Invoice No:</b> {data.invoiceNo}</div>
          <div style={styles.metaText}><b>Date:</b> {data.date ? new Date(data.date).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' }) : ""}</div>
        </div>
      </div>

      <div style={styles.flexRow}>
        <div style={styles.senderBox}>
          <div style={styles.sectionTitle}>From</div>
          <div style={styles.infoText}>
            <b>{data.company}</b><br />
            {data.address && <>{data.address}<br /></>}
            {data.phone && <>Phone: {data.phone}<br /></>}
            {data.gstin && <>GSTIN: {data.gstin}</>}
          </div>
        </div>
        <div style={styles.receiverBox}>
          <div style={styles.sectionTitle}>Bill To</div>
          <div style={styles.infoText}>
            <b>{data.billingName}</b><br />
            {data.email && <>{data.email}<br /></>}
            {data.billingGstin && <>GSTIN: {data.billingGstin}</>}
          </div>
        </div>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={{ ...styles.th, width: "40%" }}>Description</th>
            {data.items.some((i) => i.hsn) && <th style={styles.th}>HSN/SAC</th>}
            <th style={{ ...styles.th, textAlign: "center" }}>Qty</th>
            <th style={{ ...styles.th, textAlign: "right" }}>Rate</th>
            <th style={{ ...styles.th, textAlign: "right" }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, i) => (
            <tr key={i}>
              <td style={styles.td}>{item.name}</td>
              {data.items.some((i) => i.hsn) && <td style={styles.td}>{item.hsn || "-"}</td>}
              <td style={{ ...styles.td, textAlign: "center" }}>{item.qty}</td>
              <td style={{ ...styles.td, textAlign: "right" }}>₹{item.price}</td>
              <td style={{ ...styles.td, textAlign: "right" }}>₹{item.qty * item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={styles.totalBox}>
        <div style={styles.totalRow}><span>Subtotal:</span><span>₹{totals.subtotal}</span></div>
        {data.sgst > 0 && <div style={styles.totalRow}><span>SGST ({data.sgst}%):</span><span>₹{totals.sgst}</span></div>}
        {data.cgst > 0 && <div style={styles.totalRow}><span>CGST ({data.cgst}%):</span><span>₹{totals.cgst}</span></div>}
        <div style={styles.finalTotal}><span>Total:</span><span>₹{totals.total}</span></div>
      </div>

      <div style={styles.words}><b>Amount in Words:</b> {numberToWords(totals.total)}</div>
    </div>
  );
});

Invoice.propTypes = { data: PropTypes.object.isRequired, totals: PropTypes.object.isRequired };

/* ================= MAIN COMPONENT ================= */
export default function InvoicePage() {
  const pdfRef = useRef();
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Filter States
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Form State
  const [data, setData] = useState({
    _id: null,
    logo: FIXED_COMPANY_DETAILS.logo,
    billingName: "",
    email: "",
    company: FIXED_COMPANY_DETAILS.company,
    address: FIXED_COMPANY_DETAILS.address,
    gstin: FIXED_COMPANY_DETAILS.gstin,
    phone: FIXED_COMPANY_DETAILS.phone,
    invoiceNo: "",
    date: new Date().toISOString().split("T")[0],
    billingGstin: "",
    sgst: 9,
    cgst: 9,
    items: [{ name: "", hsn: "", qty: 1, price: 0 }],
  });

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

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const response = await fetchInvoices(search, filter, startDate, endDate);
      if (response.success) {
        setInvoices(response.data);
        if (response.data.length > 0 && !data._id && !data.invoiceNo) {
          const numbers = response.data.map(inv => parseInt(inv.invoiceNo?.replace(/[^0-9]/g, ''))).filter(n => !isNaN(n));
          const nextNo = numbers.length > 0 ? Math.max(...numbers) + 1 : 1001;
          setData(prev => ({ ...prev, invoiceNo: prev.invoiceNo || `INV-${String(nextNo).padStart(4, '0')}` }));
        } else if (!data._id && !data.invoiceNo) {
          setData(prev => ({ ...prev, invoiceNo: `INV-1001` }));
        }
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadInvoices(); }, [search, filter, startDate, endDate]);

  const handleInputChange = (field, value) => setData((prev) => ({ ...prev, [field]: value }));
  const updateItem = (i, field, value) => {
    const items = [...data.items];
    items[i][field] = value;
    setData({ ...data, items });
  };
  const addItem = () => setData({ ...data, items: [...data.items, { name: "", hsn: "", qty: 1, price: 0 }] });
  const removeItem = (index) => setData({ ...data, items: data.items.filter((_, i) => i !== index) });

  const handleSaveAndDownload = async () => {
    try {
      const payload = { ...data, clientName: data.billingName, invoiceName: data.billingName, clientGstin: data.billingGstin, total: Number(totals.total) };
      delete payload._id; delete payload.createdAt; delete payload.updatedAt; delete payload.__v;
      let res = data._id ? await updateInvoice(data._id, payload) : await createInvoice(payload);
      if (res.success) {
        loadInvoices(); downloadPDF(pdfRef.current);
        setData(prev => ({ ...prev, _id: null, billingName: "", email: "", invoiceNo: "", items: [{ name: "", hsn: "", qty: 1, price: 0 }] }));
      }
    } catch (err) { alert("Save failed"); }
  };

  const handleDelete = async () => {
    try { await apiDeleteInvoice(deleteId); setDeleteId(null); loadInvoices(); } catch (err) { console.error(err); }
  };

  const handleDownloadExisting = async (inv) => {
    setData({ ...data, ...inv, billingName: inv.invoiceName, billingGstin: inv.clientGstin || inv.billingGstin });
    setTimeout(() => downloadPDF(pdfRef.current), 500);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box p={3}>
        <MDBox pt={6} pb={3} px={3}>
          <MDBox display="flex" alignItems="center" mb={3} gap={2}>
            <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ bgcolor: "#b6276aff", color: "#fff" }}>Back</Button>
            <MDTypography variant="h4" fontWeight="bold">Invoice Management</MDTypography>
          </MDBox>

          {/* ================= FORM ================= */}
          <Card sx={{ p: 4, mb: 4, borderRadius: 3, boxShadow: "0px 4px 20px rgba(0,0,0,0.05)" }}>
            <Typography variant="h5" fontWeight="900" mb={4} sx={{ color: "#2c3e50" }}>Create / Edit Invoice</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Billing Name *" variant="outlined" value={data.billingName} onChange={(e) => handleInputChange("billingName", e.target.value)} required />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Billing Email" variant="outlined" value={data.email} onChange={(e) => handleInputChange("email", e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Billing GSTIN" variant="outlined" value={data.billingGstin} onChange={(e) => handleInputChange("billingGstin", e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField fullWidth label="Invoice No" variant="outlined" value={data.invoiceNo} onChange={(e) => handleInputChange("invoiceNo", e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField fullWidth label="Date" type="date" InputLabelProps={{ shrink: true }} value={data.date} onChange={(e) => handleInputChange("date", e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField fullWidth label="SGST %" type="number" value={data.sgst} onChange={(e) => handleInputChange("sgst", Number(e.target.value))} />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField fullWidth label="CGST %" type="number" value={data.cgst} onChange={(e) => handleInputChange("cgst", Number(e.target.value))} />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold" mt={2} mb={1}>Items</Typography>
                {data.items.map((item, i) => (
                  <Grid container spacing={2} key={i} sx={{ mb: 2, alignItems: "center" }}>
                    <Grid item xs={12} sm={4}><TextField fullWidth label="Item Name" size="small" value={item.name} onChange={(e) => updateItem(i, "name", e.target.value)} /></Grid>
                    <Grid item xs={12} sm={2}><TextField fullWidth label="HSN" size="small" value={item.hsn} onChange={(e) => updateItem(i, "hsn", e.target.value)} /></Grid>
                    <Grid item xs={12} sm={2}><TextField fullWidth label="Qty" type="number" size="small" value={item.qty} onChange={(e) => updateItem(i, "qty", Number(e.target.value))} /></Grid>
                    <Grid item xs={12} sm={2}><TextField fullWidth label="Price" type="number" size="small" value={item.price} onChange={(e) => updateItem(i, "price", Number(e.target.value))} /></Grid>
                    <Grid item xs={12} sm={2}><IconButton color="error" onClick={() => removeItem(i)} disabled={data.items.length === 1}><DeleteIcon /></IconButton></Grid>
                  </Grid>
                ))}
                <Button startIcon={<AddIcon />} onClick={addItem} variant="text">Add Item</Button>
              </Grid>
            </Grid>
            <Box mt={4} display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" fontWeight="bold">Total: ₹{totals.total}</Typography>
              <Box display="flex" gap={2}>
                <Button variant="outlined" onClick={() => setPreviewOpen(true)} startIcon={<VisibilityIcon />}>Preview</Button>
                <Button variant="contained" color="success" onClick={handleSaveAndDownload} startIcon={<DownloadIcon />} sx={{ color: "white" }}>Save & Download</Button>
              </Box>
            </Box>
          </Card>

          {/* ================= SAVED INVOICES ================= */}
          <Card sx={{ p: 4, borderRadius: 4, boxShadow: "0px 10px 40px rgba(0,0,0,0.08)" }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
              <Typography variant="h5" fontWeight="900" color="info">Saved Invoices</Typography>
              <Box display="flex" gap={2}>
                <TextField size="small" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }} />
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="day">Today</MenuItem>
                    <MenuItem value="month">This Month</MenuItem>
                    <MenuItem value="year">This Year</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {loading ? <Box display="flex" justifyContent="center" py={5}><CircularProgress /></Box> : (
              <DataTable
                table={{
                  columns: [
                    { Header: "Invoice No", accessor: "invoiceNo", width: "15%" },
                    { Header: "Recipient", accessor: "invoiceName", width: "30%" },
                    { Header: "Date", accessor: "date", width: "15%", Cell: ({ value, row }) => new Date(value || row.original.createdAt).toLocaleDateString() },
                    { Header: "Amount", accessor: "total", width: "15%", Cell: ({ value }) => `₹${value?.toLocaleString("en-IN")}` },
                    {
                      Header: "Actions",
                      accessor: "actions",
                      Cell: ({ row }) => (
                        <Box display="flex" gap={1}>
                          <IconButton color="info" size="small" onClick={() => {
                            const inv = row.original;
                            setData({ ...data, ...inv, billingName: inv.invoiceName, billingGstin: inv.clientGstin || inv.billingGstin, date: new Date(inv.date || inv.createdAt).toISOString().split("T")[0] });
                            setPreviewOpen(true);
                          }}><VisibilityIcon fontSize="small" /></IconButton>
                          <IconButton color="success" size="small" onClick={() => handleDownloadExisting(row.original)}><DownloadIcon fontSize="small" /></IconButton>
                          <IconButton color="error" size="small" onClick={() => setDeleteId(row.original._id)}><DeleteIcon fontSize="small" /></IconButton>
                        </Box>
                      )
                    }
                  ],
                  rows: invoices
                }}
                entriesPerPage={{ defaultValue: 5, entries: [5, 10, 25, 50] }}
                isSorted={true}
                noEndBorder
              />
            )}
          </Card>
        </MDBox>
      </Box>
      <Footer />

      {/* Dialogs */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ textAlign: "center" }}><WarningAmberIcon color="error" sx={{ fontSize: 40 }} /><br />Confirm Delete</DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>Are you sure? This action cannot be undone.</DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete} sx={{ color: "#fff" }}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Invoice Preview</DialogTitle>
        <DialogContent dividers sx={{ bgcolor: "#f5f5f5", display: "flex", justifyContent: "center", p: 4 }}><Paper elevation={3}><Invoice data={data} totals={totals} /></Paper></DialogContent>
        <DialogActions sx={{ p: 3 }}><Button onClick={() => setPreviewOpen(false)}>Close</Button><Button onClick={() => { handleSaveAndDownload(); setPreviewOpen(false); }} variant="contained" color="success" sx={{ color: "white" }} startIcon={<DownloadIcon />}>Save & Download</Button></DialogActions>
      </Dialog>
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}><Invoice ref={pdfRef} data={data} totals={totals} /></div>
    </DashboardLayout>
  );
}

const styles = {
  page: { width: "210mm", minHeight: "297mm", padding: "50px", background: "#fff", fontFamily: "Inter, sans-serif", color: "#111" },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px", borderBottom: "3px solid #e0e0e0", paddingBottom: "25px" },
  headerLeft: { flex: 1 },
  logo: { height: "80px", objectFit: "contain" },
  headerCenter: { flex: 1, textAlign: "center" },
  invoiceTitle: { fontSize: "25px", fontWeight: "900", color: "#2c3e50", letterSpacing: "2px" },
  headerRight: { flex: 1, textAlign: "right" },
  metaText: { fontSize: "16px", marginBottom: "6px", color: "#333", fontWeight: "600" },
  flexRow: { display: "flex", justifyContent: "space-between", marginBottom: "45px" },
  senderBox: { width: "48%" },
  receiverBox: { width: "48%", textAlign: "right" },
  sectionTitle: { fontSize: "18px", fontWeight: "800", color: "#2c3e50", textTransform: "uppercase", marginBottom: "12px", borderBottom: "3px solid #3498db", display: "inline-block" },
  infoText: { fontSize: "16px", lineHeight: "1.8", color: "#222" },
  table: { width: "100%", borderCollapse: "collapse", marginBottom: "45px" },
  th: { borderBottom: "2px solid #bdc3c7", padding: "12px", background: "#f8f9fa", color: "#2c3e50", fontWeight: "900", textAlign: "left" },
  td: { borderBottom: "1px solid #ecf0f1", padding: "12px", color: "#111", fontSize: "15px" },
  totalBox: { width: "50%", marginLeft: "auto", background: "#f8f9fa", padding: "20px", borderRadius: "8px" },
  totalRow: { display: "flex", justifyContent: "space-between", marginBottom: "10px", fontWeight: "700" },
  finalTotal: { display: "flex", justifyContent: "space-between", marginTop: "10px", paddingTop: "10px", borderTop: "2px solid #bdc3c7", fontSize: "20px", fontWeight: "900" },
  words: { marginTop: "30px", fontSize: "14px", fontStyle: "italic", borderTop: "1px dashed #ccc", paddingTop: "10px" },
};
