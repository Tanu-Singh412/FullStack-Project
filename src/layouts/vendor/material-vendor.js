import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";

function VendorList() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    fetch(`/api/vendors?category=${category}`)
      .then((res) => res.json())
      .then((res) => setVendors(res.data));
  }, [category]);

  return (
    <div>
      <h2>{category}</h2>

      <Button onClick={() => navigate("/add-vendor")}>
        + Add Vendor
      </Button>

      {vendors.map((v) => (
        <div
          key={v._id}
          onClick={() => navigate(`/vendor/${v._id}`)}
        >
          {v.vendorName}
        </div>
      ))}
    </div>
  );
}

export default VendorList;