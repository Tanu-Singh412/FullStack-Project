import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// MUI
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

// Dashboard
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function MaterialVendor() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://fullstack-project-1-n510.onrender.com/api/vendors/material")
      .then((res) => res.json())
      .then((res) => setData(res.data || []))
      .catch((err) => console.error(err));
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>

              {/* 🔵 HEADER */}
              <MDBox
                mx={2}
                mt={-3}
                py={2.5}
                px={3}
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h6" color="white" fontWeight="bold">
                  Material Vendors
                </MDTypography>

                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate("/add-vendor")}
                  sx={{
                    borderRadius: "10px",
                    textTransform: "none",
                    fontWeight: "600",
                    px: 2.5,
                    py: 1,
                    background: "#fff",
                    color: "#1976d2",
                    "&:hover": {
                      background: "#f1f5f9",
                    },
                  }}
                >
                  Add Vendor
                </Button>
              </MDBox>

              {/* 📦 BODY */}
              <MDBox p={3}>
                <Grid container spacing={3}>
                  {data.length === 0 && (
                    <MDTypography>No vendors found</MDTypography>
                  )}

                  {data.map((group, index) => (
                    <Grid item xs={12} md={4} key={index}>
                      <Card
                        sx={{
                          p: 2,
                          borderRadius: "12px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        }}
                      >
                        {/* CATEGORY TITLE */}
                        <MDTypography
                          variant="h6"
                          mb={2}
                          sx={{ color: "#1976d2", fontWeight: "600" }}
                        >
                          {group._id || "Uncategorized"}
                        </MDTypography>

                        {/* VENDOR LIST */}
                        {group.vendors?.length === 0 && (
                          <MDTypography fontSize="13px">
                            No vendors
                          </MDTypography>
                        )}

                        {group.vendors?.map((v) => (
                          <MDBox
                            key={v._id}
                            onClick={() => navigate(`/vendor/${v._id}`)}
                            sx={{
                              p: 1.5,
                              mb: 1,
                              borderRadius: "8px",
                              border: "1px solid #eee",
                              cursor: "pointer",
                              transition: "0.2s",
                              "&:hover": {
                                background: "#f5faff",
                                borderColor: "#1976d2",
                              },
                            }}
                          >
                            <MDTypography fontSize="14px" fontWeight="500">
                              {v.vendorName}
                            </MDTypography>
                          </MDBox>
                        ))}
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </MDBox>

            </Card>
          </Grid>
        </Grid>
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}

export default MaterialVendor;