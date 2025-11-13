
import { CircularProgress } from "@mui/material";


export default function CircularLoader(){
    return (
      <div className=" flex justify-center items-center h-screen">
          <CircularProgress sx={{height:"400px"}} />
        </div>
      );
}