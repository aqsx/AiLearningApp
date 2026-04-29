import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import documentService from "../../services/documentService";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";
import { ArrowLeft, ExternalLink, Flashlight, Import } from 'lucide-react';
import PageHeader from "../../components/common/PageHeader";
import MarkdownRenderer from "../../components/common/MarkdownRenderer";
import ChatInterface from '../../components/Chat/chatInterface';
import Tabs from "../../components/common/Tabs";
import AiActions from '../../components/ai/AiActions';
import FlashcardManager from '../../components/flashcards/flashcardManager';
import QuizManager from '../../components/quizzes/QuizManager'; // Import


const DocumentDetailPage = () => {
    const { id } = useParams();
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('content');

    useEffect(() => {
        const fetchDocument = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const response = await documentService.getDocumentById(id);
                const data = response.data ? response : { data: response };
                setDocument(data);
            } catch (error) {
                toast.error("Failed to load document");
                console.error("Fetch Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDocument(); 
    }, [id]);

    /* ======================
       UPDATED PDF URL LOGIC
    ====================== */
    const pdfUrl = useMemo(() => {
        const filePath = document?.data?.filePath;
        if (!filePath) return null;

        // 1. If it's already a full cloud link (S3, etc.), use it
        if (filePath.startsWith("http")) return filePath;

        // 2. Point to the PERMANENT backend route
        const baseUrl = "http://localhost:8000";
        
        // Extract ONLY the filename (e.g., "123-document.pdf") 
        // This prevents folder-path mismatch errors
        const fileName = filePath.split(/[/\\]/).pop();
        
        const finalUrl = `${baseUrl}/api/files/view/${fileName}`;
        console.log("Viewing PDF via:", finalUrl);
        return finalUrl;
    }, [document]);
        
    const renderContent = () => {
        if (!pdfUrl) return <div className="text-center p-8 text-slate-500">PDF Path not found in database</div>;

        return (
            <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-300">
                    <span className="text-sm font-medium text-gray-700">Document Viewer</span>
                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium">
                        <ExternalLink size={16} /> Open in new tab
                    </a>
                </div>
                <div className="bg-gray-100 p-1">
                    {/* key={pdfUrl} forces the iframe to reload if the URL changes */}
                    <iframe 
                        key={pdfUrl}
                        src={`${pdfUrl}#toolbar=0`} 
                        className="w-full h-[70vh] bg-white rounded border border-gray-300" 
                        title="PDF Viewer"
                    />
                </div>
            </div>
        );
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
    
    if (!document?.data) {
        return (
            <div className="p-8 text-center mt-10">
                <p className="mb-4 text-red-500 font-medium">Document data is missing</p>
                <Link to="/documents" className="text-blue-600 hover:underline">Return to list</Link>
            </div>
        );
    }
    const renderChat = () => {
        return<ChatInterface />
    };

    const tabs = [
        { id: 'content', label: 'Content', content: renderContent() },
        { id: 'chat', label: 'Chat', content: <ChatInterface /> },
        { id: 'ai-actions', label: 'AI Actions', content: <AiActions/> },
        { id: 'flashcards', label: 'Flashcards', content: <FlashcardManager documentId={id}/> },
        { id: 'quizzes', label: 'Quizzes', content: <QuizManager documentId={id}/> },
    ];

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            <div className="mb-6">
                <Link to="/documents" className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                    <ArrowLeft size={16} /> Back to documents
                </Link>
            </div>
            
            <PageHeader title={document.data.title || "Untitled"} />
            
            <div className="mt-6">
                <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
        </div>
    );
};

export default DocumentDetailPage;
       
          
        
    
        