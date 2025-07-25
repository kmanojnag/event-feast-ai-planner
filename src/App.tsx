import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ChatAssistant from "./components/ChatAssistant";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import CustomerDashboard from "./pages/CustomerDashboard";
import ProviderDashboard from "./pages/ProviderDashboard";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import PlanEvent from "./pages/PlanEvent";
import MenuBuilder from "./pages/MenuBuilder";
import AdminDashboard from "./pages/AdminDashboard";
import Restaurants from "./pages/Restaurants";
import Caterers from "./pages/Caterers";
import FoodItems from "./pages/FoodItems";
import ProviderDetail from "./pages/ProviderDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <div className="relative">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/restaurants" element={<Restaurants />} />
              <Route path="/caterers" element={<Caterers />} />
              <Route path="/food-items" element={<FoodItems />} />
              <Route path="/provider/:id" element={<ProviderDetail />} />
              
              {/* Protected Dashboard Routes */}
              <Route 
                path="/dashboard/customer" 
                element={
                  <ProtectedRoute requiredRole="customer">
                    <CustomerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/restaurant" 
                element={
                  <ProtectedRoute requiredRole="restaurant">
                    <ProviderDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/caterer" 
                element={
                  <ProtectedRoute requiredRole="caterer">
                    <ProviderDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/provider" 
                element={
                  <ProtectedRoute requiredRole="restaurant">
                    <ProviderDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/organizer" 
                element={
                  <ProtectedRoute requiredRole="organizer">
                    <OrganizerDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Other Protected Routes */}
              <Route 
                path="/plan-event" 
                element={
                  <ProtectedRoute>
                    <PlanEvent />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/menu-builder" 
                element={
                  <ProtectedRoute>
                    <MenuBuilder />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ChatAssistant />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
