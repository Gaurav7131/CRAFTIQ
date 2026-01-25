import React, { useEffect, useState } from "react";
import { Gem, Sparkles, LayoutGrid, Clock } from "lucide-react";
import { Protect, useAuth } from "@clerk/clerk-react";
import CreationItem from "../components/CreationItem";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Dashboard = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  const getDashboardData = async () => {
    try {
      const { data } = await axios.get("/api/user/get-user-creations", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setCreations(data.creations);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="h-full overflow-y-auto p-6 bg-slate-50/30">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-slate-800">My Workspace</h1>
          <p className="text-slate-500 text-sm">Manage and view your AI-powered creations</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-start gap-6 flex-wrap mb-10"
        >
          {/* Total Creations Card */}
          <motion.div 
            whileHover={{ scale: 1.02, translateY: -4 }}
            className="flex justify-between items-center w-80 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md"
          >
            <div>
              <p className="text-slate-500 text-sm font-medium">Total Creations</p>
              <h2 className="text-3xl font-bold mt-1 text-slate-800">{creations.length}</h2>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white flex justify-center items-center shadow-lg shadow-blue-100">
              <Sparkles className="w-7 h-7" />
            </div>
          </motion.div>

          {/* Active Plan Card */}
          <motion.div 
            whileHover={{ scale: 1.02, translateY: -4 }}
            className="flex justify-between items-center w-80 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md"
          >
            <div>
              <p className="text-slate-500 text-sm font-medium">Active Plan</p>
              <h2 className="text-3xl font-bold mt-1">
                <Protect plan="premium" fallback={<span className="text-slate-800">Free</span>}>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">
                    Premium
                  </span>
                </Protect>
              </h2>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 text-white flex justify-center items-center shadow-lg shadow-purple-100">
              <Gem className="w-7 h-7" />
            </div>
          </motion.div>
        </motion.div>

        {/* Recent Creations Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
            <Clock className="w-5 h-5 text-slate-400" />
            <h3 className="text-slate-700 font-bold text-lg">Recent History</h3>
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col justify-center items-center h-64 gap-4"
              >
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent shadow-md"></div>
                <p className="text-slate-400 font-medium animate-pulse">Syncing your data...</p>
              </motion.div>
            ) : (
              <motion.div 
                key="content"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 gap-4"
              >
                {creations.length > 0 ? (
                  creations.map((item) => (
                    <motion.div key={item.id} variants={itemVariants}>
                      <CreationItem item={item} />
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    variants={itemVariants}
                    className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300"
                  >
                    <LayoutGrid className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-medium">No creations found yet.</p>
                    <p className="text-slate-300 text-sm">Start creating something amazing!</p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;