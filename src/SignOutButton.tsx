"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-700 dark:text-gray-200 border border-white/20 dark:border-gray-600/20 font-semibold hover:bg-white/90 dark:hover:bg-gray-700/90 hover:shadow-md transition-all duration-200 shadow-sm group"
      onClick={() => void signOut()}
    >
      <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
      <span>Sign out</span>
    </motion.button>
  );
}