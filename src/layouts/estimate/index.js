import React, { useState } from "react";
import {
  Box,
  Grid,
  Card,
  TextField,
  Button,
  IconButton,
  Divider,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import jsPDF from "jspdf";
import "jspdf-autotable";

const SIDEBAR_WIDTH = 260;

export default function EstimatePage() {
  const [items, setItems] = useState([
    { sno: 1, desc: "", qty: "", unit: "", rate: "" },
  ]);

  // ================= HANDLE CHANGE =================
  const handleChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  // ================= ADD ROW =================
  const addRow = () => {
    setItems([
      ...items,
      {
        sno: items.length + 1,
        desc: "",
        qty: "",
        unit: "",
        rate: "",
      },
    ]);
  };

  // ================= DELETE =================
  const deleteRow = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  // ================= TOTAL =================
  const total = items.reduce(
    (sum, i) => sum + Number(i.qty || 0) * Number(i.rate || 0),
    0
  );

  // ================= PDF =================
  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text("D DESIGN ARCHITECTS STUDIO", 105, 10, { align: "center" });

    const tableData = items.map((row) => [
      row.sno,
      row.desc,
      row.qty,
      row.unit,
      row.rate,
      row.qty * row.rate,
    ]);

    doc.autoTable({
      head: [["S.No", "Description", "Qty", "Unit", "Rate", "Amount"]],
      body: tableData,
      startY: 20,
    });

    doc.text(`Total: ₹ ${total}`, 140, doc.lastAutoTable.finalY + 10);
    doc.save("estimate.pdf");
  };

  return (
    <Box sx={{ display: "flex" }}>
      
      {/* ================= SIDEBAR SPACE ================= */}
      <Box sx={{ width: SIDEBAR_WIDTH }} />

      {/* ================= MAIN ================= */}
      <Box sx={{ flex: 1, background: "#f1f5f9" }}>
        
        {/* ================= HEADER ================= */}
        <Box
          sx={{
            position: "sticky",
            top: 0,
            background: "#fff",
            px: 4,
            py: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            zIndex: 10,
          }}
        >
          <Grid container alignItems="center">
            <Grid item xs={3}>
              <img src="/logo.png" style={{ height: 50 }} />
            </Grid>

            <Grid item xs={6} textAlign="center">
              <Typography fontWeight="bold">
                D DESIGN ARCHITECTS STUDIO
              </Typography>
              <Typography variant="caption">
                Architects, Interior Designers, Planners
              </Typography>
            </Grid>

            <Grid item xs={3} textAlign="right">
              <Typography fontWeight="bold">
                AR. PREMVEER SINGH
              </Typography>
              <Typography variant="caption">
                CA/18/98236
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* ================= CONTENT ================= */}
        <Box sx={{ p: 4 }}>
          
          {/* TITLE */}
          <Card sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Typography fontWeight="bold">
              Boundary Wall Construction Estimate
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography>Total Area: 1425 SQFT</Typography>
          </Card>

          {/* ================= TABLE ================= */}
          <Card sx={{ p: 3, borderRadius: 3 }}>
            <Typography fontWeight="bold" mb={2}>
              Estimate Table
            </Typography>

            {/* HEADER */}
            <Grid container spacing={2} mb={1}>
              <Grid item xs={1}><b>S.No</b></Grid>
              <Grid item xs={3}><b>Description</b></Grid>
              <Grid item xs={1}><b>Qty</b></Grid>
              <Grid item xs={1}><b>Unit</b></Grid>
              <Grid item xs={2}><b>Rate</b></Grid>
              <Grid item xs={2}><b>Amount</b></Grid>
              <Grid item xs={2}><b>Action</b></Grid>
            </Grid>

            {/* ROWS */}
            {items.map((row, i) => (
              <Grid container spacing={2} key={i} mb={1}>
                
                <Grid item xs={1}>
                  <TextField value={row.sno} disabled size="small" />
                </Grid>

                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    size="small"
                    value={row.desc}
                    onChange={(e) =>
                      handleChange(i, "desc", e.target.value)
                    }
                  />
                </Grid>

                <Grid item xs={1}>
                  <TextField
                    size="small"
                    type="number"
                    value={row.qty}
                    onChange={(e) =>
                      handleChange(i, "qty", e.target.value)
                    }
                  />
                </Grid>

                <Grid item xs={1}>
                  <TextField
                    size="small"
                    value={row.unit}
                    onChange={(e) =>
                      handleChange(i, "unit", e.target.value)
                    }
                  />
                </Grid>

                <Grid item xs={2}>
                  <TextField
                    size="small"
                    type="number"
                    value={row.rate}
                    onChange={(e) =>
                      handleChange(i, "rate", e.target.value)
                    }
                  />
                </Grid>

                <Grid item xs={2}>
                  <TextField
                    size="small"
                    value={row.qty * row.rate || ""}
                    disabled
                  />
                </Grid>

                <Grid item xs={2}>
                  <IconButton onClick={() => deleteRow(i)}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}

            {/* ADD ROW BUTTON */}
            <Button
              startIcon={<AddIcon />}
              onClick={addRow}
              sx={{ mt: 2 }}
            >
              Add Row
            </Button>

            {/* TOTAL */}
            <Box textAlign="right" mt={3}>
              <Typography fontWeight="bold">
                Total: ₹ {total}
              </Typography>
            </Box>
          </Card>

          {/* ACTION */}
          <Box mt={3}>
            <Button
              variant="contained"
              color="success"
              onClick={generatePDF}
            >
              Generate PDF
            </Button>
          </Box>

        </Box>
      </Box>
    </Box>
  );
}

