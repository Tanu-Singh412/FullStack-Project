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
          <Typography variant="h5" fontWeight="bold">
            {categoryId} Vendors
          </Typography>

          <Button
            variant="contained"
            onClick={() => navigate(`/add-vendor/${categoryId}`)}
            sx={{
              background: "#fff",
              color: "#1976d2",
              fontWeight: "bold",
              borderRadius: 2,
              px: 3,
              '&:hover': { background: '#e3f2fd' },
            }}
          >
            + Add Vendor
          </Button>
        </Box>

        {/* VENDOR GRID */}
        <Grid container spacing={3}>
          {vendors.length === 0 ? (
            <Typography sx={{ ml: 2 }}>No vendors found</Typography>
          ) : (
            vendors.map((v) => (
              <Grid item xs={12} sm={6} md={4} key={v._id}>
                <Card
                  onClick={() => navigate(`/vendor/${v._id}`)}
                  sx={{
                    cursor: "pointer",
                    borderRadius: 3,
                    transition: "0.3s",
                    boxShadow: 3,
                    '&:hover': {
                      transform: "translateY(-6px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar sx={{ mr: 2, bgcolor: '#1976d2' }}>
                        {v.vendorName?.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="h6" fontWeight="bold">
                        {v.vendorName}
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                      📞 {v.phone}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      🏢 {v.company}
                    </Typography>
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