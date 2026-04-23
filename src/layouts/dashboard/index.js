import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import RecentClients from "./components/RecentClients/index.js";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import { useEffect, useState } from "react";

function Dashboard() {
  const [totalClients, setTotalClients] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [totalVendors, setTotalVendors] = useState(0);

  useEffect(() => {
    // Clients
    fetch("https://fullstack-project-1-n510.onrender.com/api/clients")
      .then(res => res.json())
      .then(data => setTotalClients(data.length))
      .catch(err => console.log(err));

    // Projects
    fetch("https://fullstack-project-1-n510.onrender.com/api/projects")
      .then(res => res.json())
      .then(data => setTotalProjects(data.length))
      .catch(err => console.log(err));

    // Invoices
    fetch("https://fullstack-project-1-n510.onrender.com/api/invoices")
      .then(res => res.json())
      .then(data => setTotalInvoices(data.length || data.data?.length || 0))
      .catch(err => console.log(err));

    // Vendors
    fetch("https://fullstack-project-1-n510.onrender.com/api/vendors")
      .then(res => res.json())
      .then(data => setTotalVendors(data.length || data.data?.length || 0))
      .catch(err => console.log(err));
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="info"
                icon="person_add"
                title="Clients"
                count={totalClients}
                percentage={{
                  color: "success",
                  amount: "Registered",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                title="Projects"
                count={totalProjects}
                percentage={{
                  color: "success",
                  amount: "Active",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="receipt_long"
                title="Invoices"
                count={totalInvoices}
                percentage={{
                  color: "success",
                  amount: "Financials",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="business"
                title="Vendors"
                count={totalVendors}
                percentage={{
                  color: "success",
                  amount: "Verified",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>

        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <RecentClients />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview />
            </Grid>
          </Grid>
        </MDBox>

        {/* BOTTOM CONTAINER */}
        <MDBox mt={4.5} p={3} borderRadius="lg" sx={{ bgcolor: "#fff", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
            <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <MDBox>
                    <ComplexStatisticsCard 
                        color="success" 
                        icon="trending_up" 
                        title="Growth Overview" 
                        count="Active System" 
                        percentage={{ color: "success", amount: "Operational" }} 
                    />
                </MDBox>
                <MDBox sx={{ flex: 1, ml: 4 }}>
                    <MDBox variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info" p={2}>
                        <MDBox color="white" fontWeight="bold">Architectural Management System v2.0</MDBox>
                        <MDBox color="white" variant="caption">System is running at peak performance. All modules are synchronized with the cloud backend.</MDBox>
                    </MDBox>
                </MDBox>
            </MDBox>
        </MDBox>

      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
