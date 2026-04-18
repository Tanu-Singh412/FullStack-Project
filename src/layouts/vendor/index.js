import { useNavigate } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import useVendorTableData from "./data/vendorTableData";

function VendorHome() {
  const navigate = useNavigate();

  const categories = [
    { name: "Material Vendors", path: "/material-vendor" },
    { name: "Labour Vendors", path: "/labour-vendor" },
    { name: "Contractors", path: "/contractor-vendor" },
    { name: "Consultants", path: "/consultant-vendor" },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />

      {/* ✅ HEADER */}
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
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
                {/* LEFT */}
                <MDTypography variant="h6" color="white" fontWeight="bold">
                  Vendor Management
                </MDTypography>

                {/* RIGHT */}
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
                    boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                    "&:hover": {
                      background: "#f1f5f9",
                    },
                  }}
                >
                  Add Vendor
                </Button>
              </MDBox>

              {/* ✅ CATEGORY CARDS */}
              <MDBox p={3}>
                <Grid container spacing={3}>
                  {categories.map((cat, i) => (
                    <Grid item xs={6} md={3} key={i}>
                      <Card
                        sx={{
                          p: 3,
                          cursor: "pointer",
                          textAlign: "center",
                          transition: "0.3s",
                          "&:hover": {
                            transform: "translateY(-5px)",
                            boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                          },
                        }}
                        onClick={() => navigate(cat.path)}
                      >
                        <MDTypography variant="h6">
                          {cat.name}
                        </MDTypography>
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
export default VendorHome;