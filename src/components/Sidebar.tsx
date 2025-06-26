import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Search, Plus, Globe, Lock, Trash2, MoreHorizontal, FileText, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  selectedDocumentId: Id<"documents"> | null;
  onSelectDocument: (id: Id<"documents"> | null) => void;
}

export function Sidebar({ selectedDocumentId, onSelectDocument }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState("");
  const [newDocIsPublic, setNewDocIsPublic] = useState(false);

  const documents = useQuery(api.documents.list);
  const searchResults = useQuery(
    api.documents.search,
    searchQuery.trim() ? { query: searchQuery } : "skip"
  );
  const createDocument = useMutation(api.documents.create);
  const togglePublic = useMutation(api.documents.togglePublic);
  const removeDocument = useMutation(api.documents.remove);

  const displayedDocuments = searchQuery.trim() ? searchResults : documents;

  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim()) return;

    try {
      const id = await createDocument({
        title: newDocTitle.trim(),
        isPublic: newDocIsPublic,
      });
      setNewDocTitle("");
      setNewDocIsPublic(false);
      setShowCreateForm(false);
      onSelectDocument(id);
      toast.success("Document created successfully");
    } catch (error) {
      toast.error("Failed to create document");
    }
  };

  const handleTogglePublic = async (id: Id<"documents">) => {
    try {
      await togglePublic({ id });
      toast.success("Document visibility updated");
    } catch (error) {
      toast.error("Failed to update document");
    }
  };

  const handleDeleteDocument = async (id: Id<"documents">) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      await removeDocument({ id });
      if (selectedDocumentId === id) {
        onSelectDocument(null);
      }
      toast.success("Document deleted");
    } catch (error) {
      toast.error("Failed to delete document");
    }
  };

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-80 bg-white/80 backdrop-blur-xl border-r border-white/20 flex flex-col shadow-xl"
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
              Documents
            </h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateForm(true)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
            title="Create new document"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
          </motion.button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 placeholder-gray-500"
          />
        </div>
      </div>

      {/* Create Document Form */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-b border-white/10 overflow-hidden"
          >
            <div className="p-6 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
              <form onSubmit={handleCreateDocument} className="space-y-4">
                <input
                  type="text"
                  placeholder="Document title..."
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                  autoFocus
                />
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={newDocIsPublic}
                    onChange={(e) => setNewDocIsPublic(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500/50"
                  />
                  <label htmlFor="isPublic" className="text-sm text-gray-700 font-medium">
                    Make public
                  </label>
                </div>
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-sm font-semibold shadow-lg"
                  >
                    Create
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewDocTitle("");
                      setNewDocIsPublic(false);
                    }}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 text-sm font-semibold"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Documents List */}
      <div className="flex-1 overflow-y-auto">
        {displayedDocuments === undefined ? (
          <div className="p-6 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 mx-auto mb-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-600 flex items-center justify-center"
            >
              <Sparkles className="w-4 h-4 text-white" />
            </motion.div>
            <p className="text-gray-500">Loading documents...</p>
          </div>
        ) : displayedDocuments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 text-center"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">
              {searchQuery.trim() ? "No documents found" : "No documents yet"}
            </p>
            {!searchQuery.trim() && (
              <p className="text-sm text-gray-400 mt-2">
                Create your first document to get started
              </p>
            )}
          </motion.div>
        ) : (
          <div className="p-3 space-y-2">
            <AnimatePresence>
              {displayedDocuments.map((doc, index) => (
                <motion.div
                  key={doc._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <DocumentItem
                    document={doc}
                    isSelected={selectedDocumentId === doc._id}
                    onSelect={() => onSelectDocument(doc._id)}
                    onTogglePublic={() => handleTogglePublic(doc._id)}
                    onDelete={() => handleDeleteDocument(doc._id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface DocumentItemProps {
  document: {
    _id: Id<"documents">;
    title: string;
    isPublic: boolean;
    createdBy: Id<"users">;
    lastModified: number;
  };
  isSelected: boolean;
  onSelect: () => void;
  onTogglePublic: () => void;
  onDelete: () => void;
}

function DocumentItem({
  document,
  isSelected,
  onSelect,
  onTogglePublic,
  onDelete,
}: DocumentItemProps) {
  const [showMenu, setShowMenu] = useState(false);
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const isOwner = loggedInUser?._id === document.createdBy;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative p-4 rounded-2xl cursor-pointer transition-all duration-200 ${
        isSelected
          ? "bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200/50 shadow-lg"
          : "hover:bg-white/60 hover:shadow-md border-2 border-transparent backdrop-blur-sm"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {document.title}
            </h3>
            <motion.div
              whileHover={{ scale: 1.1 }}
              className={`p-1 rounded-full ${
                document.isPublic 
                  ? "bg-green-100 text-green-600" 
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {document.isPublic ? (
                <Globe className="w-3 h-3" />
              ) : (
                <Lock className="w-3 h-3" />
              )}
            </motion.div>
          </div>
          <p className="text-xs text-gray-500 font-medium">
            {new Date(document.lastModified).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </div>

        {isOwner && (
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-2 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-lg hover:bg-white/50"
            >
              <MoreHorizontal className="w-4 h-4" />
            </motion.button>

            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-10 bg-white/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl z-20 py-2 min-w-[140px]"
                >
                  <motion.button
                    whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onTogglePublic();
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 flex items-center space-x-3 transition-colors duration-150"
                  >
                    {document.isPublic ? (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Make Private</span>
                      </>
                    ) : (
                      <>
                        <Globe className="w-4 h-4" />
                        <span>Make Public</span>
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ backgroundColor: "rgba(239, 68, 68, 0.05)" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 flex items-center space-x-3 transition-colors duration-150"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowMenu(false)}
        />
      )}
    </motion.div>
  );
}