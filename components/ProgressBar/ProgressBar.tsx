import LinearProgress from '@mui/material/LinearProgress';

interface ProgressBarprops {
  step:number;
  tabslength:number;
}
const ProgressBar:React.FC<ProgressBarprops> = ({ step, tabslength }) => {
  // Calculate the progress percentage
  const progress = (step / tabslength) * 100;
  console.log(progress)

  return (
    <LinearProgress
      variant="determinate"
      value={Math.round(progress)}// Ensure it’s rounded properly
      sx={{
        height: 6,
        borderRadius: 5,
      }}
    />
  );
}

export default ProgressBar;
