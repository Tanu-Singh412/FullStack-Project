import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Chip from "@mui/material/Chip";
function VendorList() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);

  const cleanCategory = categoryId?.trim().toLowerCase();

  useEffect(() => {
    if (!cleanCategory) return;

    fetch(`https://fullstack-project-1-n510.onrender.com/api/vendors?category=${cleanCategory}`)
      .then((res) => res.json())
      .then((res) => setVendors(res.data || []))
      .catch((err) => console.log(err));
  }, [cleanCategory]);

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <Box sx={{ pt: 6, pb: 3, px: 2 }}>
        {/* HEADER */}
        <Box
          sx={{
            mb: 4,
            p: 3,
            borderRadius: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "linear-gradient(135deg, #1976d2, #42a5f5)",
            color: "white",
            boxShadow: 4,
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {categoryId} Vendors
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {vendors.length} vendors
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={() => navigate(`/add-vendor/${categoryId}`)}
            sx={{
              background: "#fff",
              color: "#1976d2",
              fontWeight: "bold",
              borderRadius: 2,
              px: 3,
              "&:hover": { background: "#e3f2fd" },
            }}
          >
            + Add Vendor
          </Button>
        </Box>

        {/* GRID */}
        <Grid container spacing={3}>
          {vendors.length === 0 ? (
            <Box sx={{ width: "100%", textAlign: "center", mt: 6 }}>
              <Typography variant="h6" color="text.secondary">
                No vendors found
              </Typography>
            </Box>
          ) : (
            vendors.map((v) => (
              <Grid item xs={12} sm={6} md={4} key={v._id}>
                <Card
                  onClick={() => navigate(`/vendor/${v._id}`)}
                  sx={{
                    cursor: "pointer",
                    borderRadius: 4,
                    transition: "all 0.3s ease",
                    boxShadow: 2,
                    overflow: "hidden",
                    position: "relative",
                    "&:hover": {
                      transform: "translateY(-8px) scale(1.02)",
                      boxShadow: 8,
                    },
                  }}
                >
                  {/* Top Accent */}
                  <Box sx={{ height: 5, background: "#1976d2" }} />

                  <CardContent>
                    {/* HEADER */}
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar
                        sx={{
                          mr: 2,
                          bgcolor: "#1976d2",
                          width: 48,
                          height: 48,
                          fontSize: 20,
                        }}
                      >
                        {v.vendorName?.charAt(0).toUpperCase()}
                      </Avatar>

                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {v.vendorName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {v._id?.slice(-5)}
                        </Typography>
                      </Box>
                    </Box>

                    {/* DETAILS */}
                    <Typography variant="body2" color="text.secondary">
                      📞 {v.phone}
                    </Typography>

                    {/* FOOTER */}
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mt={2}
                    >
                      <Chip
                        label={v.company}
                        size="small"
                        sx={{ borderRadius: 2 }}
                      />

                      <Button size="small">View →</Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>

      <Footer />
    </DashboardLayout>
  );
}
export default VendorList;