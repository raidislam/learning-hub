export interface ProjectDef {
  slug: string;
  title: string;
  kind: "frontend" | "backend" | "fullstack";
  /** Core concepts the project exercises */
  skills: string[];
}

/** Project catalogue. Full guides (requirements, architecture, folders, steps, API/DB, tests, deploy) arrive in Phase 6. */
export const PROJECTS: ProjectDef[] = [
  { slug: "expense-tracker", title: "Interactive Expense Tracker", kind: "frontend", skills: ["DOM", "Array methods", "LocalStorage"] },
  { slug: "todo-localstorage", title: "Todo Application with LocalStorage", kind: "frontend", skills: ["Events", "State", "LocalStorage"] },
  { slug: "product-search", title: "Product Search and Filtering", kind: "frontend", skills: ["Debouncing", "filter()", "URL API"] },
  { slug: "shopping-cart", title: "Shopping Cart", kind: "frontend", skills: ["reduce()", "Immutability", "State"] },
  { slug: "api-dashboard", title: "Dashboard with API Integration", kind: "frontend", skills: ["Fetch", "async/await", "Error handling"] },
  { slug: "form-validation", title: "Form Validation System", kind: "frontend", skills: ["Forms", "FormData", "Validation"] },
  { slug: "infinite-scroll", title: "Infinite Scroll Application", kind: "frontend", skills: ["Intersection Observer", "Pagination"] },
  { slug: "task-api", title: "REST API for Task Management", kind: "backend", skills: ["Express", "REST", "Validation"] },
  { slug: "auth-system", title: "Authentication System", kind: "backend", skills: ["JWT", "Password hashing", "Middleware"] },
  { slug: "blog-api", title: "Blog API", kind: "backend", skills: ["Relations", "Pagination", "Auth"] },
  { slug: "inventory-api", title: "Inventory Management API", kind: "backend", skills: ["PostgreSQL", "Transactions"] },
  { slug: "ecommerce-backend", title: "E-commerce Backend", kind: "backend", skills: ["Prisma", "Orders", "Payments flow"] },
  { slug: "rbac", title: "Role-Based Access Control System", kind: "backend", skills: ["Authorization", "Middleware"] },
  { slug: "expense-management", title: "Expense Management System", kind: "fullstack", skills: ["Next.js", "Express", "PostgreSQL"] },
  { slug: "inventory-system", title: "Inventory Management System", kind: "fullstack", skills: ["Next.js", "REST", "Prisma"] },
  { slug: "mini-ecommerce", title: "Mini E-commerce Application", kind: "fullstack", skills: ["Cart", "Auth", "Orders"] },
];
