import { useState } from "react";
import Layout from "../../components/layout/Layout";
import UserTable from "../../components/Table/UserTable";


export default function CustomersPage() {
  const [searchKYC, setSearchKYC] = useState(false);

  return (
    <Layout>

      <p className="mt-2" style={{ color: "var(--text-secondary)" }}>
        Here’s a list of all registered users.
      </p>

      <div className="mt-2">
        <UserTable setSearchKYC={setSearchKYC} />
      </div>
   
     </Layout>
  );
}
