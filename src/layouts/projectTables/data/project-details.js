import { useLocation } from "react-router-dom";
import { useState } from "react";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import {
  Tabs,
  Tab,
  Grid,
  Button,
  Card,
  TextField,
} from "@mui/material";

function ProjectDetails() {
  const { state } = useLocation();

  const [tab, setTab] = useState(0);
  const [drawingType, setDrawingType] = useState(null);

  const [openUpload, setOpenUpload] = useState(false);
  const [uploadType, setUploadType] = useState(null);
  const [files, setFiles] = useState([]);

  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: "",
    date: "",
    note: "",
  });

  if (!state) return <div>No Data</div>;

  const total = Number(state.totalAmount || 0);
  const paid = (state.payments || []).reduce(
    (s, p) => s + Number(p.amount),
    0
  );
  const balance = total - paid;

  // ================= UPLOAD =================
  const handleUpload = async () => {
    if (!files.length) return alert("Select files");

    const formData = new FormData();
    [...files].forEach((f) => formData.append("images", f));
    formData.append("drawingType", uploadType);

    const res = await fetch(
      `/api/projects/${state._id}/drawing`,
      { method: "POST", body: formData }
    );

    const data = await res.json();
    console.log(data);

    setOpenUpload(false);
    setFiles([]);
    window.location.reload();
  };

  // ================= PAYMENT =================
  const handleAddPayment = async () => {
    if (!paymentData.amount) return alert("Enter amount");

    const res = await fetch(
      `/api/projects/${state._id}/payment`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      }
    );

    const data = await res.json();
    console.log(data);

    setShowPaymentForm(false);
    setPaymentData({ amount: "", date: "", note: "" });
    window.location.reload();
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox pt={6} pb={3}>
        {/* HEADER */}
        <Card sx={{ p: 3, mb: 3 }}>
          <MDTypography variant="h4" fontWeight="bold">
            {state.projectName}
          </MDTypography>

          <MDTypography mt={1}>
            Client: <b>{state.clientName}</b>
          </MDTypography>
        </Card>

        {/* TABS */}
        <Tabs value={tab} onChange={(e, v) => setTab(v)}>
          <Tab label="Overview" />
          <Tab label="Drawings" />
          <Tab label="Accounts" />
        </Tabs>

        {/* ================= OVERVIEW ================= */}
        {tab === 0 && (
          <Card sx={{ p: 3, mt: 2 }}>
            <MDTypography variant="h6">Description</MDTypography>
            <MDTypography mt={1}>
              {state.description || "No description"}
            </MDTypography>
          </Card>
        )}

        {/* ================= DRAWINGS ================= */}
        {tab === 1 && (
          <MDBox mt={3}>
            {!drawingType ? (
              <Grid container spacing={3}>
                {["civil", "interior"].map((type) => (
                  <Grid item xs={12} md={6} key={type}>
                    <Card
                      sx={{
                        p: 4,
                        cursor: "pointer",
                        position: "relative",
                        transition: "0.3s",
                        "&:hover": { transform: "scale(1.02)" },
                      }}
                    >
                      <MDTypography variant="h5">
                        {type === "civil"
                          ? "Civil Drawings"
                          : "Interior Drawings"}
                      </MDTypography>

                      <Button
                        variant="contained"
                        sx={{ position: "absolute", top: 20, right: 20 }}
                        onClick={() => {
                          setUploadType(type);
                          setOpenUpload(true);
                        }}
                      >
                        Upload
                      </Button>

                      <MDBox mt={2} onClick={() => setDrawingType(type)}>
                        View Images →
                      </MDBox>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <>
                <Button onClick={() => setDrawingType(null)}>
                  ⬅ Back
                </Button>

                <Grid container spacing={3} mt={1}>
                  {(drawingType === "civil"
                    ? state.civilImages
                    : state.interiorImages
                  )?.map((img, i) => (
                    <Grid item xs={12} sm={6} md={3} key={i}>
                      <Card sx={{ overflow: "hidden" }}>
                        <img
                          src={img}
                          style={{
                            width: "100%",
                            height: 220,
                            objectFit: "cover",
                          }}
                        />
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </MDBox>
        )}

        {/* ================= ACCOUNTS ================= */}
        {tab === 2 && (
          <MDBox mt={3}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 3 }}>Total: ₹ {total}</Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 3 }}>Paid: ₹ {paid}</Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 3 }}>Balance: ₹ {balance}</Card>
              </Grid>
            </Grid>

            {/* ADD PAYMENT */}
            <MDBox mt={3} textAlign="right">
              <Button
                variant="contained"
                onClick={() =>
                  setShowPaymentForm(!showPaymentForm)
                }
              >
                + Add Payment
              </Button>
            </MDBox>

            {/* FORM */}
            {showPaymentForm && (
              <Card sx={{ p: 3, mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Amount"
                      name="amount"
                      value={paymentData.amount}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          amount: e.target.value,
                        })
                      }
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      type="date"
                      name="date"
                      value={paymentData.date}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          date: e.target.value,
                        })
                      }
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Note"
                      name="note"
                      value={paymentData.note}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          note: e.target.value,
                        })
                      }
                    />
                  </Grid>
                </Grid>

                <MDBox mt={2} textAlign="right">
                  <Button onClick={handleAddPayment} variant="contained">
                    Save Payment
                  </Button>
                </MDBox>
              </Card>
            )}

            {/* HISTORY */}
            <Card sx={{ mt: 3 }}>
              <MDBox p={2}>
                <MDTypography variant="h6">
                  Payment History
                </MDTypography>
              </MDBox>

              {(state.payments || []).map((p, i) => (
                <MDBox
                  key={i}
                  px={3}
                  py={2}
                  display="flex"
                  justifyContent="space-between"
                  borderTop="1px solid #eee"
                >
                  <span>{p.date}</span>
                  <span>₹ {p.amount}</span>
                  <span>{p.note}</span>
                </MDBox>
              ))}
            </Card>
          </MDBox>
        )}
      </MDBox>

      {/* UPLOAD MODAL */}
      {openUpload && (
        <MDBox
          sx={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Card sx={{ p: 3 }}>
            <MDTypography mb={2}>
              Upload {uploadType} Images
            </MDTypography>

            <input
              type="file"
              multiple
              onChange={(e) => setFiles(e.target.files)}
            />

            <MDBox mt={2} display="flex" justifyContent="space-between">
              <Button onClick={() => setOpenUpload(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpload} variant="contained">
                Upload
              </Button>
            </MDBox>
          </Card>
        </MDBox>
      )}

      <Footer />
    </DashboardLayout>
  );
}

export default ProjectDetails;