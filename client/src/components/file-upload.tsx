import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { AlertTriangle, File, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  onFileRemove: (file: File) => void;
  maxSize?: number;
  maxFiles?: number;
  acceptedTypes?: string[];
  files: File[];
  isUploading?: boolean;
  error?: string;
}

const defaultAcceptedTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onFileRemove,
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 5,
  acceptedTypes = defaultAcceptedTypes,
  files,
  isUploading,
  error
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Filter out files that exceed size limit
    const validFiles = acceptedFiles.filter(file => file.size <= maxSize);
    
    // Check if adding new files would exceed maxFiles
    if (files.length + validFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }
    
    onFileSelect(validFiles);
  }, [maxSize, maxFiles, files.length, onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, curr) => ({ ...acc, [curr]: [] }), {}),
    maxSize,
    maxFiles: maxFiles - files.length,
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} disabled={isUploading} />
        {isDragActive ? (
          <p className="text-primary">Drop the files here...</p>
        ) : (
          <div className="space-y-2">
            <p>Drag & drop files here, or click to select files</p>
            <p className="text-sm text-gray-500">
              Maximum file size: {formatFileSize(maxSize)}
              <br />
              Accepted formats: {acceptedTypes.join(', ')}
            </p>
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <div className="flex items-center space-x-2">
                <File className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{file.name}</span>
                <span className="text-xs text-gray-500">
                  ({formatFileSize(file.size)})
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFileRemove(file)}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      {isUploading && (
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Uploading files...</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
