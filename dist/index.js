// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";
var SPRING_BOOT_URL = process.env.SPRING_BOOT_URL || "http://localhost:8080";
async function registerRoutes(app2) {
  app2.use("/api/*", async (req, res) => {
    try {
      const apiPath = req.originalUrl.replace("/api", "");
      const url = `${SPRING_BOOT_URL}${apiPath}`;
      const headers = {};
      Object.keys(req.headers).forEach((key) => {
        if (key !== "host" && key !== "connection") {
          const value = req.headers[key];
          if (typeof value === "string") {
            headers[key] = value;
          } else if (Array.isArray(value)) {
            headers[key] = value.join(", ");
          }
        }
      });
      if (["POST", "PUT", "PATCH"].includes(req.method) && !headers["content-type"]) {
        headers["content-type"] = "application/json";
      }
      if (req.headers.cookie) {
        headers.cookie = req.headers.cookie;
      }
      if (req.headers.authorization) {
        headers.authorization = req.headers.authorization;
      }
      if (req.headers["x-xsrf-token"]) {
        headers["x-xsrf-token"] = req.headers["x-xsrf-token"];
      }
      if (req.headers["x-csrf-token"]) {
        headers["x-csrf-token"] = req.headers["x-csrf-token"];
      }
      const options = {
        method: req.method,
        headers,
        credentials: "include"
        // Important for cookie handling
      };
      if (["POST", "PUT", "PATCH"].includes(req.method) && req.body) {
        options.body = JSON.stringify(req.body);
      }
      const response = await fetch(url, options);
      const rawHeaders = response.headers.raw ? response.headers.raw() : {};
      const setCookieHeaders = rawHeaders["set-cookie"];
      if (setCookieHeaders && Array.isArray(setCookieHeaders)) {
        res.setHeader("Set-Cookie", setCookieHeaders);
      } else if (response.headers.get("set-cookie")) {
        res.setHeader("Set-Cookie", response.headers.get("set-cookie"));
      }
      const headersToForward = ["content-type", "x-xsrf-token", "x-csrf-token", "authorization"];
      headersToForward.forEach((headerName) => {
        const headerValue = response.headers.get(headerName);
        if (headerValue) {
          res.setHeader(headerName, headerValue);
        }
      });
      if (response.status === 204 || response.headers.get("content-length") === "0") {
        return res.status(response.status).end();
      }
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        const data = await response.json();
        return res.status(response.status).json(data);
      } else {
        const text = await response.text();
        return res.status(response.status).send(text);
      }
    } catch (error) {
      console.error("Proxy error:", error);
      if (error instanceof Error && error.message.includes("fetch failed")) {
        return res.status(503).json({
          error: "Backend service unavailable",
          message: "Unable to connect to Spring Boot backend. Please ensure it's running on port 8080 (or set SPRING_BOOT_URL environment variable).",
          details: error.message
        });
      }
      return res.status(500).json({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error occurred"
      });
    }
  });
  app2.get("/health", (req, res) => {
    res.json({
      status: "ok",
      frontend: "running",
      backend: SPRING_BOOT_URL,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      note: "Frontend is ready. Connect your Spring Boot backend to " + SPRING_BOOT_URL
    });
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
