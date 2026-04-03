import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import SetupForm from "./pages/CreateInterview";
import Interview from "./pages/Interview";
import InterviewReport from "./pages/Report";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Resources from "./pages/Resources";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Animated404 from "./pages/404";
import Aptitude from "./pages/Aptitude";
import AptitudeTest from "./pages/AptitudeTest";
import AptitudeResult from "./pages/AptitudeResult";
import CodingPractice from "./pages/CodingPractice";
import CodingChallenge from "./pages/CodingChallenge";
import ResumeScorer from "./pages/ResumeScorer";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <SignUp /> },
      { path: "interview/setup", element: <ProtectedRoute><SetupForm /></ProtectedRoute> },
      { path: "interview/:interviewId", element: <ProtectedRoute><Interview /></ProtectedRoute> },
      { path: "interview/report/:interviewId", element: <ProtectedRoute><InterviewReport /></ProtectedRoute> },
      { path: "dashboard", element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
      { path: "profile", element: <ProtectedRoute><Profile /></ProtectedRoute> },
      { path: "resources", element: <Resources /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      // ── New Feature Routes ────────────────────────────────
      { path: "aptitude", element: <ProtectedRoute><Aptitude /></ProtectedRoute> },
      { path: "aptitude/test", element: <ProtectedRoute><AptitudeTest /></ProtectedRoute> },
      { path: "aptitude/result", element: <ProtectedRoute><AptitudeResult /></ProtectedRoute> },
      { path: "coding-practice", element: <ProtectedRoute><CodingPractice /></ProtectedRoute> },
      { path: "coding-practice/challenge", element: <ProtectedRoute><CodingChallenge /></ProtectedRoute> },
      { path: "resume-scorer", element: <ResumeScorer /> },
      { path: "*", element: <Animated404 /> },
    ],
  },
]);

export default router;
