import React, { useState, useEffect } from "react";
import { Plus, Upload, FileText, X, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import documentService from "../../services/documentService";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";
import DocumentCard from "../../components/documents/DocumentCard";

const DocumentListPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isUploadModelOpen, setIsUploadModelOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploading, setUploading] = useState(false);

  const [isDeleteModelOpen, setIsDeleteModelOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [deleting, setDeleting] = useState(false);

  /* ================= FETCH ================= */
  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await documentService.getDocuments();

      if (res.success) {
        setDocuments(Array.isArray(res.data) ? res.data : []);
      } else {
        toast.error("Failed to load documents");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  /* ================= FILE SELECT ================= */
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setUploadFile(file);
      setUploadTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  /* ================= UPLOAD ================= */
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!uploadFile || !uploadTitle) {
      toast.error("Select file and enter title");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("title", uploadTitle);

      const res = await documentService.uploadDocument(formData);

      if (res.success) {
        toast.success("Uploaded");

        setDocuments((prev) => [res.data, ...prev]);

        setIsUploadModelOpen(false);
        setUploadFile(null);
        setUploadTitle("");
      } else {
        toast.error("Upload failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDeleteRequest = (doc) => {
    setSelectedDoc(doc);
    setIsDeleteModelOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDoc) return;

    setDeleting(true);

    try {
      await documentService.deleteDocument(selectedDoc._id);

      toast.success("Deleted");

      setDocuments((prev) =>
        prev.filter((d) => d._id !== selectedDoc._id)
      );

      setIsDeleteModelOpen(false);
      setSelectedDoc(null);
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  /* ================= CONTENT ================= */
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-[400px]">
          <Spinner />
        </div>
      );
    }

    if (!documents.length) {
      return (
        <div className="flex justify-center items-center min-h-[400px] text-center">
          <div>
            <FileText className="mx-auto mb-4 text-slate-400" size={40} />
            <h3 className="font-semibold text-lg">No documents</h3>
            <p className="text-sm text-slate-500 mb-4">
              Upload your first file
            </p>

            <Button onClick={() => setIsUploadModelOpen(true)}>
              <Plus size={16} /> Upload
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {documents.map((doc) => (
          <DocumentCard
            key={doc._id}
            doc={doc}
            onDelete={handleDeleteRequest}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-8">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Documents</h1>
            <p className="text-sm text-slate-500">
              Manage your files
            </p>
          </div>

          <Button onClick={() => setIsUploadModelOpen(true)}>
            <Plus size={16} /> Upload
          </Button>
        </div>

        {renderContent()}
      </div>

      {/* ================= UPLOAD MODAL ================= */}
      {isUploadModelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsUploadModelOpen(false)}
          />

          {/* modal */}
          <div className="relative bg-white p-6 rounded-2xl w-full max-w-md z-50">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold">Upload</h2>
              <button onClick={() => setIsUploadModelOpen(false)}>
                <X />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">

              <input
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="Title"
                className="w-full border px-3 py-2 rounded-lg"
              />

              {/* ✅ FIXED FILE INPUT */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-emerald-400 transition relative">

                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />

                <Upload className="mx-auto text-gray-400 mb-2" size={24} />

                <p className="text-sm text-gray-500">
                  {uploadFile ? uploadFile.name : "Click to select PDF file"}
                </p>
              </div>

              <Button type="submit" disabled={uploading}>
                {uploading ? "Uploading..." : "Upload"}
              </Button>

            </form>
          </div>
        </div>
      )}

      {/* ================= DELETE MODAL ================= */}
      {isDeleteModelOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">

          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsDeleteModelOpen(false)}
          />

          <div className="relative bg-white p-6 rounded-xl w-full max-w-sm z-[61] text-center">
            <Trash2 className="mx-auto text-red-500 mb-3" />

            <h3 className="font-semibold mb-2">Delete Document?</h3>
            <p className="text-sm text-gray-500 mb-4">
              This cannot be undone
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteModelOpen(false)}
                className="flex-1 py-2 bg-gray-100 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="flex-1 py-2 bg-red-500 text-white rounded-lg"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DocumentListPage;
