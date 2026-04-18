import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function VendorDetail() {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);

  useEffect(() => {
    fetch(`/api/vendors/${id}`)
      .then((res) => res.json())
      .then((res) => setVendor(res.data));
  }, [id]);

  if (!vendor) return <p>Loading...</p>;

  return (
    <div>
      <h2>{vendor.vendorName}</h2>
      <p>{vendor.phone}</p>
      <p>{vendor.category}</p>
    </div>
  );
}
export default VendorDetail;