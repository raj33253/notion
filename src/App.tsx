import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { DocumentEditor } from "./components/DocumentEditor";
import { Sidebar } from "./components/Sidebar";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ThemeToggle } from "./components/ThemeToggle";
import { useState, useEffect } from "react";
import { Id } from "../convex/_generated/dataModel";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, FileText, Users, Zap } from "lucide-react";

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 transition-colors duration-300">
      <Unauthenticated>
        <LandingPage />
      </Unauthenticated>

      <Authenticated>
        <Content />
      </Authenticated>

      <Toaster 
        position="top-right"
        theme="system"
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          },
          className: 'dark:!bg-gray-800/95 dark:!text-white dark:!border-gray-700/20',
        }}
      />
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 mx-auto mb-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-600 flex items-center justify-center"
        >
          <Sparkles className="w-8 h-8 text-white" />
        </motion.div>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl font-bold text-white mb-4"
        >
          Collaborative Editor
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-xl text-blue-200"
        >
          Preparing your workspace...
        </motion.p>
      </motion.div>
    </div>
  );
}

function LandingPage() {
  return (
    <div className="flex-1 relative overflow-hidden">
      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-400 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-400 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-200 text-sm font-medium border border-blue-200/50 dark:border-blue-700/50"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Next-generation collaboration
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent leading-tight"
              >
                Write Together,
                <br />
                Create Magic
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg"
              >
                Experience the future of collaborative writing with real-time editing, 
                beautiful design, and seamless teamwork.
              </motion.p>
            </div>

            {/* Feature Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {[
                { icon: FileText, title: "Rich Editor", desc: "Beautiful writing experience" },
                { icon: Users, title: "Real-time Sync", desc: "Collaborate instantly" },
                { icon: Zap, title: "Lightning Fast", desc: "Optimized performance" }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <feature.icon className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3" />
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Auth Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative"
          >
            <div className="relative p-8 rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 shadow-2xl">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 to-white/10 dark:from-gray-800/40 dark:to-gray-800/10 backdrop-blur-xl"></div>
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Get Started
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Join thousands of creators already collaborating
                  </p>
                </div>
                <SignInForm />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Content() {
  const [selectedDocumentId, setSelectedDocumentId] = useState<Id<"documents"> | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex w-full"
    >
      <Sidebar
        selectedDocumentId={selectedDocumentId}
        onSelectDocument={setSelectedDocumentId}
      />
      <main className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            {selectedDocumentId ? (
              <motion.div
                key={selectedDocumentId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <DocumentEditor documentId={selectedDocumentId} />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center h-full"
              >
                <EmptyState />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </motion.div>
  );
}

function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/20 px-6 py-4 flex justify-between items-center shadow-sm"
    >
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 dark:from-white dark:to-blue-100 bg-clip-text text-transparent">
          Collaborative Editor
        </h1>
      </div>
      <div className="flex items-center space-x-3">
        <ThemeToggle />
        <SignOutButton />
      </div>
    </motion.header>
  );
}

function EmptyState() {
  return (
    <div className="text-center max-w-md mx-auto p-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center"
      >
        <FileText className="w-12 h-12 text-blue-600 dark:text-blue-400" />
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-2xl font-bold text-gray-900 dark:text-white mb-3"
      >
        Ready to Create?
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed"
      >
        Select a document from the sidebar or create a new one to start your collaborative writing journey.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="flex items-center justify-center space-x-2 text-sm text-blue-600 dark:text-blue-400"
      >
        <Sparkles className="w-4 h-4" />
        <span>Your ideas await</span>
      </motion.div>
    </div>
  );
}