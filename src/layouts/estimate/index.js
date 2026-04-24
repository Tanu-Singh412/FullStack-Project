import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  TextField,
  Button,
  IconButton,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

const API = "https://fullstack-project-1-n510.onrender.com/api/estimate";

export default function EstimatePage() {
  const [form, setForm] = useState({
    projectTitle: "",
    ownerName: "",
    location: "",
    plotArea: "",
    notes: "",
    description: "",
  });

  const [items, setItems] = useState([
    { sno: 1, desc: "", qty: "", unit: "", rate: "" },
  ]);

  const [estimates, setEstimates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  /* ================= FETCH ALL ================= */
  const loadEstimates = async () => {
    setLoading(true);
    try {
      const res = await fetch(API);
      const data = await res.json();
      setEstimates(data);
    } catch (err) {
      console.error("Error fetching estimates:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEstimates();
  }, []);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (i, field, value) => {
    const updated = [...items];
    updated[i][field] = value;
    setItems(updated);
  };

  /* ================= ADD ROW ================= */
  const addRow = () => {
    setItems([
      ...items,
      { sno: items.length + 1, desc: "", qty: "", unit: "", rate: "" },
    ]);
  };

  /* ================= DELETE ROW ================= */
  const deleteRow = (i) => {
    const updated = items.filter((_, index) => index !== i).map((item, idx) => ({
      ...item,
      sno: idx + 1
    }));
    setItems(updated.length > 0 ? updated : [{ sno: 1, desc: "", qty: "", unit: "", rate: "" }]);
  };

  /* ================= TOTAL ================= */
  const total = items.reduce(
    (sum, i) => sum + Number(i.qty || 0) * Number(i.rate || 0),
    0
  );

  /* ================= SAVE / UPDATE ================= */
  const saveEstimate = async () => {
    try {
      const method = editId ? "PUT" : "POST";
      const url = editId ? `${API}/${editId}` : API;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items, totalEstimate: total }),
      });

      if (res.ok) {
        alert(editId ? "Updated Successfully" : "Saved Successfully");
        setEditId(null);
        setForm({ projectTitle: "", ownerName: "", location: "", plotArea: "", notes: "", description: "" });
        setItems([{ sno: 1, desc: "", qty: "", unit: "", rate: "" }]);
        loadEstimates();
      } else {
        alert("Failed to save estimate");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving estimate");
    }
  };

  /* ================= DELETE ================= */
  const deleteEstimate = async (id) => {
    if (!window.confirm("Are you sure you want to delete this estimate?")) return;
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (res.ok) {
        loadEstimates();
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (est) => {
    setEditId(est._id);
    setForm({
      projectTitle: est.projectTitle || "",
      ownerName: est.ownerName || "",
      location: est.location || "",
      plotArea: est.plotArea || "",
      notes: est.notes || "",
      description: est.description || "",
    });
    setItems(est.items || [{ sno: 1, desc: "", qty: "", unit: "", rate: "" }]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ================= PDF ================= */
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    const addHeader = () => {
      try {
        doc.addImage("/logo.png", "PNG", 15, 10, 22, 22);
      } catch (e) { console.error(e); }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("D DESIGN ARCHITECTS STUDIO", pageWidth / 2, 15, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text("Architects, Interior Designers, Planners.", pageWidth / 2, 20, { align: "center" });
      doc.text("Block No.C-12, Shop No. F-6, Sanjay Place, Agra. 282002", pageWidth / 2, 24, { align: "center" });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("AR. PREMVEER SINGH", pageWidth - 15, 15, { align: "right" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text("(B.Arch), Regi. No.- CA/18/98236", pageWidth - 15, 20, { align: "right" });
      doc.text("Email- premchak24@gmail.com", pageWidth - 15, 24, { align: "right" });

      doc.setDrawColor(0, 0, 0);
      doc.line(15, 35, pageWidth - 15, 35);
    };

    addHeader();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("ESTIMATE / PROPOSAL", pageWidth / 2, 45, { align: "center" });

    autoTable(doc, {
      startY: 50,
      theme: "grid",
      head: [[{ content: "Project Details", colSpan: 4, styles: { halign: "left", fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: "bold" } }]],
      body: [
        ["Project Title:", { content: form.projectTitle || "-", styles: { fontStyle: "bold" } }, "Owner Name:", form.ownerName || "-"],
        ["Location:", form.location || "-", "Plot Area:", form.plotArea ? `${form.plotArea} Sq.Ft` : "-"],
        ["Total Estimated Amount:", { content: `Rs. ${total.toLocaleString("en-IN")}`, colSpan: 3, styles: { fontStyle: "bold" } }],
      ],
      styles: { fontSize: 9, textColor: [0, 0, 0] },
    });

    let currentY = doc.lastAutoTable.finalY + 10;

    if (form.description) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Introduction:", 15, currentY);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const splitDesc = doc.splitTextToSize(form.description, pageWidth - 30);
      doc.text(splitDesc, 15, currentY + 6);
      currentY += (splitDesc.length * 4.5) + 10;
    }

    const tableData = items.map((row) => [
      row.sno,
      row.desc,
      row.qty,
      row.unit,
      row.rate,
      (Number(row.qty) * Number(row.rate)).toLocaleString("en-IN"),
    ]);

    autoTable(doc, {
      startY: currentY,
      theme: "grid",
      head: [["No.", "Description", "Qty", "Unit", "Rate (Rs)", "Amount (Rs)"]],
      body: tableData,
      headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: "bold" },
      styles: { fontSize: 8.5, textColor: [0, 0, 0] },
    });

    const finalY = doc.lastAutoTable.finalY;
    doc.setFont("helvetica", "bold");
    doc.text(`GRAND TOTAL: Rs. ${total.toLocaleString("en-IN")}`, pageWidth - 20, finalY + 12, { align: "right" });

    if (form.notes) {
      doc.text("Notes:", 15, finalY + 25);
      doc.setFont("helvetica", "normal");
      const splitNotes = doc.splitTextToSize(form.notes, pageWidth - 30);
      doc.text(splitNotes, 15, finalY + 31);
    }

    doc.save(`Estimate_${form.projectTitle || "Project"}.pdf`);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox pt={4} pb={3} px={3} sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
        <Grid container spacing={3}>

          {/* ================= QUICK STATS ================= */}
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2, borderRadius: "12px", border: "1px solid #e0e0e0" }}>
              <MDBox display="flex" alignItems="center" gap={2}>
                <MDBox variant="gradient" bgcolor="info" color="white" borderRadius="lg" p={2}>
                  <AssignmentIcon fontSize="medium" />
                </MDBox>
                <Box>
                  <MDTypography variant="caption" fontWeight="bold" color="dark" sx={{ textTransform: "uppercase" }}>Total Estimates</MDTypography>
                  <MDTypography variant="h4" fontWeight="bold" color="dark">{estimates.length}</MDTypography>
                </Box>
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2, borderRadius: "12px", border: "1px solid #e0e0e0" }}>
              <MDBox display="flex" alignItems="center" gap={2}>
                <MDBox variant="gradient" bgcolor="success" color="white" borderRadius="lg" p={2}>
                  <BusinessIcon fontSize="medium" />
                </MDBox>
                <Box>
                  <MDTypography variant="caption" fontWeight="bold" color="dark" sx={{ textTransform: "uppercase" }}>Pipeline Value</MDTypography>
                  <MDTypography variant="h4" fontWeight="bold" color="dark">Rs. {total.toLocaleString("en-IN")}</MDTypography>
                </Box>
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2, borderRadius: "12px", border: "1px solid #e0e0e0" }}>
              <MDBox display="flex" alignItems="center" gap={2}>
                <MDBox variant="gradient" bgcolor="warning" color="white" borderRadius="lg" p={2}>
                  <AspectRatioIcon fontSize="medium" />
                </MDBox>
                <Box>
                  <MDTypography variant="caption" fontWeight="bold" color="dark" sx={{ textTransform: "uppercase" }}>Avg. Size</MDTypography>
                  <MDTypography variant="h4" fontWeight="bold" color="dark">Rs. {estimates.length ? Math.round(estimates.reduce((s, e) => s + (e.totalEstimate || 0), 0) / estimates.length).toLocaleString("en-IN") : 0}</MDTypography>
                </Box>
              </MDBox>
            </Card>
          </Grid>

          {/* ================= ACTION HEADER ================= */}
          <Grid item xs={12}>
            <MDBox
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={3}
              sx={{ bgcolor: "#fff", borderRadius: "12px", border: "1px solid #e0e0e0", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}
            >
              <MDTypography variant="h4" fontWeight="bold" color="dark">Estimate Builder</MDTypography>
              <MDBox display="flex" gap={2}>
                <Button variant="outlined" color="dark" startIcon={<PictureAsPdfIcon />} onClick={generatePDF}>PDF</Button>
                <Button variant="contained" color="dark" startIcon={<SaveIcon />} onClick={saveEstimate}>Save Proposal</Button>
              </MDBox>
            </MDBox>
          </Grid>

          {/* ================= LEFT: PROJECT INFO ================= */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ borderRadius: "12px", border: "1px solid #e0e0e0" }}>
              <MDBox p={3} borderBottom="1px solid #f0f0f0" bgcolor="#fcfcfc">
                <MDTypography variant="h6" fontWeight="bold" color="dark">Project Scope</MDTypography>
              </MDBox>
              <MDBox p={3} display="flex" flexDirection="column" gap={2}>
                <TextField label="Project Title" fullWidth value={form.projectTitle} onChange={(e) => setForm({ ...form, projectTitle: e.target.value })}
                  InputLabelProps={{ style: { color: '#000' } }} inputProps={{ style: { color: '#000' } }} />
                <TextField label="Owner Name" fullWidth value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                  InputLabelProps={{ style: { color: '#000' } }} inputProps={{ style: { color: '#000' } }} />
                <TextField label="Location" fullWidth value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                  InputLabelProps={{ style: { color: '#000' } }} inputProps={{ style: { color: '#000' } }} />
                <TextField label="Plot Area (Sq.Ft)" fullWidth value={form.plotArea} onChange={(e) => setForm({ ...form, plotArea: e.target.value })}
                  InputLabelProps={{ style: { color: '#000' } }} inputProps={{ style: { color: '#000' } }} />
              </MDBox>
            </Card>
          </Grid>

          {/* ================= RIGHT: TABLE ================= */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ borderRadius: "12px", border: "1px solid #e0e0e0", mb: 3 }}>
              <MDBox p={3}>
                <MDTypography variant="h6" fontWeight="bold" color="dark" mb={1}>Introduction</MDTypography>
                <TextField fullWidth multiline rows={3} placeholder="Write something about this project..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  inputProps={{ style: { color: '#000' } }} />
              </MDBox>
            </Card>

            <Card sx={{ borderRadius: "12px", border: "1px solid #e0e0e0" }}>
              <MDBox p={3} display="flex" justifyContent="space-between" alignItems="center" borderBottom="1px solid #f0f0f0" bgcolor="#fcfcfc">
                <MDTypography variant="h6" fontWeight="bold" color="dark">Itemized Breakdown</MDTypography>
                <MDTypography variant="h5" fontWeight="bold" color="dark">Total: Rs. {total.toLocaleString("en-IN")}</MDTypography>
              </MDBox>
              <MDBox p={0}>
                <TableContainer>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ display: "table-header-group" }}>
                      <TableRow>
                        <TableCell sx={{ border: "1px solid #e0e0e0", fontWeight: "bold", color: "#000", bgcolor: "#f5f5f5" }}>S.No</TableCell>
                        <TableCell sx={{ border: "1px solid #e0e0e0", fontWeight: "bold", color: "#000", bgcolor: "#f5f5f5", width: "40%" }}>Description</TableCell>
                        <TableCell sx={{ border: "1px solid #e0e0e0", fontWeight: "bold", color: "#000", bgcolor: "#f5f5f5", textAlign: "center" }}>Qty</TableCell>
                        <TableCell sx={{ border: "1px solid #e0e0e0", fontWeight: "bold", color: "#000", bgcolor: "#f5f5f5", textAlign: "center" }}>Unit</TableCell>
                        <TableCell sx={{ border: "1px solid #e0e0e0", fontWeight: "bold", color: "#000", bgcolor: "#f5f5f5", textAlign: "right" }}>Rate</TableCell>
                        <TableCell sx={{ border: "1px solid #e0e0e0", fontWeight: "bold", color: "#000", bgcolor: "#f5f5f5", textAlign: "right" }}>Amount</TableCell>
                        <TableCell sx={{ border: "1px solid #e0e0e0", bgcolor: "#f5f5f5" }}></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items.map((row, i) => (
                        <TableRow key={i}>
                          <TableCell sx={{ border: "1px solid #e0e0e0", color: "#000", textAlign: "center", fontWeight: "bold" }}>{row.sno}</TableCell>
                          <TableCell sx={{ border: "1px solid #e0e0e0", p: 1 }}>
                            <TextField fullWidth size="small" variant="outlined" value={row.desc} onChange={(e) => handleChange(i, "desc", e.target.value)}
                              inputProps={{ style: { color: '#000', fontSize: '13px' } }} />
                          </TableCell>
                          <TableCell sx={{ border: "1px solid #e0e0e0", p: 1 }}>
                            <TextField type="number" size="small" variant="outlined" value={row.qty} onChange={(e) => handleChange(i, "qty", e.target.value)}
                              inputProps={{ style: { color: '#000', fontSize: '13px', textAlign: 'center' } }} />
                          </TableCell>
                          <TableCell sx={{ border: "1px solid #e0e0e0", p: 1 }}>
                            <TextField size="small" variant="outlined" value={row.unit} onChange={(e) => handleChange(i, "unit", e.target.value)}
                              inputProps={{ style: { color: '#000', fontSize: '13px', textAlign: 'center' } }} />
                          </TableCell>
                          <TableCell sx={{ border: "1px solid #e0e0e0", p: 1 }}>
                            <TextField type="number" size="small" variant="outlined" value={row.rate} onChange={(e) => handleChange(i, "rate", e.target.value)}
                              inputProps={{ style: { color: '#000', fontSize: '13px', textAlign: 'right' } }} />
                          </TableCell>
                          <TableCell sx={{ border: "1px solid #e0e0e0", textAlign: "right", color: "#000", fontWeight: "bold" }}>
                            {(row.qty * row.rate || 0).toLocaleString("en-IN")}
                          </TableCell>
                          <TableCell sx={{ border: "1px solid #e0e0e0", textAlign: "center" }}>
                            <IconButton color="error" onClick={() => deleteRow(i)} size="small"><DeleteIcon fontSize="small" /></IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <MDBox p={2} display="flex" justifyContent="center">
                  <Button variant="outlined" color="dark" startIcon={<AddCircleIcon />} onClick={addRow} sx={{ textTransform: "none" }}>Add Item</Button>
                </MDBox>
              </MDBox>
            </Card>

            <Card sx={{ mt: 3, borderRadius: "12px", border: "1px solid #e0e0e0" }}>
              <MDBox p={3}>
                <MDTypography variant="h6" fontWeight="bold" color="dark" mb={1}>Notes / T&C</MDTypography>
                <TextField fullWidth multiline rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  inputProps={{ style: { color: '#000' } }} />
              </MDBox>
            </Card>
          </Grid>

          {/* ================= HISTORY ================= */}
          <Grid item xs={12}>
            <Card sx={{ mt: 4, borderRadius: "12px", border: "1px solid #e0e0e0" }}>
              <MDBox p={3} borderBottom="1px solid #f0f0f0">
                <MDTypography variant="h5" fontWeight="bold" color="dark">Saved Estimates</MDTypography>
              </MDBox>
              <MDBox pb={3}>
                <DataTable
                  table={{
                    columns: [
                      { Header: "Project", accessor: "projectTitle", width: "40%" },
                      { Header: "Client", accessor: "ownerName", width: "20%" },
                      { Header: "Amount", accessor: "totalEstimate", width: "20%", Cell: ({ value }) => <MDTypography variant="button" fontWeight="bold" color="dark">Rs. {value?.toLocaleString("en-IN")}</MDTypography> },
                      {
                        Header: "Actions",
                        accessor: "actions",
                        Cell: ({ row }) => (
                          <MDBox display="flex" gap={1}>
                            <IconButton color="info" onClick={() => handleEdit(row.original)} size="small"><EditIcon fontSize="small" /></IconButton>
                            <IconButton color="error" onClick={() => deleteEstimate(row.original._id)} size="small"><DeleteIcon fontSize="small" /></IconButton>
                          </MDBox>
                        ),
                      },
                    ],
                    rows: estimates,
                  }}
                  isSorted={true}
                  entriesPerPage={{ defaultValue: 5, entries: [5, 10, 15, 20, 25] }}
                  showTotalEntries={true}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}