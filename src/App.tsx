import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { DocumentEditor } from "./components/DocumentEditor";
import { Sidebar } from "./components/Sidebar";
import { useState } from "react";
import { Id } from "../convex/_generated/dataModel";

export default function App() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Unauthenticated>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Collaborative Editor
              </h1>
              <p className="text-lg text-gray-600">
                Sign in to start creating and editing documents
              </p>
            </div>
            <SignInForm />
          </div>
        </div>
      </Unauthenticated>

      <Authenticated>
        <Content />
      </Authenticated>

      <Toaster />
    </div>
  );
}

function Content() {
  const [selectedDocumentId, setSelectedDocumentId] = useState<Id<"documents"> | null>(null);

  return (
    <>
      <Sidebar
        selectedDocumentId={selectedDocumentId}
        onSelectDocument={setSelectedDocumentId}
      />
      <main className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">
            Collaborative Editor
          </h1>
          <SignOutButton />
        </header>
        <div className="flex-1">
          {selectedDocumentId ? (
            <DocumentEditor documentId={selectedDocumentId} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Welcome to your editor
                </h2>
                <p className="text-gray-600">
                  Select a document from the sidebar or create a new one to get started
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
