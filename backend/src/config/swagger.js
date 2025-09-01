// src/config/swagger.js
export const swaggerDocs = {
  openapi: "3.0.0",
  info: {
    title: "Admin Panel API",
    version: "1.0.0",
    description: "Centralized Swagger docs for all routes",
  },
  servers: [
    { url: "http://localhost:5000/api" }
  ],
  paths: {
    // 🔹 Auth Routes
    "/auth/login": {
      post: {
        summary: "Login user",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string" },
                  password: { type: "string" }
                }
              }
            }
          }
        },
        responses: { 200: { description: "Login success" } }
      }
    },
    "/auth/register": {
      post: {
        summary: "Register new user",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/User" }
            }
          }
        },
        responses: { 201: { description: "User created" } }
      }
    },

    // 🔹 User Routes
    "/users": {
      get: { summary: "Get all users", tags: ["Users"], responses: { 200: { description: "Users list" } } },
      post: {
        summary: "Create user",
        tags: ["Users"],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } }
        },
        responses: { 201: { description: "User created" } }
      }
    },

    // 🔹 Roles Routes
    "/roles": {
      get: { summary: "Get all roles", tags: ["Roles"], responses: { 200: { description: "List of roles" } } },
      post: {
        summary: "Create role",
        tags: ["Roles"],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Role" } } }
        },
        responses: { 201: { description: "Role created" } }
      }
    },

    // 🔹 Permissions
    "/permissions": {
      get: { summary: "Get all permissions", tags: ["Permissions"], responses: { 200: { description: "List of permissions" } } }
    },

    // 🔹 Course Categories
    "/course-category": {
      get: { summary: "Get all course categories", tags: ["Courses"], responses: { 200: { description: "List of course categories" } } }
    },

    // 🔹 CMS
    "/cmspage": {
      get: { summary: "Get CMS pages", tags: ["CMS"], responses: { 200: { description: "List of CMS pages" } } }
    },

    // 🔹 General Settings
    "/general-settings": {
      get: { summary: "Get General Settings", tags: ["Settings"], responses: { 200: { description: "General settings data" } } }
    },

    // 🔹 Countries
    "/country": {
      get: { summary: "Get all countries", tags: ["Countries"], responses: { 200: { description: "List of countries" } } }
    },

    // 🔹 Professional Categories
    "/professional-categories": {
      get: { summary: "Get professional categories", tags: ["Professional Categories"], responses: { 200: { description: "List of professional categories" } } }
    },

    // 🔹 Location
    "/location": {
      get: { summary: "Get all locations", tags: ["Location"], responses: { 200: { description: "List of locations" } } }
    },

    // 🔹 CA Freshers
    "/CA-Fresher": {
      get: { summary: "Get CA Fresher data", tags: ["CA Freshers"], responses: { 200: { description: "List of CA Freshers" } } }
    },

    // 🔹 Company Information
    "/Company-Information": {
      get: { summary: "Get company information", tags: ["Company Info"], responses: { 200: { description: "Company Info" } } }
    },

    // 🔹 Skills
    "/skills-categories": {
      get: { summary: "Get skills categories", tags: ["Skills"], responses: { 200: { description: "List of skills categories" } } }
    },

    // 🔹 Career
    "/career-categories": {
      get: { summary: "Get career categories", tags: ["Career"], responses: { 200: { description: "List of career categories" } } }
    },

    // 🔹 Functional Area
    "/functionalArea-Category": {
      get: { summary: "Get functional areas", tags: ["Functional Area"], responses: { 200: { description: "List of functional areas" } } }
    },

    // 🔹 Job Type
    "/job-Type-category": {
      get: { summary: "Get job types", tags: ["Job Type"], responses: { 200: { description: "List of job types" } } }
    },

    // 🔹 Job Shift
    "/job-Shift-category": {
      get: { summary: "Get job shifts", tags: ["Job Shift"], responses: { 200: { description: "List of job shifts" } } }
    },

    // 🔹 Degree Level
    "/degree-Level-Category": {
      get: { summary: "Get degree levels", tags: ["Degree Level"], responses: { 200: { description: "List of degree levels" } } }
    },

    // 🔹 Company Category
    "/company-category": {
      get: { summary: "Get company categories", tags: ["Company Category"], responses: { 200: { description: "List of company categories" } } }
    },

    // 🔹 No of Office Category
    "/no-of-office-Category": {
      get: { summary: "Get office counts", tags: ["Office Count"], responses: { 200: { description: "List of office count categories" } } }
    },

    // 🔹 Ownership Category
    "/ownership-category": {
      get: { summary: "Get ownership categories", tags: ["Ownership"], responses: { 200: { description: "List of ownership categories" } } }
    },
  },

  // 🔹 Components (Schemas)
  // components: {
  //   schemas: {
  //     User: {
  //       type: "object",
  //       properties: {
  //         firstname: { type: "string" },
  //         lastname: { type: "string" },
  //         email: { type: "string" },
  //         password: { type: "string" },
  //         roleId: { type: "string" },
  //       },
  //     },
  //     Role: {
  //       type: "object",
  //       properties: {
  //         name: { type: "string" },
  //         description: { type: "string" },
  //         status: { type: "string", enum: ["active", "inactive"] },
  //       },
  //     },
  //   },
  // },
};
