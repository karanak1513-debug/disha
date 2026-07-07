import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Lock, User, Palette, Globe, ChevronRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("disha_notifications");
    return saved ? JSON.parse(saved) : { email: true, push: true, sms: false, marketing: false };
  });
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("disha_theme") || "light";
  });
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("disha_language") || "English (United States)";
  });
  const [timezone, setTimezone] = useState(() => {
    return localStorage.getItem("disha_timezone") || "Pacific Time (PT)";
  });

  useEffect(() => {
    localStorage.setItem("disha_notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("disha_theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const saveGeneralSettings = () => {
    localStorage.setItem("disha_language", language);
    localStorage.setItem("disha_timezone", timezone);
    // Visual feedback
    const btn = document.getElementById("save-general-btn");
    if(btn) {
      const originalText = btn.innerText;
      btn.innerText = "Saved!";
      btn.classList.add("bg-green-600");
      setTimeout(() => {
        btn.innerText = originalText;
        btn.classList.remove("bg-green-600");
      }, 2000);
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Lock },
    { id: "appearance", label: "Appearance", icon: Palette },
  ];

  return (
    <div className="space-y-0 pb-8">
      {/* ── HEADER ── */}
      <div className="-mt-6 -mx-6 mb-8 bg-white border-b border-[#E5E7EB] px-6 md:px-8 py-8 h-auto flex items-center relative overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl opacity-50 pointer-events-none animate-pulse-slow" />

        <div className="w-full flex flex-col xl:flex-row xl:items-end justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <motion.div initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} className="flex items-center gap-2 text-[14px] font-medium text-slate-500">
              <span className="text-slate-800 transition-colors">Account</span>
              <span className="text-slate-400">/</span>
              <span className="text-slate-800 font-semibold">Settings</span>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 flex-shrink-0">
            <nav className="flex flex-col space-y-1 bg-white p-2 border border-slate-200 rounded-2xl shadow-sm">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isActive 
                        ? "bg-blue-50 text-blue-700" 
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm"
            >
              
              {/* General Settings */}
              {activeTab === "general" && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">General Settings</h3>
                    <p className="text-sm text-slate-500 mb-6">Manage your basic account settings and preferences.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Language</label>
                      <select 
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full sm:max-w-md px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
                      >
                        <option>English (United States)</option>
                        <option>Spanish (Español)</option>
                        <option>French (Français)</option>
                        <option>Hindi (हिन्दी)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Timezone</label>
                      <select 
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="w-full sm:max-w-md px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
                      >
                        <option>Pacific Time (PT)</option>
                        <option>Eastern Time (ET)</option>
                        <option>Coordinated Universal Time (UTC)</option>
                        <option>Indian Standard Time (IST)</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100">
                    <button 
                      id="save-general-btn"
                      onClick={saveGeneralSettings}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-sm shadow-blue-600/20 transition-all"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {/* Notifications */}
              {activeTab === "notifications" && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">Notification Preferences</h3>
                    <p className="text-sm text-slate-500 mb-6">Control how and when you want to be notified.</p>
                  </div>

                  <div className="space-y-6">
                    {/* Toggle Item */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">Email Notifications</h4>
                        <p className="text-xs text-slate-500 mt-1">Receive campaign updates and digests via email.</p>
                      </div>
                      <button 
                        onClick={() => setNotifications({...notifications, email: !notifications.email})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.email ? 'bg-blue-600' : 'bg-slate-200'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.email ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">Push Notifications</h4>
                        <p className="text-xs text-slate-500 mt-1">Receive alerts directly in your browser.</p>
                      </div>
                      <button 
                        onClick={() => setNotifications({...notifications, push: !notifications.push})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.push ? 'bg-blue-600' : 'bg-slate-200'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.push ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">SMS Alerts</h4>
                        <p className="text-xs text-slate-500 mt-1">Get text messages for critical volunteer updates.</p>
                      </div>
                      <button 
                        onClick={() => setNotifications({...notifications, sms: !notifications.sms})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.sms ? 'bg-blue-600' : 'bg-slate-200'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.sms ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Security */}
              {activeTab === "security" && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">Security Settings</h3>
                    <p className="text-sm text-slate-500 mb-6">Manage your password and security preferences.</p>
                  </div>

                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Current Password</label>
                      <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">New Password</label>
                      <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Confirm New Password</label>
                      <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                    <button className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl shadow-sm transition-all">
                      Update Password
                    </button>
                    
                    <button className="text-sm font-bold text-rose-500 hover:text-rose-600 transition-colors">
                      Deactivate Account
                    </button>
                  </div>
                </div>
              )}

              {/* Appearance */}
              {activeTab === "appearance" && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">Appearance</h3>
                    <p className="text-sm text-slate-500 mb-6">Customize the look and feel of your dashboard.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 max-w-md">
                    <button 
                      onClick={() => setTheme("light")}
                      className={`relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${theme === 'light' ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                      <div className="w-full h-24 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex flex-col gap-2 p-2">
                        <div className="h-4 w-full bg-white rounded shadow-sm" />
                        <div className="flex-1 flex gap-2">
                          <div className="w-1/3 h-full bg-white rounded shadow-sm" />
                          <div className="flex-1 h-full bg-white rounded shadow-sm" />
                        </div>
                      </div>
                      <span className="text-sm font-bold text-slate-700">Light Mode</span>
                      {theme === 'light' && (
                        <div className="absolute top-3 right-3 h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center text-white">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </button>

                    <button 
                      onClick={() => setTheme("dark")}
                      className={`relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${theme === 'dark' ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                      <div className="w-full h-24 bg-slate-800 rounded-lg overflow-hidden border border-slate-700 flex flex-col gap-2 p-2">
                        <div className="h-4 w-full bg-slate-700 rounded shadow-sm" />
                        <div className="flex-1 flex gap-2">
                          <div className="w-1/3 h-full bg-slate-700 rounded shadow-sm" />
                          <div className="flex-1 h-full bg-slate-700 rounded shadow-sm" />
                        </div>
                      </div>
                      <span className="text-sm font-bold text-slate-700">Dark Mode</span>
                      {theme === 'dark' && (
                        <div className="absolute top-3 right-3 h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center text-white">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
