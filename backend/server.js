import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from "swagger-ui-express";
import { swaggerDocs } from "./src/config/swagger.js";

import express from 'express';
import connectDB from './src/config/mongoose.js';
import UserRouter from './src/routes/user.Routes.js';
import AuthRoutes from './src/routes/auth.Routes.js';
import roleRoutes from './src/routes/role.Routes.js';
import permissionRoutes from './src/routes/permission.routes.js';
import Courserouter from './src/routes/CoursesCategory.Routes.js';
import CMSRouter from './src/routes/CMS.Routes.js';
import generalSettingsRoute from './src/routes/generalsettings.Routes.js';
import CountryRouter from './src/routes/countries.Routes.js';
import StateRouter from './src/routes/State.Routes.js';
import CityRouter from './src/routes/city.Routes.js';
import ProfessionalCategoryRouter from './src/routes/ProfessionalCategory.Routes.js';
import filterOptionRouter from "./src/routes/filterOption.Routes.js";
import LocationRouter from './src/routes/location.Routes.js';
import CaFresherRouter from './src/routes/CAFreshers.Routes.js';
import CompanyInformationRouter from './src/routes/CompanyInformation.Routes.js';
import skillsCategoryRoutes from "./src/routes/SkillsCategory.Routes.js";
import CareerLevelCategoryRouter from './src/routes/careerLevelCategory.Routes.js';
import FunctionalAreaCategoryRouter from './src/routes/FunctionalAreaCategory.Routes.js';
import jobTypeCategoryRouter from './src/routes/jobTypeCategory.Routes.js';
import jobShiftCategoryRouter from './src/routes/jobShiftCategory.Routes.js';
import DegreeLevelCategoryRouter from './src/routes/DegreeLevelCategory.Routes.js';
import DegreeTypeCategoryRouter from './src/routes/DegreeTypeCategory.Routes.js';
import EstablishedInCategoryRouter from './src/routes/EstablishedInCategory.Routes.js';
// Company profile //
import CompanyCategoryRouter from './src/routes/CompanyCategory.Routes.js';
import OwnershipCategoryRouter from './src/routes/OwnershipCategory.Routes.js';
import NoofOfficeCategoryRouter from './src/routes/NoofOfficeCategory.Routes.js';
import NoofEmployeesCategoryRouter from './src/routes/NoofEmployeesCategory.Routes.js';
// import FoundedYearCategoryRouter from './src/routes/FoundedYearCategory.Routes.js';

import Googlerouter from './src/routes/googleAuth.js';
import JObPostRouter from './src/module/jobPost/jobPost.Routes.js';
import JobRegisterRoute from './src/module/JobRegister/JobRegister.Routes.js';
import LikeRoute from './src/module/likes/likes.Routes.js';
import CommentRuter from './src/module/comment/comment.Routes.js';
import ReactionRouter from './src/module/reaction/reaction.Routes.js';
// webinars file //

import SpeakerRouter from './src/module/Speaker/Speaker.Routes.js';
import WebinarRouter from './src/module/webinar/webinar.Routes.js';
import WebinarRegistrationRoute from './src/module/webinarRegistration/webinarRegistration.Routes.js';
import CMSPageRoutes from './src/module/CMSPage/CMS.Routes.js';
import CMSContentrouter from './src/module/CMSPages/CMSPages.Routes.js';
import PaymentRouter from './src/module/Payment/Payment.Routes.js';
import OneToOneRoute from './src/module/OneToOne/OneToOne.Routes.js';
import KnowlegeBaseRouter from './src/module/knowlegeBase/knowlegeBase.Routes.js';
import knowlegeBaseRegisterRouter from './src/module/knowlegeBaseRegister//knowlegeBaseRegister.Routes.js';
import SeekerInformationRouter from './src/module/seekerInformation/seekerInformation.Routes.js';
import PostOfficerouter from './src/module/PostOffice/PostOffice.Routes.js';
import buildResumeRoute from './src/module/BuildResume/BuildResume.Routes.js';
import FavoriteRoute from './src/module/favorite/favorite.Routes.js';
import JobAlertsRoute from './src/module/JobAlerts/JobAlerts.Routes.js';
import ContactRoute from './src/module/contact/contact.Routes.js';
import CourseRouter from './src/module/Course/Course.Route.js';
import OurFoundersRouter from './src/module/OurFounders/OurFounders.Routes.js';
import SocialMediaIconrouter from './src/module/SocialMediaIcon/SocialMediaIcon.Route.js';
import cors from 'cors';
import dotenv from 'dotenv'	
dotenv.config();


const server = express();
// server.use(express.json());
// server.use(express.urlencoded({ extended: true }));
server.use(express.json({ limit: '50mb' }));  // JSON payload limit
server.use(express.urlencoded({ limit: '50mb', extended: true }));  // URL-encoded limit

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
server.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log("Serving uploads from:", path.join(__dirname, "uploads"));


server.use("/api-docs", (req, res, next) => {
  console.log("✅ Swagger UI route hit:", req.url);
  next();
}, swaggerUi.serve, swaggerUi.setup(swaggerDocs));

server.use(cors({
  origin: 'http://localhost:5173',
  origin: [ "http://localhost:5173","https://site.ejobocean.in", "http://ejobocean.in"],
  methods: ['GET', 'POST', 'PUT', "PATCH", 'DELETE'],
  credentials: true
}));

server.use(express.static(path.join(__dirname, "dist")));

server.set("trust proxy", true);

server.get('/api/test', (req, res) => {
  console.log('hello');
  res.send('Hello printed in console!');
});


server.use("/api/auth", AuthRoutes);
server.use("/api/users", UserRouter);
server.use("/api/roles", roleRoutes);
server.use("/api/permissions", permissionRoutes);
server.use('/api/course-category', Courserouter);
server.use('/api/cmspage', CMSRouter);
server.use('/api/general-settings', generalSettingsRoute);
server.use('/api/cms-page', CMSPageRoutes);
server.use('/api/cms-content',CMSContentrouter);
server.use('/api/country', CountryRouter);
server.use('/api/state', StateRouter);
server.use('/api/city', CityRouter);
server.use('/api/post-offices',PostOfficerouter);
server.use('/api/professional-categories', ProfessionalCategoryRouter);
server.use('/api/location', LocationRouter);
server.use('/api/CA-Fresher', CaFresherRouter);
server.use('/api/Company-Information', CompanyInformationRouter);
server.use("/api/skills-categories", skillsCategoryRoutes);
server.use('/api/career-level-category', CareerLevelCategoryRouter);
server.use('/api/functionalArea-Category', FunctionalAreaCategoryRouter);
server.use('/api/job-Type-category', jobTypeCategoryRouter);
server.use('/api/job-Shift-category', jobShiftCategoryRouter);
server.use('/api/degree-Level-Category', DegreeLevelCategoryRouter);
server.use('/api/degree-Type-Category', DegreeTypeCategoryRouter);


// Company profile //
server.use('/api/company-category', CompanyCategoryRouter);
server.use('/api/ownership-category', OwnershipCategoryRouter);
server.use('/api/no-of-office-category', NoofOfficeCategoryRouter);
server.use('/api/no-of-employees-category', NoofEmployeesCategoryRouter);
server.use('/api/established-in-category', EstablishedInCategoryRouter);
// server.use('/api/founded-year-category', FoundedYearCategoryRouter)


server.use('/api/build-Resume',buildResumeRoute);

server.use('/api/blogs/like', LikeRoute);
server.use('/api/comment', CommentRuter);
server.use('/api/reaction', ReactionRouter);

server.use('/api/favorite',FavoriteRoute);

server.use('/api/speakers', SpeakerRouter);
server.use('/api/webinars', WebinarRouter);
server.use('/api/one-to-one', OneToOneRoute);

server.use("/api/registrations", WebinarRegistrationRoute);

server.use('/api/payment', PaymentRouter);

server.use('/api/job-post', JObPostRouter);

server.use('/api/job-register', JobRegisterRoute);

server.use('/api/knowlege-base', KnowlegeBaseRouter);
server.use('/api/knowlege-base-register', knowlegeBaseRegisterRouter);

server.use('/api/seeker', SeekerInformationRouter);

server.use('/api/job-alerts',JobAlertsRoute);

server.use('/api/google', Googlerouter);

server.use('/api/contact',ContactRoute);
server.use('/api/courses', CourseRouter);
server.use('/api/our-founders', OurFoundersRouter);

server.use('/api/social-media-icons', SocialMediaIconrouter);
// filterOptionRoutes //
server.use("/api", filterOptionRouter);

// server.post("/test", (req, res) => {
//   console.log("Request body:", req.body);
//   res.send(req.body);
// });


// server.get('/api/test', (req, res) => {
//   console.log('hello');
//   res.send('Test route working!');
// });

server.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
//  Works in Express 5+
// server.get("/*", (req, res) => {
//   res.sendFile(path.join(__dirname, "dist", "index.html"));
// });


server.listen(process.env.PORT, () => {

  console.log("server running on Port", process.env.PORT);
  connectDB()

})

