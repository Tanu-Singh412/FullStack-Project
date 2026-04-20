import React, { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  Container,
  Card,
  Grid,
  TextField,
  Button,
  Typography,
  IconButton,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "./invoice.css";
const downloadPDF = async (el) => {
  const canvas = await html2canvas(el, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const width = pdf.internal.pageSize.getWidth();
  const height = (canvas.height * width) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, width, height);
  pdf.save("invoice.pdf");
};

const Invoice = React.forwardRef(({ data, total }, ref) => (
  <div ref={ref} style={{ padding: 30, background: "#fff" }}>
    <h2>TAX INVOICE</h2>
    <p><b>{data.company}</b></p>
    <p>{data.clientName}</p>

    <table width="100%" border="1" cellPadding="8">
      <thead>
        <tr>
          <th>Item</th>
          <th>Qty</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {data.items.map((i, idx) => (
          <tr key={idx}>
            <td>{i.name}</td>
            <td>{i.qty}</td>
            <td>{i.price}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <h3>Total: ₹{total}</h3>
  </div>
));

export default function InvoicePage() {
  const pdfRef = useRef();

  const [data, setData] = useState({
    clientName: "",
    company: "",
    items: [{ name: "", qty: 1, price: 0 }],
  });

  const [saved, setSaved] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  /* ================= LOAD FROM LOCAL ================= */
  useEffect(() => {
    const stored = localStorage.getItem("invoices");
    if (stored) setSaved(JSON.parse(stored));
  }, []);

  /* ================= SAVE TO LOCAL ================= */
  useEffect(() => {
    localStorage.setItem("invoices", JSON.stringify(saved));
  }, [saved]);

  const subtotal = data.items.reduce((s, i) => s + i.qty * i.price, 0);

  const addItem = () => {
    setData({
      ...data,
      items: [...data.items, { name: "", qty: 1, price: 0 }],
    });
  };

  const updateItem = (i, field, value) => {
    const items = [...data.items];
    items[i][field] = value;
    setData({ ...data, items });
  };

  const saveInvoice = () => {
    const newInv = {
      ...data,
      total: subtotal,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };

    setSaved([...saved, newInv]);
  };

  const deleteInvoice = (id) => {
    setSaved(saved.filter((i) => i.id !== id));
  };

  const restoreInvoice = (inv) => {
    setData({
      clientName: inv.clientName,
      company: inv.company,
      items: inv.items,
    });
  };

  /* ================= FILTER ================= */
  const filtered = saved.filter((inv) => {
    const matchSearch =
      inv.clientName.toLowerCase().includes(search.toLowerCase()) ||
      inv.company.toLowerCase().includes(search.toLowerCase());

    if (!matchSearch) return false;

    const date = new Date(inv.createdAt);
    const now = new Date();

    if (filter === "month") {
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    }

    if (filter === "year") {
      return date.getFullYear() === now.getFullYear();
    }

    return true;
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Invoice Generator
      </Typography>

      {/* SEARCH + FILTER */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={8}>
          <TextField
            fullWidth
            placeholder="Search invoices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>

        <Grid item xs={4}>
          <TextField
            select
            fullWidth
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
            <MenuItem value="year">This Year</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      {/* FORM */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Client Name"
              value={data.clientName}
              onChange={(e) =>
                setData({ ...data, clientName: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Company"
              value={data.company}
              onChange={(e) =>
                setData({ ...data, company: e.target.value })
              }
            />
          </Grid>
        </Grid>

        <Typography variant="h6" sx={{ mt: 3 }}>
          Items
        </Typography>

        {data.items.map((item, i) => (
          <Grid container spacing={2} key={i} sx={{ mt: 1 }}>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Item"
                value={item.name}
                onChange={(e) =>
                  updateItem(i, "name", e.target.value)
                }
              />
            </Grid>

            <Grid item xs={3}>
              <TextField
                type="number"
                fullWidth
                label="Qty"
                value={item.qty}
                onChange={(e) =>
                  updateItem(i, "qty", +e.target.value)
                }
              />
            </Grid>

            <Grid item xs={3}>
              <TextField
                type="number"
                fullWidth
                label="Price"
                value={item.price}
                onChange={(e) =>
                  updateItem(i, "price", +e.target.value)
                }
              />
            </Grid>
          </Grid>
        ))}

        <Button sx={{ mt: 2 }} onClick={addItem}>
          Add Item
        </Button>

        <Typography variant="h6" sx={{ mt: 2 }}>
          Total: ₹{subtotal}
        </Typography>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item>
            <Button
              variant="contained"
              onClick={() => downloadPDF(pdfRef.current)}
            >
              Download
            </Button>
          </Grid>

          <Grid item>
            <Button variant="outlined" onClick={saveInvoice}>
              Save
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* SAVED */}
      <Typography variant="h5">Saved Invoices</Typography>

      {filtered.length === 0 ? (
        <Typography>No invoices found</Typography>
      ) : (
        filtered.map((inv) => (
          <Card
            key={inv.id}
            sx={{
              p: 2,
              mt: 1,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <Typography>{inv.clientName}</Typography>
              <Typography variant="body2">
                ₹{inv.total}
              </Typography>
              <Typography variant="caption">
                {new Date(inv.createdAt).toLocaleString()}
              </Typography>
            </div>

            <div>
              <IconButton onClick={() => restoreInvoice(inv)}>
                <VisibilityIcon />
              </IconButton>

              <IconButton onClick={() => deleteInvoice(inv.id)}>
                <DeleteIcon />
              </IconButton>
            </div>
          </Card>
        ))
      )}

      {/* HIDDEN PDF */}
      <div style={{ position: "absolute", left: -9999 }}>
        <Invoice ref={pdfRef} data={data} total={subtotal} />
      </div>
    </Container>
  );
}