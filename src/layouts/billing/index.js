import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// MUI Components
import {
  Card, Grid, TextField, Button, Typography, Dialog, DialogTitle,
  DialogContent, DialogActions, Box, IconButton, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Select,
  MenuItem, FormControl, InputLabel, Divider, CircularProgress,
  InputAdornment
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import { fetchInvoices, createInvoice, deleteInvoice as apiDeleteInvoice } from "./api/invoiceApi";

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
  const a = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
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
      <div style={styles.headerCenter}>
        {data.logo && <img src={data.logo} alt="logo" style={styles.logo} crossOrigin="anonymous" />}
        <h1 style={styles.companyTitle}>{data.company || "YOUR COMPANY"}</h1>
      </div>
      
      <div style={styles.invoiceTitle}>TAX INVOICE</div>

      <div style={styles.invoiceMeta}>
        <div style={styles.metaItem}><b>Invoice No:</b> {data.invoiceNo}</div>
        <div style={styles.metaItem}><b>Date:</b> {data.date ? new Date(data.date).toLocaleDateString('en-IN') : ''}</div>
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
            <th style={{...styles.th, width: "40%"}}>Description</th>
            {data.items.some((i) => i.hsn) && <th style={styles.th}>HSN/SAC</th>}
            <th style={{...styles.th, textAlign: "center"}}>Qty</th>
            <th style={{...styles.th, textAlign: "right"}}>Rate</th>
            <th style={{...styles.th, textAlign: "right"}}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, i) => (
            <tr key={i}>
              <td style={styles.td}>{item.name}</td>
              {data.items.some((i) => i.hsn) && <td style={styles.td}>{item.hsn || "-"}</td>}
              <td style={{...styles.td, textAlign: "center"}}>{item.qty}</td>
              <td style={{...styles.td, textAlign: "right"}}>₹{item.price}</td>
              <td style={{...styles.td, textAlign: "right"}}>₹{item.qty * item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={styles.totalBox}>
        <div style={styles.totalRow}>
          <span>Subtotal:</span>
          <span>₹{totals.subtotal}</span>
        </div>
        {data.sgst > 0 && (
          <div style={styles.totalRow}>
            <span>SGST ({data.sgst}%):</span>
            <span>₹{totals.sgst}</span>
          </div>
        )}
        {data.cgst > 0 && (
          <div style={styles.totalRow}>
            <span>CGST ({data.cgst}%):</span>
            <span>₹{totals.cgst}</span>
          </div>
        )}
        <div style={styles.finalTotal}>
          <span>Total:</span>
          <span>₹{totals.total}</span>
        </div>
      </div>

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

/* ================= MAIN COMPONENT ================= */
export default function InvoicePage() {
  const pdfRef = useRef();
  
  // Data States
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  
  // Filter States
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all, day, month, year, custom
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Form State
  const [data, setData] = useState({
    logo: "",
    billingName: "",
    email: "",
    company: "",
    address: "",
    gstin: "",
    phone: "",
    invoiceNo: "",
    date: new Date().toISOString().split('T')[0],
    billingGstin: "",
    sgst: 9,
    cgst: 9,
    items: [{ name: "", hsn: "", qty: 1, price: 0 }],
  });

  // Calculate Totals
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

  // Fetch from API
  const loadInvoices = async () => {
    setLoading(true);
    try {
      const response = await fetchInvoices(search, filter, filter === 'custom' ? startDate : '', filter === 'custom' ? endDate : '');
      if (response.success) {
        setInvoices(response.data);
      }
    } catch (err) {
      console.error("Failed to load invoices", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, [search, filter, startDate, endDate]);

  // Form Handlers
  const handleInputChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const updateItem = (i, field, value) => {
    const items = [...data.items];
    items[i][field] = value;
    setData({ ...data, items });
  };

  const addItem = () => {
    setData({ ...data, items: [...data.items, { name: "", hsn: "", qty: 1, price: 0 }] });
  };

  const removeItem = (index) => {
    const items = data.items.filter((_, i) => i !== index);
    setData({ ...data, items });
  };

  const handleSaveAndDownload = async () => {
    try {
      const payload = {
        ...data,
        clientName: data.billingName, // Backwards compatibility with old schema
        invoiceName: data.billingName, // New schema
        clientGstin: data.billingGstin, // backend uses clientGstin or we should keep it billingGstin
        subtotal: Number(totals.subtotal),
        total: Number(totals.total),
      };
      // Create invoice in backend
      const res = await createInvoice(payload);
      if (res.success) {
        loadInvoices(); // Refresh list
        downloadPDF(pdfRef.current);
        // Reset form
        setData({
          ...data,
          billingName: "", email: "", invoiceNo: "", date: new Date().toISOString().split('T')[0],
          items: [{ name: "", hsn: "", qty: 1, price: 0 }]
        });
      } else {
        alert("Failed to save invoice: " + (res.message || "Please check required fields."));
      }
    } catch (err) {
      console.error("Failed to save invoice", err);
      alert("Network error or failed to save. Is the backend running?");
    }
  };

  const handleDelete = async () => {
    try {
      await apiDeleteInvoice(deleteId);
      setDeleteId(null);
      loadInvoices();
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  const handleDownloadExisting = async (inv) => {
    // Populate form temporarily for PDF generation
    setData({
      ...data,
      ...inv,
      billingName: inv.invoiceName,
      billingGstin: inv.clientGstin || inv.billingGstin,
      date: inv.date ? new Date(inv.date).toISOString().split('T')[0] : data.date
    });
    // Wait for state to update, then download
    setTimeout(() => {
      downloadPDF(pdfRef.current);
    }, 500);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box p={3}>
        <Typography variant="h4" fontWeight="bold" mb={3} color="primary">
          Billing & Invoicing
        </Typography>

        {/* ================= INVOICE FORM ================= */}
        <Card sx={{ p: 4, mb: 4, borderRadius: 3, boxShadow: 3 }}>
          <Typography variant="h6" fontWeight="bold" mb={3}>
            Create New Invoice
          </Typography>
          <Grid container spacing={3}>
            {/* Company Info */}
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Your Company Name" variant="outlined" value={data.company} onChange={(e) => handleInputChange("company", e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Company GSTIN" variant="outlined" value={data.gstin} onChange={(e) => handleInputChange("gstin", e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Company Phone" variant="outlined" value={data.phone} onChange={(e) => handleInputChange("phone", e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Company Address" variant="outlined" value={data.address} onChange={(e) => handleInputChange("address", e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
               <Button variant="outlined" component="label" fullWidth sx={{ height: '100%' }}>
                  Upload Logo
                  <input type="file" hidden accept="image/*" onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => handleInputChange("logo", reader.result);
                      reader.readAsDataURL(file);
                    }
                  }} />
                </Button>
            </Grid>

            {/* Client Info */}
            <Grid item xs={12}>
              <Divider><Typography variant="body2" color="textSecondary">Billing Information</Typography></Divider>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Billing Name *" variant="outlined" value={data.billingName} onChange={(e) => handleInputChange("billingName", e.target.value)} required />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Billing Email" variant="outlined" value={data.email} onChange={(e) => handleInputChange("email", e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Billing GSTIN" variant="outlined" value={data.billingGstin} onChange={(e) => handleInputChange("billingGstin", e.target.value)} />
            </Grid>

            {/* Invoice Details */}
            <Grid item xs={12}>
              <Divider><Typography variant="body2" color="textSecondary">Invoice Details</Typography></Divider>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField fullWidth label="Invoice Number *" variant="outlined" value={data.invoiceNo} onChange={(e) => handleInputChange("invoiceNo", e.target.value)} required />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField fullWidth label="Date *" type="date" InputLabelProps={{ shrink: true }} value={data.date} onChange={(e) => handleInputChange("date", e.target.value)} required />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField fullWidth label="SGST %" type="number" variant="outlined" value={data.sgst} onChange={(e) => handleInputChange("sgst", Number(e.target.value))} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField fullWidth label="CGST %" type="number" variant="outlined" value={data.cgst} onChange={(e) => handleInputChange("cgst", Number(e.target.value))} />
            </Grid>

            {/* Items */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" mt={2} mb={1}>
                Items
              </Typography>
              {data.items.map((item, i) => (
                <Grid container spacing={2} key={i} sx={{ mb: 2, alignItems: 'center' }}>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="Item Name" variant="outlined" size="small" value={item.name} onChange={(e) => updateItem(i, "name", e.target.value)} />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField fullWidth label="HSN" variant="outlined" size="small" value={item.hsn} onChange={(e) => updateItem(i, "hsn", e.target.value)} />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField fullWidth label="Qty" type="number" variant="outlined" size="small" value={item.qty} onChange={(e) => updateItem(i, "qty", Number(e.target.value))} />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField fullWidth label="Price" type="number" variant="outlined" size="small" value={item.price} onChange={(e) => updateItem(i, "price", Number(e.target.value))} />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <IconButton color="error" onClick={() => removeItem(i)} disabled={data.items.length === 1}>
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Button startIcon={<AddIcon />} onClick={addItem} variant="text" color="primary">
                Add Another Item
              </Button>
            </Grid>
          </Grid>

          <Box mt={4} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="bold">Total Amount: ₹{totals.total}</Typography>
            <Box display="flex" gap={2}>
              <Button variant="outlined" color="info" onClick={() => setPreviewOpen(true)} startIcon={<VisibilityIcon />}>
                Preview
              </Button>
              <Button variant="contained" color="success" onClick={handleSaveAndDownload} startIcon={<DownloadIcon />} sx={{ color: 'white' }}>
                Save & Download PDF
              </Button>
            </Box>
          </Box>
        </Card>

        {/* ================= SAVED INVOICES ================= */}
        <Card sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
            <Typography variant="h5" fontWeight="bold">
              Saved Invoices
            </Typography>
            
            {/* Search and Filters */}
            <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search Billing Name or Inv No"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Filter By</InputLabel>
                <Select value={filter} label="Filter By" onChange={(e) => setFilter(e.target.value)}>
                  <MenuItem value="all">All Time</MenuItem>
                  <MenuItem value="day">Today</MenuItem>
                  <MenuItem value="month">This Month</MenuItem>
                  <MenuItem value="year">This Year</MenuItem>
                  <MenuItem value="custom">Custom Date</MenuItem>
                </Select>
              </FormControl>

              {filter === "custom" && (
                <>
                  <TextField type="date" size="small" label="Start" InputLabelProps={{ shrink: true }} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  <TextField type="date" size="small" label="End" InputLabelProps={{ shrink: true }} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </>
              )}
            </Box>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>
          ) : (
            <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #eee" }}>
              <Table>
                <TableHead sx={{ backgroundColor: "#f8f9fa" }}>
                  <TableRow>
                    <TableCell><b>Invoice No</b></TableCell>
                    <TableCell><b>Billing Name</b></TableCell>
                    <TableCell><b>Date</b></TableCell>
                    <TableCell><b>Total Amount</b></TableCell>
                    <TableCell align="center"><b>Actions</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                        <Typography variant="body1" color="textSecondary">No invoices found</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    invoices.map((inv) => (
                      <TableRow key={inv._id} hover>
                        <TableCell>{inv.invoiceNo}</TableCell>
                        <TableCell>{inv.invoiceName}</TableCell>
                        <TableCell>{new Date(inv.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>₹{inv.total}</TableCell>
                        <TableCell align="center">
                          <IconButton color="info" onClick={() => {
                            setData({ ...data, ...inv, billingName: inv.invoiceName, billingGstin: inv.clientGstin || inv.billingGstin, date: new Date(inv.date).toISOString().split('T')[0] });
                            setPreviewOpen(true);
                          }}>
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton color="success" onClick={() => handleDownloadExisting(inv)}>
                            <DownloadIcon />
                          </IconButton>
                          <IconButton color="error" onClick={() => setDeleteId(inv._id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Card>

        {/* Hidden PDF Component */}
        <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
          <Invoice ref={pdfRef} data={data} totals={totals} />
        </div>
      </Box>
      <Footer />

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}>
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", fontSize: "18px", display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
          <WarningAmberIcon sx={{ color: "#f44336", fontSize: 40 }} />
          Confirm Delete
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", fontSize: "14px", color: "#555" }}>
          Are you sure you want to delete this invoice?<br />
          <b style={{ color: "#f44336" }}>This action cannot be undone.</b>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2, gap: 1 }}>
          <Button onClick={() => setDeleteId(null)} sx={{ borderRadius: "8px", textTransform: "none", px: 3, border: "1px solid black", color: "#000" }}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete} sx={{ borderRadius: "8px", textTransform: "none", px: 3, background: "#f44336", color: "#fff", "&:hover": { background: "#d32f2f" } }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Invoice Preview</DialogTitle>
        <DialogContent dividers sx={{ backgroundColor: "#f5f5f5", display: 'flex', justifyContent: 'center', p: 4 }}>
          <Paper elevation={3}>
            <Invoice data={data} totals={totals} />
          </Paper>
        </DialogContent>
        <DialogActions sx={{ padding: "20px 24px", justifyContent: "flex-end" }}>
          <Button onClick={() => setPreviewOpen(false)} color="inherit">Close</Button>
          <Button onClick={() => { handleSaveAndDownload(); setPreviewOpen(false); }} variant="contained" color="success" sx={{ color: 'white' }} startIcon={<DownloadIcon />}>
            Save & Download PDF
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

/* ================= STYLES ================= */
const styles = {
  page: { width: "210mm", minHeight: "297mm", padding: 40, background: "#fff", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", color: "#333" },
  headerCenter: { textAlign: "center", marginBottom: 30 },
  logo: { height: 80, marginBottom: 10 },
  companyTitle: { margin: 0, fontSize: 24, fontWeight: "bold", color: "#111", textTransform: "uppercase" },
  invoiceTitle: { fontSize: 28, fontWeight: "bold", color: "#2c3e50", margin: "10px 0 20px 0", textAlign: "center", textTransform: "uppercase", letterSpacing: 2 },
  flexRow: { display: "flex", justifyContent: "space-between", marginBottom: 30 },
  senderBox: { width: "45%" },
  receiverBox: { width: "45%", textAlign: "right" },
  sectionTitle: { fontSize: 14, fontWeight: "bold", color: "#7f8c8d", textTransform: "uppercase", marginBottom: 5, borderBottom: "2px solid #3498db", display: "inline-block", paddingBottom: 3 },
  infoText: { fontSize: 13, lineHeight: 1.6, color: "#444" },
  table: { width: "100%", borderCollapse: "collapse", marginBottom: 30 },
  th: { borderBottom: "2px solid #bdc3c7", padding: "12px 8px", background: "#f8f9fa", color: "#2c3e50", fontWeight: "bold", textAlign: "left", fontSize: 14 },
  td: { borderBottom: "1px solid #ecf0f1", padding: "12px 8px", color: "#333", fontSize: 13 },
  totalBox: { width: "50%", marginLeft: "auto", background: "#f8f9fa", padding: 20, borderRadius: 5 },
  totalRow: { display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 14 },
  finalTotal: { display: "flex", justifyContent: "space-between", marginTop: 10, paddingTop: 10, borderTop: "2px solid #bdc3c7", fontSize: 18, fontWeight: "bold", color: "#2c3e50" },
  words: { marginTop: 20, fontSize: 13, color: "#7f8c8d", fontStyle: "italic" },
  invoiceMeta: { width: "100%", display: "flex", justifyContent: "space-between", background: "#f8f9fa", padding: 15, borderRadius: 5, marginBottom: 30 },
  metaItem: { fontSize: 13 },
};
