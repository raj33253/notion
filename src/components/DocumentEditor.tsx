import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useBlockNoteSync } from "@convex-dev/prosemirror-sync/blocknote";
import { BlockNoteView } from "@blocknote/mantine";
import { BlockNoteEditor } from "@blocknote/core";
import usePresence from "@convex-dev/presence/react";
import FacePile from "@convex-dev/presence/facepile";
import { useState, useEffect } from "react";
import { Globe, Lock, Edit3, Users, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// Import BlockNote styles
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

interface DocumentEditorProps {
  documentId: Id<"documents">;
}

export function DocumentEditor({ documentId }: DocumentEditorProps) {
  const document = useQuery(api.documents.get, { id: documentId });
  const userId = useQuery(api.presence.getUserId);
  const updateTitle = useMutation(api.documents.updateTitle);
  
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState("");

  // Initialize title value when document loads
  useEffect(() => {
    if (document?.title) {
      setTitleValue(document.title);
    }
  }, [document?.title]);

  const sync = useBlockNoteSync<BlockNoteEditor>(
    api.prosemirror,
    documentId,
    {
      editorOptions: {
        _tiptapOptions: {
          editorProps: {
            attributes: {
              class: "prose prose-lg max-w-none focus:outline-none min-h-[500px] px-8 py-6",
            },
          },
        },
      },
    }
  );

  const presenceState = usePresence(
    api.presence,
    documentId,
    userId || "",
    10000
  );

  const handleTitleSubmit = async () => {
    if (!titleValue.trim() || titleValue === document?.title) {
      setTitleValue(document?.title || "");
      setIsEditingTitle(false);
      return;
    }

    try {
      await updateTitle({ id: documentId, title: titleValue.trim() });
      setIsEditingTitle(false);
      toast.success("Title updated");
    } catch (error) {
      toast.error("Failed to update title");
      setTitleValue(document?.title || "");
      setIsEditingTitle(false);
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTitleSubmit();
    } else if (e.key === "Escape") {
      setTitleValue(document?.title || "");
      setIsEditingTitle(false);
    }
  };

  if (document === undefined) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50/50 to-purple-50/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-400 to-purple-600 flex items-center justify-center"
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>
          <p className="text-gray-600 font-medium">Loading document...</p>
        </motion.div>
      </div>
    );
  }

  if (document === null) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-red-50/50 to-orange-50/50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
            <Lock className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Document Not Found
          </h2>
          <p className="text-gray-600 leading-relaxed">
            This document may have been deleted or you don't have access to it.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="h-full flex flex-col bg-white/60 backdrop-blur-sm"
    >
      {/* Document Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="border-b border-white/20 px-8 py-6 bg-white/80 backdrop-blur-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            {isEditingTitle ? (
              <motion.input
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                type="text"
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={handleTitleKeyDown}
                className="text-3xl font-bold text-gray-900 bg-transparent border-none outline-none focus:ring-0 p-0 flex-1 placeholder-gray-400"
                autoFocus
                placeholder="Document title..."
              />
            ) : (
              <motion.h1
                whileHover={{ scale: 1.01 }}
                className="text-3xl font-bold text-gray-900 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 px-3 py-2 rounded-xl flex items-center space-x-3 transition-all duration-200 group"
                onClick={() => setIsEditingTitle(true)}
              >
                <span className="bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                  {document.title}
                </span>
                <Edit3 className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </motion.h1>
            )}
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              {document.isPublic ? (
                <div className="flex items-center space-x-2 px-3 py-2 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200/50">
                  <Globe className="w-4 h-4" />
                  <span className="text-sm font-semibold">Public</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 px-3 py-2 rounded-full bg-gradient-to-r from-gray-100 to-slate-100 text-gray-600 border border-gray-200/50">
                  <Lock className="w-4 h-4" />
                  <span className="text-sm font-semibold">Private</span>
                </div>
              )}
            </motion.div>
          </div>

          {/* Presence */}
          <AnimatePresence>
            {presenceState && presenceState.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center space-x-4"
              >
                <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200/50">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-semibold">
                    {presenceState.length} online
                  </span>
                </div>
                <FacePile presenceState={presenceState} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Editor */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="flex-1 overflow-y-auto"
      >
        {sync.isLoading ? (
          <div className="flex items-center justify-center h-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-400 to-purple-600 flex items-center justify-center"
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>
              <p className="text-gray-600 font-medium">Preparing your document...</p>
            </motion.div>
          </div>
        ) : sync.editor ? (
          <div className="h-full">
            <BlockNoteView
              editor={sync.editor}
              theme="light"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center max-w-md mx-auto p-8"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <Edit3 className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Ready to Write?
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                This document is waiting for your first words. Click below to start creating.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => sync.create({ type: "doc", content: [] })}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                Start Writing
              </motion.button>
            </motion.div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// Wrapper component to handle document ID changes
export function DocumentEditorWrapper({ documentId }: DocumentEditorProps) {
  return <DocumentEditor key={documentId} documentId={documentId} />;
}