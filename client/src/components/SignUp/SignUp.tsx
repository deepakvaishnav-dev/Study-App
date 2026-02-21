import React, { useState } from "react";
import type { UserProfile } from "../../types";
import {
  BookOpen,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  XCircle,
  Mail,
  User,
  School,
  Lock,
} from "lucide-react";
import { userDataService } from "../../services/userData";
import { reportService } from "../../services/reportService";
import api from "../../services/api";

interface SignUpProps {
  onSignUp: () => void;
  onLoginClick: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUp, onLoginClick }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [grade, setGrade] = useState("Grade 10");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const validatePassword = (pass: string): boolean => {
    if (pass.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    if (!/(?=.*[a-z])/.test(pass)) {
      setError("Password must contain a lowercase letter");
      return false;
    }
    if (!/(?=.*[A-Z])/.test(pass)) {
      setError("Password must contain an uppercase letter");
      return false;
    }
    if (!/(?=.*\d)/.test(pass)) {
      setError("Password must contain a number");
      return false;
    }
    setError("");
    return true;
  };

  const getPasswordStrength = (
    pass: string,
  ): { strength: string; color: string; width: string } => {
    if (pass.length === 0) return { strength: "", color: "", width: "0%" };

    let score = 0;
    if (pass.length >= 8) score++;
    if (pass.length >= 12) score++;
    if (/(?=.*[a-z])/.test(pass)) score++;
    if (/(?=.*[A-Z])/.test(pass)) score++;
    if (/(?=.*\d)/.test(pass)) score++;
    if (/(?=.*[@$!%*?&])/.test(pass)) score++;

    if (score <= 2)
      return { strength: "Weak", color: "bg-red-500", width: "33%" };
    if (score <= 4)
      return { strength: "Medium", color: "bg-yellow-500", width: "66%" };
    return { strength: "Strong", color: "bg-green-500", width: "100%" };
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("All fields are required");
      return;
    }

    if (parentEmail && !validateEmail(parentEmail)) {
      setError("Please enter a valid parent email");
      return;
    }

    if (!validatePassword(password)) {
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      // Register with backend
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      const { token, user } = response.data;

      // Construct full profile for local storage (backend might not store grade/parentEmail yet)
      const profile: UserProfile = {
        name: user.name || name,
        email: user.email || email,
        grade,
        joinedDate: new Date().toLocaleDateString(),
        parentEmail,
      };

      // Login locally
      userDataService.login(profile, token);

      // Send welcome email if needed
      reportService.sendLoginSuccessEmail(email, name, parentEmail);

      onSignUp();
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as {
          response?: { data?: { message?: string } };
        };
        setError(axiosError.response?.data?.message || "Registration failed");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Registration failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/50 relative overflow-hidden">
          {/* Decorative linear */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-linear-to-br from-indigo-400 to-purple-400 rounded-full blur-3xl opacity-20 -mr-20 -mt-20" />

          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-linear-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <BookOpen className="text-white w-8 h-8" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">
                Create Account
              </h2>
              <p className="text-gray-600">Join StudySync today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div className="relative">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    required
                    className={`w-full bg-gray-50/80 border-2 rounded-xl pl-10 pr-4 py-3 outline-none transition-all ${
                      focusedField === "name"
                        ? "border-indigo-500 ring-4 ring-indigo-100 bg-white"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="relative">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  school Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    required
                    className={`w-full bg-gray-50/80 border-2 rounded-xl pl-10 pr-4 py-3 outline-none transition-all ${
                      focusedField === "email"
                        ? "border-indigo-500 ring-4 ring-indigo-100 bg-white"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    placeholder="student@school.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              </div>

              {/* Parent Email Field */}
              <div className="relative">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Parent's Email{" "}
                  <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    className={`w-full bg-gray-50/80 border-2 rounded-xl pl-10 pr-4 py-3 outline-none transition-all ${
                      focusedField === "parentEmail"
                        ? "border-indigo-500 ring-4 ring-indigo-100 bg-white"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    placeholder="parent@example.com"
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    onFocus={() => setFocusedField("parentEmail")}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              </div>

              {/* Grade Field */}
              <div className="relative">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Grade Level
                </label>
                <div className="relative">
                  <School className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    className={`w-full bg-gray-50/80 border-2 rounded-xl pl-10 pr-4 py-3 outline-none transition-all appearance-none cursor-pointer ${
                      focusedField === "grade"
                        ? "border-indigo-500 ring-4 ring-indigo-100 bg-white"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    onFocus={() => setFocusedField("grade")}
                    onBlur={() => setFocusedField(null)}
                  >
                    {[9, 10, 11, 12].map((g) => (
                      <option key={g} value={`Grade ${g}`}>
                        Grade {g}
                      </option>
                    ))}
                    <option value="College">College / University</option>
                  </select>
                </div>
              </div>

              {/* Password Field */}
              <div className="relative">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className={`w-full bg-gray-50/80 border-2 rounded-xl pl-10 pr-12 py-3 outline-none transition-all ${
                      focusedField === "password"
                        ? "border-indigo-500 ring-4 ring-indigo-100 bg-white"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    placeholder="Create password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (e.target.value) validatePassword(e.target.value);
                    }}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {/* Strength Indicator */}
                {password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-600">
                        Strength
                      </span>
                      <span
                        className={`text-xs font-bold ${
                          getPasswordStrength(password).strength === "Strong"
                            ? "text-green-600"
                            : getPasswordStrength(password).strength ===
                                "Medium"
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {getPasswordStrength(password).strength}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${getPasswordStrength(password).color}`}
                        style={{ width: getPasswordStrength(password).width }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="relative">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    className={`w-full bg-gray-50/80 border-2 rounded-xl pl-10 pr-12 py-3 outline-none transition-all ${
                      focusedField === "confirmPassword"
                        ? "border-indigo-500 ring-4 ring-indigo-100 bg-white"
                        : "border-gray-200 hover:border-gray-300"
                    } ${confirmPassword && password !== confirmPassword ? "border-red-300" : ""}`}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (error === "Passwords do not match") setError("");
                    }}
                    onFocus={() => setFocusedField("confirmPassword")}
                    onBlur={() => setFocusedField(null)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white font-bold py-3.5 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed mt-2 group"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="text-center mt-4 text-sm text-gray-500">
                By signing up, you agree to our{" "}
                <a
                  href="/terms-of-service"
                  className="text-indigo-600 hover:underline"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy-policy"
                  className="text-indigo-600 hover:underline"
                >
                  Privacy Policy
                </a>
                .
              </div>

              <div className="text-center mt-6">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={onLoginClick}
                    className="text-indigo-600 font-bold hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default SignUp;
