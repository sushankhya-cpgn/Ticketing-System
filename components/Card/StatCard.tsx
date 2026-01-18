import { Card, CardContent, Typography } from "@mui/material";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color: string; // Tailwind color class for icon background
}
function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="flex items-center gap-3">
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
        <div>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="subtitle2" fontWeight={600}>
            {value}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
}
export default StatCard;