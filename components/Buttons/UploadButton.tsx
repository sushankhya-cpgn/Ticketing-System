import React from "react";
import { Button, styled, Typography } from "@mui/material";
import { GridDeleteIcon } from "@mui/x-data-grid";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface UploadButtonProps{
  uploadedFiles: File[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>

}
 
export default function UploadButton({uploadedFiles,setUploadedFiles}:UploadButtonProps){

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
      });

    return(
        <>
        <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
        sx={{
          backgroundColor: '#1976d2',
          '&:hover': {
            backgroundColor: '#1565c0',
          },
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: '8px',
          padding: '10px 20px'
        }}
      >
        Upload Files
        <VisuallyHiddenInput
          type="file"
          onChange={(event:React.ChangeEvent<HTMLInputElement>) => {
            if(!event.target.files){
              return;
            }
            const files = Array.from(event.target.files);
            setUploadedFiles(prev => [...prev, ...files]);
          }}
          multiple
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        />
      </Button>
      
      {/* Display uploaded files */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <Typography variant="subtitle2" className="mb-2 text-gray-700 font-medium" >
            Uploaded Documents ({uploadedFiles.length})
          </Typography>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-blue-600">
                      {file.name.split('.').pop()?.toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button
                  size="small"
                  onClick={() => {
                    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
                  }}
                  sx={{ 
                    minWidth: 'auto',
                    padding: '4px',
                    color: '#dc2626',
                    '&:hover': {
                      backgroundColor: '#fee2e2'
                    }
                  }}
                >
                  <GridDeleteIcon fontSize="small" />
                </Button>
              </div>
            ))}
          </div>
        </div>
        
      )}
      </>
    );
}