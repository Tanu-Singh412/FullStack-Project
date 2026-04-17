import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

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
  CircularProgress,
} from "@mui/material";

const Base_API = "https://fullstack-project-1-n510.onrender.com/api";

function ProjectDetails() {
  const { state } = useLocation();

  const [project, setProject] = useState(null);
  const [tab, setTab] = useState(0);

  const [drawingType, setDrawingType] = useState(null);
  const [files, setFiles] = useState([]);
  const [uploadType, setUploadType] = useState(null);
  const [openUpload, setOpenUpload] = useState(false);

  const [loading, setLoading] = useState(false);

  const [paymentData, setPaymentData] = useState({
    amount: "",
    date: "",
    note: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);

  // ================= FETCH =================
  const fetchProject = async () => {
    try {
      const res = await fetch(`${Base_API}/projects/${state._id}`);
      const data = await res.json();

      setProject({
        ...data,
        totalAmount: parseFloat(data.totalAmount) || 0,
        payments: data.payments || [],
        civilImages: data.civilImages || [],
        interiorImages: data.interiorImages || [],
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProject();
  }, []);

  if (!project) return <div>Loading...</div>;

  // ================= UPLOAD =================
  const handleUpload = async () => {
    if (!files.length) return;

    setLoading(true);

    const formData = new FormData();
    [...files].forEach((f) => formData.append("images", f));
    formData.append("drawingType", uploadType);

    await fetch(`${Base_API}/projects/${project._id}/drawing`, {
      method: "POST",
      body: formData,
    });

    await fetchProject();
    setFiles([]);
    setOpenUpload(false);
    setLoading(false);
  };

  // ================= PAYMENT =================
  const handleAddPayment = async () => {
    if (!paymentData.amount) return;

    setLoading(true);

    await fetch(`${Base_API}/projects/${project._id}/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: parseFloat(paymentData.amount),
        date: paymentData.date,
        note: paymentData.note,
      }),
    });

    await fetchProject();

    setPaymentData({ amount: "", date: "", note: "" });
    setLoading(false);
  };

  // ================= IMAGES =================
  const images =
    drawingType === "civil"
      ? project.civilImages
      : project.interiorImages;

  const next = () => {
    if (!images.length) return;
    const i = (imageIndex + 1) % images.length;
    setImageIndex(i);
    setSelectedImage(images[i]);
  };

  const prev = () => {
    if (!images.length) return;
    const i = (imageIndex - 1 + images.length) % images.length;
    setImageIndex(i);
    setSelectedImage(images[i]);
  };

  // ================= CALC =================
  const total = parseFloat(project.totalAmount) || 0;

  const paid = (project.payments || []).reduce(
    (sum, p) => sum + parseFloat(p.amount || 0),
    0
  );

  const balance = total - paid;

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox p={3}>
        {/* HEADER */}
        <Card sx={{ p: 3, mb: 3 }}>
          <MDTypography variant="h4">
            {project.projectName}
          </MDTypography>
          <MDTypography>
            Client: {project.clientName}
          </MDTypography>
        </Card>

        <Tabs value={tab} onChange={(e, v) => setTab(v)}>
          <Tab label="Overview" />
          <Tab label="Drawings" />
          <Tab label="Accounts" />
        </Tabs>

        {/* OVERVIEW */}
        {tab === 0 && (
          <Card sx={{ p: 3, mt: 2 }}>
            {project.description}
          </Card>
        )}

        {/* DRAWINGS */}
        {tab === 1 && (
          <MDBox mt={3}>
            {!drawingType ? (
              <Grid container spacing={2}>
                {["civil", "interior"].map((type) => (
                  <Grid item xs={6} key={type}>
                    <Card sx={{ p: 2 }}>
                      <Button
                        onClick={() => {
                          setUploadType(type);
                          setOpenUpload(true);
                        }}
                      >
                        Upload
                      </Button>

                      <MDBox
                        onClick={() => setDrawingType(type)}
                      >
                        View {type}
                      </MDBox>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <>
                <Button onClick={() => setDrawingType(null)}>
                  Back
                </Button>

                <Grid container spacing={2}>
                  {images.map((img, i) => (
                    <Grid item xs={3} key={i}>
                      <img
                        src={img}
                        style={{ width: "100%", height: 150 }}
                        onClick={() => {
                          setSelectedImage(img);
                          setImageIndex(i);
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </MDBox>
        )}

        {/* ACCOUNTS */}
        {tab === 2 && (
          <MDBox mt={3}>
            <MDBox display="flex" gap={2}>
              <Card sx={{ p: 2 }}>Total: ₹ {total}</Card>
              <Card sx={{ p: 2 }}>Paid: ₹ {paid}</Card>
              <Card sx={{ p: 2 }}>Balance: ₹ {balance}</Card>
            </MDBox>

            {/* ADD PAYMENT */}
            <MDBox mt={3} display="flex" gap={1}>
              <input
                type="number"
                placeholder="Amount"
                value={paymentData.amount}
                onChange={(e) =>
                  setPaymentData({
                    ...paymentData,
                    amount: e.target.value,
                  })
                }
              />

              <input
                type="date"
                value={paymentData.date}
                onChange={(e) =>
                  setPaymentData({
                    ...paymentData,
                    date: e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Note"
                value={paymentData.note}
                onChange={(e) =>
                  setPaymentData({
                    ...paymentData,
                    note: e.target.value,
                  })
                }
              />

              <Button onClick={handleAddPayment}>
                {loading ? <CircularProgress size={20} /> : "Add"}
              </Button>
            </MDBox>

            {/* TABLE */}
            <table style={{ width: "100%", marginTop: 20 }}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Note</th>
                </tr>
              </thead>

              <tbody>
                {project.payments.map((p, i) => (
                  <tr key={i}>
                    <td>
                      {new Date(p.date).toLocaleDateString()}
                    </td>
                    <td>₹ {p.amount}</td>
                    <td>{p.note || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </MDBox>
        )}
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}

export default ProjectDetails;