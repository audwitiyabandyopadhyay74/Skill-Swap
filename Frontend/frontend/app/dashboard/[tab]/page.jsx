'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardHome from '../components/DashboardHome';
import DashboardBrowse from '../components/DashboardBrowse';
import DashboardMessages from '../components/DashboardMessages';
import DashboardSessions from '../components/DashboardSessions';
import DashboardProfile from '../components/DashboardProfile';
import CreatePostModal from '../components/CreatePostModal';
import VideoMeetModal from '../components/VideoMeetModal';
import MobileBottomNav from '../components/MobileBottomNav';
import Aurora from '../../components/Aurora';
import { usersAPI, sessionsAPI } from '../../lib/api';

const VALID_TABS = ['home', 'browse', 'messages', 'sessions', 'profile'];

export default function DashboardTabPage() {
  const router = useRouter();
  const params = useParams();
  const tab = params?.tab;
  const activeTab = VALID_TABS.includes(tab) ? tab : 'home';

  const [user, setUser] = useState(null);
  const [targetChatUser, setTargetChatUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [dashData, setDashData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [activeVideoMeet, setActiveVideoMeet] = useState(null);

  const navigate = (tabId) => router.push(`/dashboard/${tabId}`);

  const handleOpenChat = (targetUser) => {
    setTargetChatUser(targetUser);
    router.push('/dashboard/messages');
  };

  const fetchDashboardData = async () => {
    try {
      const data = await usersAPI.dashboard();
      setDashData(data);
      if (data.user) {
        setUser(data.user);
        localStorage.setItem('ss_user', JSON.stringify(data.user));
      }
    } catch (err) {
      console.log('Dashboard fetch notice:', err.message);
    }
  };

  const fetchSessions = async () => {
    try {
      const data = await sessionsAPI.list();
      setSessions(data.sessions || []);
    } catch (err) {
      console.log('Sessions fetch notice:', err.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('ss_token');
    const storedUser = localStorage.getItem('ss_user');
    if (!token) {
      router.replace('/auth/login');
      return;
    }
    if (storedUser) setUser(JSON.parse(storedUser));
    Promise.all([fetchDashboardData(), fetchSessions()]).finally(() => setLoading(false));
  }, [router]);

  useEffect(() => {
    if (tab && !VALID_TABS.includes(tab)) {
      router.replace('/dashboard/home');
    }
  }, [tab, router]);

  const handleLogout = () => {
    localStorage.removeItem('ss_token');
    localStorage.removeItem('ss_user');
    router.replace('/auth/login');
  };

  const refreshAll = async () => {
    await Promise.all([fetchDashboardData(), fetchSessions()]);
  };

  if (loading) {
    return (
      <div className="w-screen h-screen bg-[#0a0a0a] flex items-center justify-center font-mono text-[#00ff62]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-[#00ff62]/20 border-t-[#00ff62] rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest">Loading SkillSwap Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans relative selection:bg-[#00ff62] selection:text-black">
      <div className="fixed inset-0 pointer-events-none opacity-30 z-0">
        <Aurora
          colorStops={['#00ff62', '#6366f1', '#a855f7']}
          blend={0.6}
          amplitude={1.2}
          speed={0.4}
        />
      </div>

      <DashboardSidebar
        activeTab={activeTab}
        onNavigate={navigate}
        user={user}
        onLogout={handleLogout}
        onCreatePost={() => setShowCreatePostModal(true)}
      />

      <main className="flex-1 md:ml-64 pb-20 md:pb-8 min-h-screen relative z-10">
        {activeTab === 'home' && (
          <DashboardHome
            user={user}
            dashData={dashData}
            sessions={sessions}
            onNavigate={navigate}
            onCreatePost={() => setShowCreatePostModal(true)}
            onLaunchMeet={(sess) => setActiveVideoMeet(sess)}
          />
        )}
        {activeTab === 'browse' && (
          <DashboardBrowse
            user={user}
            onCreatePost={() => setShowCreatePostModal(true)}
            onRefresh={refreshAll}
            onOpenChat={handleOpenChat}
          />
        )}
        {activeTab === 'messages' && (
          <DashboardMessages
            user={user}
            initialTargetUser={targetChatUser}
            onNavigate={navigate}
          />
        )}
        {activeTab === 'sessions' && (
          <DashboardSessions
            sessions={sessions}
            user={user}
            refreshSessions={refreshAll}
            onLaunchMeet={(sess) => setActiveVideoMeet(sess)}
            onOpenChat={handleOpenChat}
          />
        )}
        {activeTab === 'profile' && (
          <DashboardProfile
            user={user}
            onProfileUpdate={(updatedUser) => {
              setUser(updatedUser);
              localStorage.setItem('ss_user', JSON.stringify(updatedUser));
            }}
          />
        )}
      </main>

      <MobileBottomNav
        activeTab={activeTab}
        onNavigate={navigate}
        onCreatePost={() => setShowCreatePostModal(true)}
      />

      {showCreatePostModal && (
        <CreatePostModal
          onClose={() => setShowCreatePostModal(false)}
          onSuccess={refreshAll}
        />
      )}

      {activeVideoMeet && (
        <VideoMeetModal
          session={activeVideoMeet}
          user={user}
          onClose={() => setActiveVideoMeet(null)}
          onRefreshSessions={refreshAll}
        />
      )}
    </div>
  );
}
