import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { Element } from "react-scroll"; // Import react-scroll
import ScrollToTop from "./Components/Home_Page/ScrollToTop";
import Navbar from "./Components/Home_Page/Navbar";
import Footer from "./Components/Home_Page/Footer";

// Home Page Components
import Header from "./Components/Home_Page/Header";
import LandingPage from "./Components/Home_Page/LandingPage";
import Aboutus from "./Components/Home_Page/Aboutus";
import Categories from "./Components/Home_Page/Categories";
import ReuseRecycle from "./Components/Home_Page/ReuseRecycle";
import RecyclingBenefits from "./Components/Home_Page/RecyclingBenefits";
import EventCommunity from "./Components/Home_Page/EventCommunity";
import Whatdo from "./Components/Home_Page/Whatdo";
import OurVision from "./Components/Home_Page/OurVision";
import HowItWorks from "./Components/Home_Page/HowItWorks";
import WhyChooseEcoSwap from "./Components/Home_Page/WhyChooseEcoSwap";
import SuccessStory from "./Components/Home_Page/SuccessStory";
import BlogPage from "./Components/Home_Page/BlogPage";
import NeedHelp from "./Components/Home_Page/NeedHelp";

// Auth & Blog Pages
import Login from "./Components/Home_Page/Login";
import Signup from "./Components/Home_Page/Signup";
import AllBlogs from "./Components/Home_Page/AllBlog";
import FullBlog from "./Components/Home_Page/FullBlog";

// Policy & Legal Pages
import FAQ from "./Components/Home_Page/FAQ";
import PrivacyPolicy from "./Components/Home_Page/PrivacyPolicy";
import TermsConditions from "./Components/Home_Page/TermsConditions";
import Disclaimer from "./Components/Home_Page/Disclaimer";

// User Pages
import Dashboard from "./Components/User/Dashboard";
import PersonalInfo from "./Components/User/PersonalInfo"; // Ensure correct import
import Announcement from "./Components/User/Announcement";
import ItemListing from "./Components/User/ItemListing";
import ItemSearch from "./Components/User/ItemSearch";
import EventJoining from "./Components/User/EventJoining";
import UserQuery from "./Components/User/UserQuery";
import Project from "./Components/User/Project"; // Ensure correct import
import ChatBox from "./Components/User/ChatBox"; // Ensure correct import
import ForgotPassword from "./Components/Home_Page/ForgotPassword";
import UserListedItem from "./Components/User/UserListedItem";

// Admin Pages
import AdminDashboard from "./Components/Admin/AdminDashboard";
import AdminItemShow from "./Components/Admin/AdminItemShow";
import AddAdminCoAdmin from "./Components/Admin/AddAdminCoAdmin";
import CategoryDashboard from "./Components/Admin/CategoryDashboard";
import AdminBlogPost from "./Components/Admin/AdminBlogPost";
import EventPosting from "./Components/Admin/EventPosting";
import AdminEventManagement from "./Components/Admin/AdminEventManagement";
import AdminQuery from "./Components/Admin/AdminQuery";
import AdminAnnouncement from "./Components/Admin/AdminAnnouncement";
import UserList from "./Components/Admin/User";

// Layout Component for Navbar & Footer Visibility Control
const Layout = ({ children }) => {
  const location = useLocation();
  const showNavbarFooter = [
    "/", "/faq", "/privacypolicy", "/termsandconditions", "/disclaimer", 
    "/login", "/signup", "/blog/:id", "/all-blogs"
  ].includes(location.pathname);

  return (
    <>
      {showNavbarFooter && <Navbar />}
      {children}
      {showNavbarFooter && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          {/* Home Page with Sections */}
          <Route
            path="/"
            element={
              <>
                <Header />
                <LandingPage />
                <Element name="aboutus-section"><Aboutus /></Element>
                <Element name="categories-section"><Categories /></Element>
                <Element name="recycle-section"><ReuseRecycle /></Element>
                <Element name="benefits-section"><RecyclingBenefits /></Element>
                <Element name="events-section"><EventCommunity /></Element>
                <Element name="services-section"><Whatdo /></Element>
                <Element name="mission-section"><OurVision /></Element>
                <Element name="howitworks-section"><HowItWorks /></Element>
                <Element name="whychooseus-section"><WhyChooseEcoSwap /></Element>
                <Element name="success-stories-section"><SuccessStory /></Element>
                <Element name="blog-section"><BlogPage /></Element>
                <Element name="need-help-section"><NeedHelp /></Element>
              </>
            }
          />

          {/* Admin Panel (Fixed Sidebar) */}
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<h2>Welcome to Admin Dashboard</h2>} />
          <Route path="user" element={<UserList />} />
          <Route path="itemshow" element={<AdminItemShow />} />
          <Route path="manage-admin" element={<AddAdminCoAdmin />} />
          <Route path="category" element={<CategoryDashboard />} />
          <Route path="blogpost" element={<AdminBlogPost />} />
          {/* <Route path="admincommunity" element={<AdminCommunity />} /> */}
          <Route path="eventpost" element={<EventPosting />} />
          <Route path="eventmanage" element={<AdminEventManagement />} />
          <Route path="userquery" element={<AdminQuery />} />
          <Route path="adminannouncement" element={<AdminAnnouncement />} />
        </Route>

          {/* User Dashboard & Personal Info */}
          <Route path="/dashboard" element={<Dashboard />}>
          <Route path="personal-info" element={<PersonalInfo />} />
          <Route path="itemlist" element={<ItemListing />} />
          <Route path="itemsearch" element={<ItemSearch />} />
          {/* <Route path="communitylist" element={<CommunityList />} /> */}
          <Route path="eventjoin" element={<EventJoining />} />
          <Route path="query" element={<UserQuery />} />
          <Route path="announcement" element={<Announcement />} />
          <Route path="projects" element={<Project />} />
          <Route path="chat" element={<ChatBox />} />
          <Route path="user-listed-item" element={<UserListedItem />} />
          
        </Route>

          {/* Auth Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forget-password" element={<ForgotPassword />} />

          {/* Blog Pages */}
          <Route path="/all-blogs" element={<AllBlogs />} />
          <Route path="/blog/:id" element={<FullBlog />} />

          {/* Policy & Legal Pages */}
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacypolicy" element={<PrivacyPolicy />} />
          <Route path="/termsandconditions" element={<TermsConditions />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
