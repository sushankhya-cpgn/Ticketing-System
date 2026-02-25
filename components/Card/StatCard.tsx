import { Card, CardContent, Typography } from "@mui/material";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color: string; // Tailwind color class for icon background
  onClick?:()=> Promise<any>
}
function StatCard({ title, value, icon, color,onClick }: StatCardProps) {
  return (
    <Card className="rounded-2xl shadow-sm cursor-pointer" onClick={onClick}>
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