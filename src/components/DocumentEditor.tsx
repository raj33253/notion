import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useBlockNoteSync } from "@convex-dev/prosemirror-sync/blocknote";
import { BlockNoteView } from "@blocknote/mantine";
import { BlockNoteEditor } from "@blocknote/core";
import usePresence from "@convex-dev/presence/react";
import FacePile from "@convex-dev/presence/facepile";
import { useState, useEffect } from "react";
import { Globe, Lock, Edit3 } from "lucide-react";
import { toast } from "sonner";

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
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (document === null) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Document not found
          </h2>
          <p className="text-gray-600">
            This document may have been deleted or you don't have access to it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Document Header */}
      <div className="border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            {isEditingTitle ? (
              <input
                type="text"
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={handleTitleKeyDown}
                className="text-2xl font-bold text-gray-900 bg-transparent border-none outline-none focus:ring-0 p-0 flex-1"
                autoFocus
              />
            ) : (
              <h1
                className="text-2xl font-bold text-gray-900 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded flex items-center space-x-2"
                onClick={() => setIsEditingTitle(true)}
              >
                <span>{document.title}</span>
                <Edit3 className="w-4 h-4 text-gray-400" />
              </h1>
            )}
            
            <div className="flex items-center space-x-2">
              {document.isPublic ? (
                <div className="flex items-center space-x-1 text-green-600">
                  <Globe className="w-4 h-4" />
                  <span className="text-sm font-medium">Public</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 text-gray-500">
                  <Lock className="w-4 h-4" />
                  <span className="text-sm font-medium">Private</span>
                </div>
              )}
            </div>
          </div>

          {/* Presence */}
          <div className="flex items-center space-x-4">
            {presenceState && presenceState.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {presenceState.length} online
                </span>
                <FacePile presenceState={presenceState} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-y-auto">
        {sync.isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading document...</p>
            </div>
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
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Document is empty
              </h3>
              <p className="text-gray-600 mb-4">
                This document hasn't been created yet.
              </p>
              <button
                onClick={() => sync.create({ type: "doc", content: [] })}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Document
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Wrapper component to handle document ID changes
export function DocumentEditorWrapper({ documentId }: DocumentEditorProps) {
  return <DocumentEditor key={documentId} documentId={documentId} />;
}
