import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Base_API = "https://fullstack-project-1-n510.onrender.com/api";

function useVendorTableData() {
  const [rows, setRows] = useState([]); // ✅ IMPORTANT
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${Base_API}/vendors`)
      .then((res) => res.json())
      .then((data) => {
        console.log("VENDORS API:", data);

        // ✅ adjust based on your API response
        const vendors = data.data || data;

        const formattedRows = vendors.map((v) => ({
          vendorName: v.vendorName,
          phone: v.phone,
          email: v.email,
          company: v.company,

          action: (
            <button onClick={() => navigate(`/vendor/${v._id}`)}>
              View
            </button>
          ),
        }));

        setRows(formattedRows);
      })
      .catch((err) => {
        console.error("Vendor fetch error:", err);
        setRows([]); // ✅ fallback
      });
  }, []);

  // ✅ TABLE COLUMNS
  const columns = [
    { Header: "Vendor Name", accessor: "vendorName" },
    { Header: "Phone", accessor: "phone" },
    { Header: "Email", accessor: "email" },
    { Header: "Company", accessor: "company" },
    { Header: "Action", accessor: "action" },
  ];

  return {
    columns,
    rows,
    dialog: null, // optional
  };
}

export default useVendorTableData;