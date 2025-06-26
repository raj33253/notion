import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Search, Plus, Globe, Lock, Trash2, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

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
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Documents</h2>
          <button
            onClick={() => setShowCreateForm(true)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Create new document"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Create Document Form */}
      {showCreateForm && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <form onSubmit={handleCreateDocument} className="space-y-3">
            <input
              type="text"
              placeholder="Document title..."
              value={newDocTitle}
              onChange={(e) => setNewDocTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={newDocIsPublic}
                onChange={(e) => setNewDocIsPublic(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isPublic" className="text-sm text-gray-700">
                Make public
              </label>
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewDocTitle("");
                  setNewDocIsPublic(false);
                }}
                className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Documents List */}
      <div className="flex-1 overflow-y-auto">
        {displayedDocuments === undefined ? (
          <div className="p-4 text-center text-gray-500">Loading...</div>
        ) : displayedDocuments.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchQuery.trim() ? "No documents found" : "No documents yet"}
          </div>
        ) : (
          <div className="p-2">
            {displayedDocuments.map((doc) => (
              <DocumentItem
                key={doc._id}
                document={doc}
                isSelected={selectedDocumentId === doc._id}
                onSelect={() => onSelectDocument(doc._id)}
                onTogglePublic={() => handleTogglePublic(doc._id)}
                onDelete={() => handleDeleteDocument(doc._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
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
    <div
      className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
        isSelected
          ? "bg-blue-50 border border-blue-200"
          : "hover:bg-gray-50 border border-transparent"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {document.title}
            </h3>
            {document.isPublic ? (
              <Globe className="w-3 h-3 text-green-600 flex-shrink-0" />
            ) : (
              <Lock className="w-3 h-3 text-gray-400 flex-shrink-0" />
            )}
          </div>
          <p className="text-xs text-gray-500">
            {new Date(document.lastModified).toLocaleDateString()}
          </p>
        </div>

        {isOwner && (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1 min-w-[120px]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTogglePublic();
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
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
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
}
