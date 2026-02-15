import React, { useState } from "react";
import { ViewMode } from "./types";
import type { Note, StudySession, UserProfile } from "./types";
import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./components/Dashboard/Dashboard";
import NotesModule from "./components/Dashboard/NotesModule";
import ReadingMode from "./components/Dashboard/ReadingMode";
import QuestionPaperGenerator from "./components/Dashboard/QuestionPaper";
import StudyPlanner from "./components/Dashboard/StudyPlanner";
import Login from "./components/SignUp/Login";
import SignUp from "./components/SignUp/SignUp";
import Profile from "./components/Profile/Profile";
import { userDataService } from "./services/userData";
import { Menu } from "lucide-react";
import Homepage from "./components/Home/Homepage";
import SelfAssessment from "./components/Dashboard/SelfAssessment";
import { reportService } from "./services/reportService";
import { noteService } from "./services/noteService";
import { sessionService } from "./services/sessionService";
import AdminDashboard from "./components/Admin/AdminDashboard";
import UserList from "./components/Admin/UserList";
import UserDetail from "./components/Admin/UserDetail";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.Dashboard);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [readingNote, setReadingNote] = useState<Note | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // PWA Install State
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  React.useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowInstallButton(false);
    }
    setDeferredPrompt(null);
  };

  // Auth State
  const [userProfile, setUserProfile] = useState<UserProfile | null>(
    userDataService.getUserProfile(),
  );
  const isAuthenticated = !!userProfile;
  const [showSignUp, setShowSignUp] = useState(false);

  // Listen for auth changes (login/logout from other components)
  React.useEffect(() => {
    const handleAuthChange = () => {
      setUserProfile(userDataService.getUserProfile());
    };
    window.addEventListener("user-auth-changed", handleAuthChange);
    return () =>
      window.removeEventListener("user-auth-changed", handleAuthChange);
  }, []);

  // Check for weekly report on auth change
  React.useEffect(() => {
    if (isAuthenticated) {
      reportService.checkAndSendReports();
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    setUserProfile(userDataService.getUserProfile());
    setCurrentView(ViewMode.Dashboard);
  };

  const handleLogout = () => {
    userDataService.logout();
    setUserProfile(null);
    setCurrentView(ViewMode.Dashboard);
    setShowLogin(false); // Go back to Homepage on logout
    setShowSignUp(false);
  };

  // Load initial state from localStorage or fallback to empty array
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const stored = localStorage.getItem(
        userDataService.getStorageKey("studysync_notes"),
      );
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [sessions, setSessions] = useState<StudySession[]>(() => {
    try {
      const stored = localStorage.getItem(
        userDataService.getStorageKey("studysync_sessions"),
      );
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Load data when auth changes
  React.useEffect(() => {
    const loadUserData = async () => {
      if (!isAuthenticated) return;

      try {
        const [fetchedNotes, fetchedSessions] = await Promise.all([
          noteService.getAll(),
          sessionService.getAll(),
        ]);
        setNotes(fetchedNotes);
        setSessions(fetchedSessions);
      } catch (error) {
        console.error("Failed to load user data from API", error);
        // Fallback to local storage or mock if API fails?
        // For now, let's keep current state or maybe show error.
      }
    };

    loadUserData();

    // Also listen for auth changes to reload
    window.addEventListener("user-auth-changed", loadUserData);
    return () => window.removeEventListener("user-auth-changed", loadUserData);
  }, [isAuthenticated]);

  const renderContent = () => {
    switch (currentView) {
      case ViewMode.Dashboard:
        return <Dashboard setView={setCurrentView} />;
      case ViewMode.Notes:
        return (
          <NotesModule
            notes={notes}
            setNotes={setNotes}
            onRead={(note) => setReadingNote(note)}
          />
        );
      case ViewMode.Papers:
        return <QuestionPaperGenerator />;
      case ViewMode.Planner:
        return <StudyPlanner sessions={sessions} setSessions={setSessions} />;
      case ViewMode.Profile:
        return <Profile onLogout={handleLogout} />;
      case ViewMode.Assessment:
        return <SelfAssessment />;
      case ViewMode.AdminDashboard:
        return <AdminDashboard setView={setCurrentView} />;
      case ViewMode.AdminUsers:
        return (
          <UserList
            setView={setCurrentView}
            setSelectedUser={setSelectedUserId}
          />
        );
      case ViewMode.AdminUserDetail:
        return selectedUserId ? (
          <UserDetail
            userId={selectedUserId}
            onBack={() => setCurrentView(ViewMode.AdminUsers)}
          />
        ) : (
          <UserList
            setView={setCurrentView}
            setSelectedUser={setSelectedUserId}
          />
        );
      default:
        return <Dashboard setView={setCurrentView} />;
    }
  };

  if (!isAuthenticated) {
    if (showSignUp) {
      return (
        <SignUp
          onSignUp={handleLogin}
          onLoginClick={() => {
            setShowSignUp(false);
            setShowLogin(true);
          }}
        />
      );
    }
    if (showLogin) {
      return (
        <Login
          onLogin={handleLogin}
          onSignUpClick={() => {
            setShowLogin(false);
            setShowSignUp(true);
          }}
        />
      );
    }
    return (
      <Homepage
        onLoginClick={() => setShowLogin(true)}
        onInstallClick={handleInstallClick}
        showInstallButton={showInstallButton}
      />
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50 pb-safe overflow-x-hidden">
      {!isAuthenticated ? (
        <Login
          onLogin={handleLogin}
          onSignUpClick={() => {
            setShowLogin(false);
            setShowSignUp(true);
          }}
        />
      ) : (
        <>
          <Sidebar
            currentView={currentView}
            setView={setCurrentView}
            isOpen={isSidebarOpen}
            setIsOpen={setIsSidebarOpen}
            isAdmin={
              userProfile?.isAdmin ||
              userProfile?.email === "studysyncrudrani@gmail.com"
            }
          />

          {/* Mobile Header */}
          <div className="lg:hidden fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-40 px-4 py-3 flex items-center justify-between pt-safe">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-7 h-7 text-gray-700" />
            </button>
            <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              StudySync
            </h1>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>

          <main className="flex-1 lg:ml-64 p-3 sm:p-4 md:p-8 lg:p-12 pt-20 lg:pt-8">
            {renderContent()}
          </main>
        </>
      )}

      {/* Fullscreen Reading Mode overlay */}
      {readingNote && (
        <ReadingMode note={readingNote} onBack={() => setReadingNote(null)} />
      )}
    </div>
  );
};

export default App;
