import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, CheckCircle, Loader2 } from 'lucide-react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import { motion, AnimatePresence } from 'motion/react';

interface MediaUploadProps {
  onUploadComplete: (url: string, type: 'image' | 'video' | 'audio') => void;
  onReset: () => void;
}

export const MediaUpload: React.FC<MediaUploadProps> = ({ onUploadComplete, onReset }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'video' | 'audio' | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    const type = file.type.startsWith('image/') ? 'image' : 
                 file.type.startsWith('video/') ? 'video' : 
                 file.type.startsWith('audio/') ? 'audio' : null;

    if (!type) {
      alert('Unsupported file type');
      setUploading(false);
      return;
    }

    setFileType(type);
    const storageRef = ref(storage, `media/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(p);
      },
      (error) => {
        console.error('Upload failed', error);
        setUploading(false);
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setFileUrl(url);
        setUploading(false);
        onUploadComplete(url, type);
      }
    );
  }, [onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': [],
      'video/*': [],
      'audio/*': []
    },
    multiple: false
  });

  const handleReset = () => {
    setFileUrl(null);
    setFileType(null);
    setProgress(0);
    onReset();
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!fileUrl ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer",
                isDragActive ? "border-black bg-black/5" : "border-black/10 hover:border-black/30 bg-gray-50/50"
              )}
            >
              <input {...getInputProps()} />
            {uploading ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-black" size={48} />
                <div className="w-48 h-1.5 bg-black/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-black"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs font-bold font-mono">{Math.round(progress)}%</span>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-black/5 flex items-center justify-center text-gray-400 group-hover:text-black transition-colors">
                  <Upload size={24} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold tracking-tight">미디어를 드래그하여 업로드하세요</p>
                  <p className="text-xs text-gray-400 mt-1">이미지, 영상, 오디오 파일 지원</p>
                </div>
              </>
            )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-3xl overflow-hidden border border-black/5 shadow-xl"
          >
            {fileType === 'image' && <img src={fileUrl} alt="preview" className="w-full h-64 object-cover" />}
            {fileType === 'video' && <video src={fileUrl} controls className="w-full h-64 object-cover" />}
            {fileType === 'audio' && (
              <div className="w-full h-64 bg-black text-white flex flex-col items-center justify-center p-8 gap-4">
                <CheckCircle size={48} />
                <p className="text-sm font-bold">오디오 파일 업로드 완료</p>
                <audio src={fileUrl} controls className="w-full" />
              </div>
            )}
            <button 
              onClick={handleReset}
              className="absolute top-4 right-4 p-2 bg-black text-white rounded-full hover:bg-red-500 transition-colors shadow-lg"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
