import React, { useRef, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Card,
} from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/* ================= PDF FUNCTION ================= */
const downloadPDF = async (el) => {
  const canvas = await html2canvas(el, {
    scale: 3,
    useCORS: true,
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = 210;
  const pageHeight = 297;

  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save("Estimate.pdf");
};

/* ================= MAIN COMPONENT ================= */
export default function EstimatePage() {
  const pdfRef = useRef();

  const [data, setData] = useState({
    projectTitle:
      "Detailed Estimate for the Construction work of Boundary wall of Farm House Situated at Plot no. 44, Triveni Royal Farms, Mauza Artoni, Agra.",
    ownerName: "Mr. Pooran Chand Dawar",
    plotArea: "1425.55",
    estimatedAmount: "3151000.00",
    items: [{ name: "", qty: 1, price: 0 }],
  });

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const updateItem = (i, field, value) => {
    const items = [...data.items];
    items[i][field] = value;
    setData({ ...data, items });
  };

  const addItem = () => {
    setData({
      ...data,
      items: [...data.items, { name: "", qty: 1, price: 0 }],
    });
  };

  const total = data.items.reduce(
    (sum, i) => sum + i.qty * i.price,
    0
  );

  return (
    <Box p={3}>
      <Card sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Estimate Generator
        </Typography>

        {/* PROJECT DETAILS */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Project Title"
              value={data.projectTitle}
              onChange={(e) =>
                handleChange("projectTitle", e.target.value)
              }
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Owner Name"
              value={data.ownerName}
              onChange={(e) =>
                handleChange("ownerName", e.target.value)
              }
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Plot Area"
              value={data.plotArea}
              onChange={(e) =>
                handleChange("plotArea", e.target.value)
              }
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Estimated Amount"
              value={data.estimatedAmount}
              onChange={(e) =>
                handleChange("estimatedAmount", e.target.value)
              }
            />
          </Grid>
        </Grid>

        {/* ITEMS */}
        <Typography mt={4} mb={2} fontWeight="bold">
          Items
        </Typography>

        {data.items.map((item, i) => (
          <Grid container spacing={2} key={i} mb={1}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Description"
                value={item.name}
                onChange={(e) =>
                  updateItem(i, "name", e.target.value)
                }
              />
            </Grid>

            <Grid item xs={3}>
              <TextField
                fullWidth
                type="number"
                label="Qty"
                value={item.qty}
                onChange={(e) =>
                  updateItem(i, "qty", Number(e.target.value))
                }
              />
            </Grid>

            <Grid item xs={3}>
              <TextField
                fullWidth
                type="number"
                label="Rate"
                value={item.price}
                onChange={(e) =>
                  updateItem(i, "price", Number(e.target.value))
                }
              />
            </Grid>
          </Grid>
        ))}

        <Button onClick={addItem}>Add Item</Button>

        <Typography mt={2} fontWeight="bold">
          Total: ₹ {total}
        </Typography>

        <Button
          variant="contained"
          sx={{ mt: 3 }}
          onClick={() => downloadPDF(pdfRef.current)}
        >
          Generate PDF
        </Button>
      </Card>

      {/* ================= PDF TEMPLATE ================= */}
      <div style={{ position: "absolute", left: "-9999px" }}>
        <div ref={pdfRef} style={styles.page}>
          {/* HEADER */}
          <h2 style={{ textAlign: "center" }}>
            DETAILED ESTIMATE
          </h2>

          {/* TITLE */}
          <p style={{ textAlign: "center" }}>
            {data.projectTitle}
          </p>

          {/* INFO TABLE */}
          <table style={styles.infoTable}>
            <tbody>
              <tr>
                <td><b>Owner Name</b></td>
                <td>{data.ownerName}</td>
                <td><b>Plot Area</b></td>
                <td>{data.plotArea}</td>
              </tr>
              <tr>
                <td><b>Estimated Amount</b></td>
                <td>₹ {data.estimatedAmount}</td>
                <td><b>Date</b></td>
                <td>{new Date().toLocaleDateString()}</td>
              </tr>
            </tbody>
          </table>

          {/* MAIN TABLE */}
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>S.No</th>
                <th style={styles.th}>Description</th>
                <th style={styles.th}>Qty</th>
                <th style={styles.th}>Rate</th>
                <th style={styles.th}>Amount</th>
              </tr>
            </thead>

            <tbody>
              {data.items.map((item, i) => (
                <tr key={i}>
                  <td style={styles.td}>{i + 1}</td>
                  <td style={styles.td}>{item.name}</td>
                  <td style={styles.td}>{item.qty}</td>
                  <td style={styles.td}>₹ {item.price}</td>
                  <td style={styles.td}>
                    ₹ {item.qty * item.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* TOTAL */}
          <h3 style={{ textAlign: "right" }}>
            Total: ₹ {total}
          </h3>
        </div>
      </div>
    </Box>
  );
}

/* ================= STYLES ================= */
const styles = {
  page: {
    width: "210mm",
    padding: "30px",
    background: "#fff",
    fontFamily: "Arial",
  },
  infoTable: {
    width: "100%",
    marginBottom: "20px",
    borderCollapse: "collapse",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    border: "1px solid #000",
    padding: "8px",
    background: "#eee",
  },
  td: {
    border: "1px solid #000",
    padding: "8px",
  },
};