import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function VendorDetail() {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);

  useEffect(() => {
    fetch(`https://fullstack-project-1-n510.onrender.com/api/vendors`)
      .then((res) => res.json())
      .then((res) => {
        const found = res.data.find((v) => v._id === id);
        setVendor(found);
      });
  }, [id]);

  if (!vendor) return null;

  return (
    <MDBox p={3}>
      <MDTypography variant="h4">{vendor.vendorName}</MDTypography>

      <p>Phone: {vendor.phone}</p>
      <p>Email: {vendor.email}</p>
      <p>Company: {vendor.company}</p>
      <p>GST: {vendor.gst}</p>

      <h3>Materials</h3>
      {vendor.materials.map((m, i) => (
        <p key={i}>
          {m.materialName} - ₹{m.rate}
        </p>
      ))}
    </MDBox>
  );
}

export default VendorDetail;