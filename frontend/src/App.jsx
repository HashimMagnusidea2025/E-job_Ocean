import './style/style.css';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/layout/navbar/navbar';
import Footer from './components/layout/footer/footer';
import Home from './pages/home/home';
import Placementapge from './pages/PlacementProgrampage/PlacementProgram';

import JobDetailsPage from './pages/JobDetailspage/JobDetailspage.jsx';
import WebinarspageList from './pages/Webinars/Webinars';
import WebinarDetailsPage from './pages/Webinars/webinarDetilasPage.jsx';

import HallOfFamepage from './pages/HallOfFamepage/HallOfFamepage';
import LiveMentorShipPage from './pages/LiveMentorshippage/Live Mentorshippage';
import CoursesPage from './pages/coursespage/coursespage';
import ComboIncludesPage from './pages/comboIncludespage/comboIncludespage';

import EmployerDashboard from './components/employerDashboard/employerDashboard';
// import ViewPublicProfile from './components/seekerDashboard/View-Public-Profile';
import TestimonialsPage from './pages/TESTIMONIALSPAGE/testimonialspage.jsx';
import AboutUs from './pages/AboutUs/AboutUspage';
import BlogsPage from './pages/Blogspage/Blogspage';
import BlogDetailsPage from './pages/Blogspage/blogdetailpage.jsx';
import BlogDetailsPage2 from './pages/Blogspage/blogdetailpage2.jsx';
import Dashboard from './components/AdminDashboard/Admindashborard';
import CaFreshersForm from './components/layout/section/CaFreshersForm/CaFreshersForm';
import Login from './components/layout/section/login/login';

import KnowledgeBasePage from './pages/KnowledgeBasePage/KnowledgeBasePage.jsx';
import KnowledgeBaseRegisterList from './components/AdminDashboard/KnowledgeBaseRegisterList/KnowledgeBaseRegisterList.jsx';




import JobSeekerRegister from './components/layout/JobSeekerRegister/JobSeekerRegister.jsx';
import CompanyRegister from './components/layout/CompanyRegister/CompanyRegister.jsx';


// seeker dashborad inner file //
import ProfileForm from './components/seekerDashboard/editProfile.jsx';
import BuildResume from './components/seekerDashboard/BuildResume.jsx';
import PrintResume from './components/seekerDashboard/PrintResume.jsx';
import ViewPublicProfile from './components/seekerDashboard/View-Public-Profile';
import MyJobAplications from './components/seekerDashboard/myJobAplications.jsx';
import MYJobAlerts from './components/seekerDashboard/MyJobAlerts.jsx';
import MyMessages from './components/seekerDashboard/MyMessages.jsx';
import MyFevoriteJob from './components/seekerDashboard/myFevoriteJobs.jsx';
import MyFollowings from './components/seekerDashboard/myFollowings.jsx';

// Employer dashoard inner file //
import EditAccountDetails from './components/employerDashboard/editAccountDetails.jsx';
import CompanyPublicProfile from './components/employerDashboard/companyPublicProfile.jsx';
import PostAJob from './components/employerDashboard/postAJob.jsx';
import ManageJobs from './components/employerDashboard/ManageJobs.jsx';
import PurchasedCvsPackage from './components/employerDashboard/CvsSearchPackages.jsx';
import PaymentHistory from './components/employerDashboard/paymentHistory.jsx';
import UnlockedUsers from './components/employerDashboard/unlockedUsers.jsx';
import CompanyFollowers from './components/employerDashboard/companyFollowers.jsx';
import JobCandidates from './components/employerDashboard/JobCandidates.jsx';

// Admin dashoard inner file //
import AdminLogin from './components/AdminDashboard/adminlogin/adminlogin.jsx';
import AdminDash from './components/AdminDashboard/admin-dash.jsx';
import RolesPage from './components/AdminDashboard/rolepage/rolepage';
import UsersPage from './components/AdminDashboard/userspage/userspage';
import PermissionsPage from './components/AdminDashboard/PermissionsPage/PermissionsPage';
import CourseCategoryPage from './components/AdminDashboard/OurCoursesCategory/OurCoursesCategory.jsx';
import GeneralSettings from './components/AdminDashboard/generalSettings/generalSettings.jsx';
import ProfessionalCategoryPage from './components/AdminDashboard/ProfessionalCategory/ProfessionalCategory.jsx';
import LocationPage from './components/AdminDashboard/location/location.jsx';
import SkillsCategoryPage from './components/AdminDashboard/SkillsCategory/SkillsCategory.jsx';
import CareerCategoryPage from './components/AdminDashboard/CareerLevelCategory/CareerLevelCategory.jsx';
import FunctionalAreaCategory from './components/AdminDashboard/FunctionalAreaCategory/FunctionalAreaCategory.jsx';
import JobTypeCategoryPage from './components/AdminDashboard/jobTypeCategory/jobTypeCategory.jsx';
import JobShiftCategoryPage from './components/AdminDashboard/jobShiftCategory/jobShiftCategory.jsx';
import DegreeLevelCategoryPage from './components/AdminDashboard/DegreeLevelCategory/DegreeLevelCategory.jsx';
import DegreeTypeCategoryPage from './components/AdminDashboard/DegreeTypeCategory/DegreeTypeCategory.jsx';
import CompanyCategoryPage from './components/AdminDashboard/CompanyCategory/CompanyCategory.jsx';
import OwnershipCategoryPage from './components/AdminDashboard/OwnershipCategory/OwnershipCategory.jsx';
import NoofOfficeCategoryPage from './components/AdminDashboard/NoofOfficeCategory/NoofOfficeCategory.jsx';
import NoofEmployeescCategoryPage from './components/AdminDashboard/noofemployeescategory/NoofEmployeescCategory.jsx'
import EstabilishedInategoryPage from './components/AdminDashboard/EstabilishedInCategory/EstabilishedInCategory.jsx';
import CAFresherListPage from './components/AdminDashboard/CAFresherListPage/CAFresherListPage.jsx'
import SpeakerDetailsPage from './pages/HallOfFamepage/SpeakerDetailsPage.jsx';

import RegisterHallOfFame from './pages/HallOfFamepage/RegisterHallOfFame.jsx';
import WebinarRegistrationList from './components/AdminDashboard/webinarRegistrationList/RegistrationList.jsx';
import OneToOneRegistrationList from './components/AdminDashboard/OneToOneRegistrationList/OneToOneRegistrationList.jsx';
import PaymentReceiptOneToOne from './components/ui/PaymentReceipt/PaymentReceiptOnetoOne.jsx';
import PostAJobAdmin from './components/AdminDashboard/jobPostadmin/jobPostadmin.jsx'
// Create Company
import CreateCompany from './components/AdminDashboard/createCompany/createCompany.jsx';
import BecomeAMentorRegisterList from './components/AdminDashboard/BecomeAMentorRegisterList/BecomeAMentorRegisterList.jsx';

import {
  ProtectedAdminRoute,
  ProtectedSeekerRoute,
  ProtectedEmployerRoute,
  ProtectedMentorRoute
} from "./ProtectedAdminRoute.jsx";

import Dash from './components/seekerDashboard/dash.jsx';
import EmployerDash from './components/employerDashboard/employerdash.jsx';

import Speakerpage from './components/AdminDashboard/SpeakersPage/Speakerpage.jsx';
import AddWebinarPage from './components/AdminDashboard/WebinarPage/WebinarPage.jsx';
import AdminOneToOneForm from './components/AdminDashboard/OneToOneForm/OneToOneForm.jsx';
import OneToOneList from './components/AdminDashboard/OneToOneForm/OneToOneList.jsx';
import CMSPage from './components/AdminDashboard/CMSPage/CMSPage.jsx';
import JobPostList from './components/AdminDashboard/JobPostList/JobPostList.jsx';
import JobRegisterList from './components/AdminDashboard/jobRegisterList/JobRegisterList.jsx';
import KnowledgeBaseForm from './components/AdminDashboard/KnowledgeBaseForm/KnowledgeBaseForm.jsx';
import KnowledgeBaseList from './components/AdminDashboard/KnowledgeBaseList/KnowledgeBaseList.jsx';
import BecomeAMentorRegister from './pages/BecomeAMentorRegister/BecomeAMentorRegister.jsx'

// import SeekerDashboard from './components/seekerDashboard/seekerDashboard';


import PaymentReceipt from "./components/ui/PaymentReceipt/PaymentReceipt.jsx";
import ForgotPassword from './pages/ForgotPassword/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword/ResetPassword.jsx';

// Mentor Dashborad file

import MentorDashboard from './components/MentorDashboard/MentorDashboard.jsx';
import MentorOneToOneForm from './components/MentorDashboard/MentorOneToOneForm/MentorOneToOneForm.jsx';
import MentorSessionsList from './components/MentorDashboard/SessionsListMentor/SessionsListMentor.jsx';
import EditMentorDetails from './components/MentorDashboard/editMentorDetilas/editMentorDetilas.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<><Home /></>} />
        <Route path='/courses' element={<><CoursesPage /></>} />
        <Route path="/placement-program" element={<><Placementapge /></>} />
        <Route path="/job-details/:id" element={<><Navbar /><JobDetailsPage /><Footer /></>} />

        <Route path="/webinars" element={<><WebinarspageList /></>} />
        <Route path="/webinars/:id" element={<WebinarDetailsPage />} />


        <Route path="/hall-of-fame" element={<><Navbar /><HallOfFamepage /><Footer /></>} />
        <Route path="/hall-of-fame/:speakerId" element={<><Navbar /><SpeakerDetailsPage /><Footer /></>} />
        <Route path="/hall-of-fame/register" element={<><RegisterHallOfFame /></>} />

        <Route path='/live-mentorship' element={<><Navbar /><LiveMentorShipPage /><Footer /></>} />
        <Route path='/combo-page' element={<><Navbar /><ComboIncludesPage /><Footer /></>} />
        <Route path='/testimonials-page' element={<><Navbar /><TestimonialsPage /><Footer /></>} />
        <Route path='/become-a-mentor' element={<><Navbar /><BecomeAMentorRegister /><Footer /></>} />
        <Route path='/about-us' element={<><Navbar /><AboutUs /><Footer /></>} />
        <Route path='/blogs' element={<><BlogsPage /></>} />
        <Route path='/blogs' element={<><BlogDetailsPage /></>} />
        <Route path='/blogs/:id' element={<><BlogDetailsPage2 /></>} />
        <Route path="/blogs/category/:categoryId" element={<BlogDetailsPage2 />} />

        <Route path='/knowledge-base' element={<><Navbar /><KnowledgeBasePage /><Footer /></>} />
        <Route
          path="/payment-receipt/:webinarId"
          element={
            <>
              <Navbar />
              <PaymentReceipt />
              <Footer />
            </>
          }
        />
        {/* <Route path='/seeker-dashboard' element={<><Navbar /><SeekerDashboard /><Footer /></>} /> */}
        {/* <Route path='/employer-dashboard' element={<><Navbar /><EmployerDashboard /><Footer /></>} /> */}


        {/* <Route
          path="/seeker-dashboard"
          element={
            <ProtectedSeekerRoute>
              <Navbar />
              <SeekerDashboard />
            </ProtectedSeekerRoute>
          }
        /> */}

        {/* Seeker-dashboard  Routes */}
        <Route path='/seeker-dashboard' element={<>
          <ProtectedSeekerRoute>
            <Dash />
          </ProtectedSeekerRoute>
        </>} />
        {/* Seeker-dashboard inner Routes */}
        <Route path='/seeker-dashboard/my-profile' element={<><ProfileForm /></>} />
        <Route path='/seeker-dashboard/build-resume' element={<><BuildResume /></>} />
        <Route path='/seeker-dashboard/resume' element={<><PrintResume /></>} />
        <Route path='/seeker-dashboard/view-Public-Profile' element={<><ViewPublicProfile /></>} />
        <Route path='/seeker-dashboard/my-job-applications' element={<><MyJobAplications /></>} />
        <Route path='/seeker-dashboard/my-favourite-jobs' element={<><MyFevoriteJob /></>} />
        <Route path='/seeker-dashboard/my-alerts' element={<><MYJobAlerts /></>} />
        <Route path='/seeker-dashboard/my-messages' element={<><MyMessages /></>} />
        <Route path='/seeker-dashboard/my-followings' element={<><MyFollowings /></>} />


        {/* <Route
          path="/Employer-dashboard"
          element={
            <ProtectedEmployerRoute>
              <Navbar />
              <EmployerDashboard />
            </ProtectedEmployerRoute>
          }
        /> */}
        <Route path='/employer-dashboard' element={<>
          <ProtectedEmployerRoute>
            <EmployerDash />
          </ProtectedEmployerRoute></>} />
        {/* Employer-dashboard inner Routes */}

        <Route path="/employer-dashboard/edit/company-profile" element={<EditAccountDetails />} />
        <Route path='/employer-dashboard/company-profile' element={<><CompanyPublicProfile /></>} />
        <Route path='/employer-dashboard/post-job' element={<><PostAJob /></>} />
        <Route path="/employer-dashboard/post-job/:id" element={<PostAJob />} />
        <Route path='/employer-dashboard/posted-jobs' element={<><ManageJobs /></>} />
        <Route path='/employer-dashboard/company-packages' element={<><PurchasedCvsPackage /></>} />
        <Route path='/employer-dashboard/list-payment-history' element={<><PaymentHistory /></>} />
        <Route path='/employer-dashboard/unloced-seekers' element={<><UnlockedUsers /></>} />
        <Route path='/employer-dashboard/company-messages' element={<></>} />
        <Route path='/employer-dashboard/company-followers' element={<><CompanyFollowers /></>} />
        <Route path="/employer-dashboard/job-candidates/:jobId" element={<JobCandidates />} />




        {/* Mentor-Dashboard Route */}
        <Route path='/mentor-dashboard' element={<>
          <ProtectedMentorRoute>
            <MentorDashboard />
          </ProtectedMentorRoute></>} />

        <Route path='/mentor-dashboard/edit-mentor-details' element={<><EditMentorDetails /></>} />
        <Route path='/mentor-dashboard/add-mentor-session' element={<><MentorOneToOneForm /></>} />
        <Route path='/mentor-dashboard/mentor-session-list' element={<><MentorSessionsList /></>} />




        <Route path='/admin-login' element={<><AdminLogin /></>} />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedAdminRoute>
              <Dashboard />
            </ProtectedAdminRoute>
          }
        />
        {/* Admin-dashboard inner Routes */}

        <Route path='/admin-dash' element={<><AdminDash /></>} />
        <Route path='/admin-dashboard/ca-fresher-list' element={<><CAFresherListPage /></>} />

        <Route path='/admin-dashboard/role-list' element={<><RolesPage /></>} />
        <Route path='/admin-dashboard/user-list' element={<><UsersPage /></>} />
        <Route path='/admin-dashboard/permission-list' element={<><PermissionsPage /></>} />
        <Route path='/admin-dashboard/course-category' element={<><CourseCategoryPage /></>} />
        <Route path='/admin-dashboard/general-settings' element={<><GeneralSettings /></>} />
        {/* <Route path='/admin-dashboard/navigation-menu' element={<><UsersPage /></>} /> */}
        {/* <Route path='/admin-dashboard/CMS-page' element={<><UsersPage /></>} /> */}
        {/* <Route path='/admin-dashboard/gallery-category' element={<><UsersPage /></>} /> */}
        {/* <Route path='/admin-dashboard/FAQ-category' element={<><UsersPage /></>} /> */}
        <Route path='/admin-dashboard/proffessional-category' element={<><ProfessionalCategoryPage /></>} />
        <Route path='/admin-dashboard/location-category' element={<><LocationPage /></>} />
        <Route path='/admin-dashboard/skills-category' element={<><SkillsCategoryPage /></>} />
        <Route path='/admin-dashboard/career-level-category' element={<><CareerCategoryPage /></>} />
        <Route path='/admin-dashboard/functional-area-category' element={<><FunctionalAreaCategory /></>} />
        <Route path='/admin-dashboard/job-type-category' element={<><JobTypeCategoryPage /></>} />
        <Route path='/admin-dashboard/job-shift-category' element={<><JobShiftCategoryPage /></>} />
        <Route path='/admin-dashboard/degree-level-category' element={<><DegreeLevelCategoryPage /></>} />
        <Route path='/admin-dashboard/degree-type-category' element={<><DegreeTypeCategoryPage /></>} />

        {/* Company profile Routes */}
        <Route path='/admin-dashboard/create-company' element={<><CreateCompany /></>} />
        <Route path='/admin-dashboard/company-category' element={<><CompanyCategoryPage /></>} />
        <Route path='/admin-dashboard/ownership-category' element={<><OwnershipCategoryPage /></>} />
        <Route path='/admin-dashboard/no-of-office-category' element={<><NoofOfficeCategoryPage /></>} />
        <Route path='/admin-dashboard/no-of-employees-category' element={<><NoofEmployeescCategoryPage /></>} />
        <Route path='/admin-dashboard/established-in-category' element={<><EstabilishedInategoryPage /></>} />


        {/* <Route path='/admin-dashboard/course-management' element={<><UsersPage /></>} /> */}

        {/* Founded Year */}

        <Route path='/company-Information/:id' element={<EditAccountDetails />} />
        <Route path='/job-seeker-register' element={<><Navbar /><JobSeekerRegister /></>} />
        <Route path='/company-register' element={<><Navbar /><CompanyRegister /></>} />

        <Route path='/login' element={<><Login /></>} />
        <Route path='/forgot-password' element={<><Navbar /><ForgotPassword /><Footer /></>} />
        <Route path='/reset-password/:token' element={<><Navbar /><ResetPassword /><Footer /></>} />

        <Route path='/ca-register' element={<><CaFreshersForm /></>} />

        <Route path='/admin-dashboard/add-speakers' element={<><Speakerpage /></>} />
        <Route path='/admin-dashboard/add-webinar' element={<><AddWebinarPage /></>} />
        <Route path='/admin-dashboard/webinar-registration-list' element={<><WebinarRegistrationList /></>} />
        <Route path='/admin-dashboard/one-to-one-registration-list' element={<><OneToOneRegistrationList /></>} />
        <Route path="/one-to-one-receipt/:oneToOneId" element={<><Navbar /><PaymentReceiptOneToOne /><Footer /></>} />
        <Route path="/admin-dashboard/post-job/:id" element={<PostAJobAdmin />} />
        <Route path='/admin-dashboard/job-post' element={<><PostAJobAdmin /></>} />

        <Route path='/admin-dashboard/add-one-to-one' element={<><AdminOneToOneForm /></>} />
        <Route path='/admin-dashboard/one-to-one-list' element={<><OneToOneList /></>} />
        <Route path='/admin-dashboard/cms-page' element={<><CMSPage /></>} />
        <Route path='/admin-dashboard/job-post-list' element={<><JobPostList /></>} />
        <Route path='/admin-dashboard/job-register-list' element={<><JobRegisterList /></>} />
        <Route path='/admin-dashboard/knowledge-baseform' element={<><KnowledgeBaseForm /></>} />
        <Route path='/admin-dashboard/knowledge-baseform/:id' element={<><KnowledgeBaseForm /></>} />
        <Route path='/admin-dashboard/knowledge-base-list' element={<><KnowledgeBaseList /></>} />
        <Route path="/admin/knowledge-base-registers" element={<KnowledgeBaseRegisterList />} />
        <Route path="/admin/become-a-mentor-registerList" element={<BecomeAMentorRegisterList />} />






      </Routes>

    </BrowserRouter>
  );
}

export default App;
