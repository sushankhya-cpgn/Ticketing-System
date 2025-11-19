import UserTable from "../../components/Table/UserTable";


export default function CustomersPage() {

  return (
    <>

      <p className="mt-2" style={{ color: "var(--text-secondary)" }}>
        Here’s a list of all registered users.
      </p>

      <div className="mt-2">
        <UserTable />
      </div>
   
     </>
  );
}
