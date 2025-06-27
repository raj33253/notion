"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Mail, Lock, User, Sparkles } from "lucide-react";

export function SignInForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="w-full space-y-6">
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitting(true);
          const formData = new FormData(e.target as HTMLFormElement);
          formData.set("flow", flow);
          void signIn("password", formData).catch((error) => {
            let toastTitle = "";
            if (error.message.includes("Invalid password")) {
              toastTitle = "Invalid password. Please try again.";
            } else {
              toastTitle =
                flow === "signIn"
                  ? "Could not sign in, did you mean to sign up?"
                  : "Could not sign up, did you mean to sign in?";
            }
            toast.error(toastTitle);
            setSubmitting(false);
          });
        }}
      >
        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
            <input
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border border-white/20 dark:border-gray-600/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 shadow-sm hover:shadow-md placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white"
              type="email"
              name="email"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
            <input
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border border-white/20 dark:border-gray-600/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 shadow-sm hover:shadow-md placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white"
              type="password"
              name="password"
              placeholder="Enter your password"
              required
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          type="submit"
          disabled={submitting}
        >
          <div className="flex items-center justify-center space-x-2">
            {submitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
                <span>Please wait...</span>
              </>
            ) : (
              <>
                <User className="w-5 h-5" />
                <span>{flow === "signIn" ? "Sign In" : "Create Account"}</span>
              </>
            )}
          </div>
        </motion.button>

        <div className="text-center">
          <span className="text-gray-600 dark:text-gray-300">
            {flow === "signIn"
              ? "Don't have an account? "
              : "Already have an account? "}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            type="button"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold hover:underline cursor-pointer transition-all duration-200"
            onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
          >
            {flow === "signIn" ? "Sign up instead" : "Sign in instead"}
          </motion.button>
        </div>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white/80 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 font-medium">or continue with</span>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 rounded-2xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-700 dark:text-gray-200 font-semibold border border-white/20 dark:border-gray-600/20 hover:bg-white/90 dark:hover:bg-gray-700/90 hover:shadow-md transition-all duration-200 shadow-sm"
        onClick={() => void signIn("anonymous")}
      >
        <div className="flex items-center justify-center space-x-2">
          <Sparkles className="w-5 h-5 text-purple-500 dark:text-purple-400" />
          <span>Try it anonymously</span>
        </div>
      </motion.button>
    </div>
  );
}