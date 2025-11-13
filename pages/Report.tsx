
import Layout from "../components/layout/Layout";

export default function ReportPage() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold" style={{ color: "var(--text-foreground)" }}>
        Welcome to Report Page
      </h1>
      <p className="mt-2" style={{ color: "var(--text-secondary)" }}>
        Here's your report
      </p>
    </Layout>
  );
}
