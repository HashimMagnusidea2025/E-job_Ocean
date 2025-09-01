import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from "swagger-ui-express";
import { swaggerDocs } from "./src/config/swagger.js";

import express from 'express';
import  connectDB  from './src/config/mongoose.js';
import UserRouter from './src/routes/user.Routes.js';
import AuthRoutes from './src/routes/auth.Routes.js';
import roleRoutes from './src/routes/role.Routes.js';
import permissionRoutes from './src/routes/permission.routes.js';
import Courserouter from './src/routes/CoursesCategory.Routes.js';
import CMSRouter from './src/routes/CMS.Routes.js';
import generalSettingsRoute from './src/routes/generalsettings.Routes.js';
import CountryRouter from './src/routes/countries.Routes.js';
import StateRouter from './src/routes/State.Routes.js';
import CityRouter from './src/routes/city.Routes.js'
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
import EstablishedInCategoryRouter from './src/routes/EstablishedInCategory.Routes.js';
// Company profile //
import CompanyCategoryRouter from './src/routes/CompanyCategory.Routes.js';
import OwnershipCategoryRouter from './src/routes/OwnershipCategory.Routes.js'
import NoofOfficeCategoryRouter from './src/routes/NoofOfficeCategory.Routes.js';
import NoofEmployeesCategoryRouter from './src/routes/NoofEmployeesCategory.Routes.js';
// import FoundedYearCategoryRouter from './src/routes/FoundedYearCategory.Routes.js';



import cors from 'cors';
import dotenv from 'dotenv'
dotenv.config();


const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
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
  methods: ['GET', 'POST', 'PUT',"PATCH", 'DELETE'],
  credentials: true
}));

server.use("/api/auth", AuthRoutes);
server.use("/api/users", UserRouter);
server.use("/api/roles", roleRoutes);         
server.use("/api/permissions", permissionRoutes);
server.use('/api/course-category', Courserouter);
server.use('/api/cmspage' ,CMSRouter);
server.use('/api/general-settings', generalSettingsRoute);
server.use('/api/country', CountryRouter);
server.use('/api/state',StateRouter);
server.use('/api/city', CityRouter);
server.use('/api/professional-categories',ProfessionalCategoryRouter);
server.use('/api/location', LocationRouter);
server.use('/api/CA-Fresher', CaFresherRouter);
server.use('/api/Company-Information', CompanyInformationRouter)
server.use("/api/skills-categories", skillsCategoryRoutes);
server.use('/api/career-level-category', CareerLevelCategoryRouter);
server.use('/api/functionalArea-Category', FunctionalAreaCategoryRouter);
server.use('/api/job-Type-category',  jobTypeCategoryRouter);
server.use('/api/job-Shift-category', jobShiftCategoryRouter)
server.use('/api/degree-Level-Category', DegreeLevelCategoryRouter);

// Company profile //
server.use('/api/company-category', CompanyCategoryRouter);
server.use('/api/ownership-category' ,OwnershipCategoryRouter);
server.use('/api/no-of-office-category',NoofOfficeCategoryRouter);
server.use('/api/no-of-employees-category', NoofEmployeesCategoryRouter);
server.use('/api/established-in-category', EstablishedInCategoryRouter)
// server.use('/api/founded-year-category', FoundedYearCategoryRouter)






// filterOptionRoutes // 
server.use("/api", filterOptionRouter);

server.post("/test", (req, res) => {
    console.log("Request body:", req.body);
    res.send(req.body);
});


server.listen(process.env.PORT, () => {

    console.log("server running on Port", process.env.PORT);
    connectDB()

})

