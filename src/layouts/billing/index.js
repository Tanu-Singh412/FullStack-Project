import React, { useMemo, useState } from "react";
import {
  Card,
  Button,
  TextField,
  Grid,
  Tabs,
  Tab,
  Chip,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

/* ================= MAIN INVOICE UI ================= */
export default function InvoicePro({ invoices = [] }) {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  /* ================= FILTER LOGIC ================= */
  const filtered = useMemo(() => {
    return invoices
      .filter((inv) => {
        const matchSearch =
          inv?.clientName?.toLowerCase().includes(search.toLowerCase()) ||
          inv?.invoiceNo?.toLowerCase().includes(search.toLowerCase());

        if (!matchSearch) return false;

        const date = new Date(inv.createdAt);
        const now = new Date();

        if (filter === "month")
          return (
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear()
          );

        if (filter === "year")
          return date.getFullYear() === now.getFullYear();

        return true;
      })
      .reverse();
  }, [invoices, search, filter]);

  return (
    <div style={{ padding: 20, background: "#f6f7fb", minHeight: "100vh" }}>
      {/* ================= HEADER ================= */}
      <Card sx={{ p: 2, borderRadius: "12px", mb: 2 }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12} md={4}>
            <h2 style={{ margin: 0 }}>Tax Invoice System</h2>
            <p style={{ margin: 0, fontSize: 13, color: "gray" }}>
              Manage invoices professionally
            </p>
          </Grid>

          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by client / invoice no"
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
          </Grid>

          <Grid item xs={12} md={3}>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { key: "all", label: "All" },
                { key: "month", label: "Monthly" },
                { key: "year", label: "Yearly" },
              ].map((f) => (
                <Chip
                  key={f.key}
                  label={f.label}
                  onClick={() => setFilter(f.key)}
                  color={filter === f.key ? "primary" : "default"}
                />
              ))}
            </div>
          </Grid>
        </Grid>
      </Card>

      {/* ================= SUMMARY CARDS ================= */}
      <Grid container spacing={2} mb={2}>
        {[
          { label: "Total Invoices", value: invoices.length, color: "#1976d2" },
          { label: "Filtered", value: filtered.length, color: "#2e7d32" },
          {
            label: "Revenue",
            value: invoices.reduce((s, i) => s + Number(i?.totals?.total || 0), 0),
            color: "#f57c00",
          },
        ].map((s, i) => (
          <Grid item xs={12} md={4} key={i}>
            <Card sx={{ p: 2, borderRadius: "12px" }}>
              <h4 style={{ margin: 0, color: s.color }}>{s.label}</h4>
              <h2 style={{ margin: 0 }}>{s.value}</h2>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ================= INVOICE LIST ================= */}
      <Card sx={{ p: 2, borderRadius: "12px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f1f5f9" }}>
              <th style={th}>Invoice</th>
              <th style={th}>Client</th>
              <th style={th}>Date</th>
              <th style={th}>Amount</th>
              <th style={th}>Status</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((inv) => (
              <tr key={inv.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={td}>{inv.invoiceNo}</td>
                <td style={td}>{inv.clientName}</td>
                <td style={td}>
                  {new Date(inv.createdAt).toLocaleDateString()}
                </td>
                <td style={td}>₹ {inv?.totals?.total}</td>
                <td style={td}>
                  <Chip
                    label="Paid"
                    size="small"
                    color="success"
                  />
                </td>
                <td style={td}>
                  <Button size="small">View</Button>
                  <Button size="small" color="error">
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

const th = {
  textAlign: "left",
  padding: 12,
  fontSize: 13,
  color: "#555",
};

const td = {
  padding: 12,
  fontSize: 13,
};
