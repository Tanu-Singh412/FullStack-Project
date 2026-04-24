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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
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

  /* ================= WHATSAPP ================= */
  const handleWhatsApp = (est) => {
    const text = `*Estimate Proposal*\n\nProject: ${est.projectTitle}\nOwner: ${est.ownerName}\nTotal Amount: Rs. ${est.totalEstimate.toLocaleString("en-IN")}\n\nThank you for choosing D DESIGN ARCHITECTS STUDIO.`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  /* ================= PDF ================= */
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // --- HEADER HELPER ---
    const addHeader = () => {
      // Logo (Left)
      try {
        doc.addImage("/logo.png", "PNG", 15, 10, 22, 22);
      } catch (e) {
        console.error("Logo not found", e);
      }

      // Studio Info (Center)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("D DESIGN ARCHITECTS STUDIO", pageWidth / 2, 15, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(50, 50, 50);
      doc.text("Architects, Interior Designers, Planners.", pageWidth / 2, 20, { align: "center" });
      doc.text("Block No.C-12, Shop No. F-6,", pageWidth / 2, 24, { align: "center" });
      doc.text("Near Max Malll, Sanjay Place, Agra. 282002", pageWidth / 2, 28, { align: "center" });

      // Architect Info (Right)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text("AR. PREMVEER SINGH", pageWidth - 15, 15, { align: "right" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text("(B.Arch)", pageWidth - 15, 19, { align: "right" });
      doc.text("Regi. No.- CA/18/98236", pageWidth - 15, 23, { align: "right" });
      doc.text("Email- premchak24@gmail.com", pageWidth - 15, 27, { align: "right" });

      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.2);
      doc.line(15, 35, pageWidth - 15, 35);
    };

    addHeader();

    // --- TITLE ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("ESTIMATE / PROPOSAL", pageWidth / 2, 45, { align: "center" });

    // --- PROJECT DETAILS TABLE ---
    autoTable(doc, {
      startY: 50,
      theme: "grid",
      head: [[{ content: "Project Details", colSpan: 4, styles: { halign: "left", fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: "bold" } }]],
      body: [
        ["Project Title:", { content: form.projectTitle || "-", styles: { fontStyle: "bold" } }, "Owner Name:", form.ownerName || "-"],
        ["Location:", form.location || "-", "Plot Area:", form.plotArea ? `${form.plotArea} Sq.Ft` : "-"],
        ["Total Estimated Amount:", { content: `Rs. ${total.toLocaleString("en-IN")}`, colSpan: 3, styles: { fontStyle: "bold" } }],
      ],
      styles: { fontSize: 9, cellPadding: 3, textColor: [0, 0, 0] },
      headStyles: { lineWidth: 0.1, lineColor: [0, 0, 0] },
    });

    let currentY = doc.lastAutoTable.finalY + 10;

    // --- OVERALL DESCRIPTION ---
    if (form.description) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Project Description / Introduction:", 15, currentY);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const splitDesc = doc.splitTextToSize(form.description, pageWidth - 30);
      doc.text(splitDesc, 15, currentY + 6);
      currentY += (splitDesc.length * 4.5) + 10;
    }

    // --- ITEMS TABLE ---
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
      head: [["S.No", "Description", "Qty", "Unit", "Rate (Rs)", "Amount (Rs)"]],
      body: tableData,
      headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: "bold", lineWidth: 0.1 },
      styles: { fontSize: 8.5, cellPadding: 3, textColor: [0, 0, 0] },
      columnStyles: {
        0: { cellWidth: 12 },
        1: { cellWidth: "auto" },
        2: { cellWidth: 15, halign: "center" },
        3: { cellWidth: 15, halign: "center" },
        4: { cellWidth: 22, halign: "right" },
        5: { cellWidth: 25, halign: "right" },
      },
      didDrawPage: (data) => {
        if (data.pageNumber > 1) {
          addHeader();
        }
      },
    });

    // --- SUMMARY ---
    const finalY = doc.lastAutoTable.finalY;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`GRAND TOTAL: Rs. ${total.toLocaleString("en-IN")}`, pageWidth - 20, finalY + 12, { align: "right" });

    // --- NOTES SECTION ---
    if (form.notes) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Notes / Terms & Conditions:", 15, finalY + 25);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const splitNotes = doc.splitTextToSize(form.notes, pageWidth - 30);
      doc.text(splitNotes, 15, finalY + 31);
    }

    // --- FOOTER ---
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" });
      doc.text("This is a computer generated estimate.", 15, doc.internal.pageSize.getHeight() - 10);
    }

    doc.save(`Estimate_${form.projectTitle || "Project"}.pdf`);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox pt={6} pb={3} px={2}>
        <Grid container spacing={3}>
          {/* ================= HEADER STATS ================= */}
          <Grid item xs={12}>
            <Card sx={{ 
              background: "linear-gradient(135deg, #1A73E8 0%, #004BA0 100%)",
              borderRadius: "20px",
              p: 3,
              boxShadow: "0 10px 30px rgba(26, 115, 232, 0.3)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2
            }}>
              <Box>
                <MDTypography variant="h3" fontWeight="bold" color="white">
                  Estimate Builder
                </MDTypography>
                <MDTypography variant="button" color="white" opacity={0.8} sx={{ letterSpacing: 1 }}>
                  Create & Manage Professional Architectural Proposals
                </MDTypography>
              </Box>
              <Box display="flex" gap={2}>
                <MDButton variant="gradient" color="success" circular iconOnly onClick={addRow}>
                  <Tooltip title="Quick Add Item"><AddIcon /></Tooltip>
                </MDButton>
                <MDButton variant="contained" color="white" startIcon={<PictureAsPdfIcon />} onClick={generatePDF}>
                  Generate PDF
                </MDButton>
                <MDButton variant="contained" color="warning" startIcon={<SaveIcon />} onClick={saveEstimate}>
                  {editId ? "Update Proposal" : "Save Proposal"}
                </MDButton>
              </Box>
            </Card>
          </Grid>

          {/* ================= FORM CONTENT ================= */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ height: "100%", borderRadius: "20px", boxShadow: "0 8px 24px rgba(0,0,0,0.05)" }}>
              <MDBox p={3} borderBottom="1px solid #f0f2f5">
                <MDTypography variant="h5" fontWeight="bold">Project Scope</MDTypography>
              </MDBox>
              <MDBox p={3}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField label="Project Title" fullWidth variant="outlined"
                      value={form.projectTitle}
                      onChange={(e) => setForm({ ...form, projectTitle: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField label="Owner Name" fullWidth variant="outlined"
                      value={form.ownerName}
                      onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField label="Location" fullWidth variant="outlined"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField label="Plot Area (Sq.Ft)" fullWidth variant="outlined"
                      value={form.plotArea}
                      onChange={(e) => setForm({ ...form, plotArea: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <TextField
                      label="Brief Introduction"
                      fullWidth
                      multiline
                      rows={4}
                      placeholder="Introduction for the PDF proposal..."
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                  </Grid>
                </Grid>
              </MDBox>
            </Card>
          </Grid>

          <Grid item xs={12} lg={8}>
            <Card sx={{ borderRadius: "20px", boxShadow: "0 8px 24px rgba(0,0,0,0.05)" }}>
              <MDBox p={3} borderBottom="1px solid #f0f2f5" display="flex" justifyContent="space-between" alignItems="center">
                <MDTypography variant="h5" fontWeight="bold">Itemized Breakdown</MDTypography>
                <MDBox display="flex" alignItems="center" gap={1}>
                  <MDTypography variant="button" color="text">Total Amount:</MDTypography>
                  <MDTypography variant="h5" fontWeight="bold" sx={{ color: "#2e7d32" }}>
                    Rs. {total.toLocaleString("en-IN")}
                  </MDTypography>
                </MDBox>
              </MDBox>
              <MDBox p={2}>
                <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #f0f2f5", borderRadius: "12px", maxHeight: "450px" }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ bgcolor: "#f8f9fa", fontWeight: "bold", width: "60px" }}>#</TableCell>
                        <TableCell sx={{ bgcolor: "#f8f9fa", fontWeight: "bold" }}>Description</TableCell>
                        <TableCell sx={{ bgcolor: "#f8f9fa", fontWeight: "bold", textAlign: "center" }}>Qty</TableCell>
                        <TableCell sx={{ bgcolor: "#f8f9fa", fontWeight: "bold", textAlign: "center" }}>Unit</TableCell>
                        <TableCell sx={{ bgcolor: "#f8f9fa", fontWeight: "bold", textAlign: "right" }}>Rate</TableCell>
                        <TableCell sx={{ bgcolor: "#f8f9fa", fontWeight: "bold", textAlign: "right" }}>Total</TableCell>
                        <TableCell sx={{ bgcolor: "#f8f9fa" }}></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items.map((row, i) => (
                        <TableRow key={i} sx={{ "&:hover": { bgcolor: "#fdfdfd" } }}>
                          <TableCell sx={{ color: "#344767", fontWeight: "bold" }}>{row.sno}</TableCell>
                          <TableCell>
                            <TextField fullWidth size="small" variant="standard"
                              value={row.desc}
                              onChange={(e) => handleChange(i, "desc", e.target.value)}
                              placeholder="Describe item..."
                              InputProps={{ disableUnderline: true, sx: { fontSize: "14px" } }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField type="number" size="small" variant="standard" 
                              sx={{ width: "50px", textAlign: "center" }}
                              value={row.qty}
                              onChange={(e) => handleChange(i, "qty", e.target.value)}
                              InputProps={{ disableUnderline: true, sx: { fontSize: "14px", textAlign: "center" } }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField size="small" variant="standard" 
                              sx={{ width: "50px" }}
                              value={row.unit}
                              onChange={(e) => handleChange(i, "unit", e.target.value)}
                              placeholder="Unit"
                              InputProps={{ disableUnderline: true, sx: { fontSize: "14px" } }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField type="number" size="small" variant="standard" 
                              sx={{ width: "80px", textAlign: "right" }}
                              value={row.rate}
                              onChange={(e) => handleChange(i, "rate", e.target.value)}
                              InputProps={{ disableUnderline: true, sx: { fontSize: "14px", textAlign: "right" } }}
                            />
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold", textAlign: "right", color: "#43A047" }}>
                            {(row.qty * row.rate || 0).toLocaleString("en-IN")}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton color="error" onClick={() => deleteRow(i)} size="small" sx={{ opacity: 0.6, "&:hover": { opacity: 1 } }}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <MDBox mt={2} display="flex" justifyContent="center">
                  <Button variant="text" color="info" startIcon={<AddIcon />} onClick={addRow} sx={{ fontWeight: "bold" }}>
                    Add Another Line Item
                  </Button>
                </MDBox>
              </MDBox>
            </Card>

            <Card sx={{ mt: 3, borderRadius: "20px", boxShadow: "0 8px 24px rgba(0,0,0,0.05)" }}>
              <MDBox p={3}>
                <MDTypography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Terms & Conditions</MDTypography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Additional terms for this specific proposal..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  sx={{ bgcolor: "#fafafa", borderRadius: "12px" }}
                />
              </MDBox>
            </Card>
          </Grid>

          {/* ================= SAVED RECORDS ================= */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: "20px", overflow: "visible", mt: 4, boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}>
              <MDBox
                variant="gradient"
                bgcolor="info"
                borderRadius="lg"
                coloredShadow="info"
                mx={2}
                mt={-3}
                p={3}
                mb={1}
                textAlign="center"
              >
                <MDTypography variant="h5" fontWeight="bold" color="white">
                  Proposal History & Records
                </MDTypography>
              </MDBox>
              <MDBox pb={3}>
                <DataTable
                  table={{
                    columns: [
                      { Header: "Project Title", accessor: "projectTitle", width: "35%" },
                      { Header: "Owner", accessor: "ownerName", width: "20%" },
                      { Header: "Amount", accessor: "totalEstimate", width: "15%", Cell: ({ value }) => `Rs. ${value?.toLocaleString("en-IN")}` },
                      { Header: "Date", accessor: "createdAt", width: "15%", Cell: ({ value }) => new Date(value).toLocaleDateString() },
                      {
                        Header: "Actions",
                        accessor: "actions",
                        Cell: ({ row }) => (
                          <MDBox display="flex" gap={1}>
                            <IconButton color="info" onClick={() => handleEdit(row.original)} size="small" title="Edit">
                              <EditIcon />
                            </IconButton>
                            <IconButton color="success" onClick={() => handleWhatsApp(row.original)} size="small" title="Share">
                              <WhatsAppIcon />
                            </IconButton>
                            <IconButton color="error" onClick={() => deleteEstimate(row.original._id)} size="small" title="Delete">
                              <DeleteIcon />
                            </IconButton>
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