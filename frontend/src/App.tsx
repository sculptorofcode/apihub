import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Explore from "./pages/Explore";
import AIInsights from "./pages/AIInsights";
import Groups from "./pages/Groups";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Bookmarks from "./pages/Bookmarks";
import Friends from "./pages/Friends";
import Bonds from "./pages/Bonds";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./contexts/auth/AuthContext";
import AuthLayout from "./components/auth/AuthLayout";
import RealtimeInitializer from "./components/RealtimeInitializer";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      gcTime: 0,
      retry: 1,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />      <AuthProvider>
        <RealtimeInitializer />
        <BrowserRouter>
          <Routes>            <Route path="/auth/login" element={
            <AuthLayout title="Sign In" subtitle="Welcome back! Sign in with your username or email to continue." image="/auth-bg.svg">
              <Login />
            </AuthLayout>
          } />
            <Route path="/auth/register" element={
              <AuthLayout title="Create Account" subtitle="Join us today! Create your account to start exploring." image="/auth-bg.svg">
                <Register />
              </AuthLayout>
            } />
            <Route path="/auth/forgot-password" element={
              <AuthLayout title="Reset Password" subtitle="Forgot your password? Enter your email to reset it." image="/auth-bg.svg">
                <ForgotPassword />
              </AuthLayout>
            } />
            <Route path="/auth/reset-password/:token" element={
              <AuthLayout title="Set New Password" subtitle="Enter your new password to regain access." image="/auth-bg.svg">
                <ResetPassword />
              </AuthLayout>
            } />
            <Route path="/auth/verify-email" element={
              <AuthLayout title="Email Verification" subtitle="Verifying your email address..." image="/auth-bg.svg">
                <VerifyEmail />
              </AuthLayout>
            } />

            {/* Protected routes - within layout */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Index />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/explore"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Explore />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai-insights"
              element={
                <ProtectedRoute>
                  <Layout>
                    <AIInsights />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/groups"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Groups />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/bonds"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Bonds />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <Layout>
                    <CreatePost />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/:username"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-profile"
              element={
                <ProtectedRoute>
                  <Layout>
                    <EditProfile />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookmarks"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Bookmarks />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/friends"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Friends />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Chat />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Redirect to login if not found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
