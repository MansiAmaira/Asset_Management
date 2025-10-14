import type { Express } from "express";
import { createServer, type Server } from "http";

// Spring Boot backend URL - adjust this based on your Spring Boot configuration
const SPRING_BOOT_URL = process.env.SPRING_BOOT_URL || "http://localhost:8080";

export async function registerRoutes(app: Express): Promise<Server> {
  // Proxy all /api requests to Spring Boot backend
  app.use("/api/*", async (req, res) => {
    try {
      const apiPath = req.originalUrl.replace("/api", "");
      const url = `${SPRING_BOOT_URL}${apiPath}`;
      
      // Forward all headers from the original request
      const headers: Record<string, string> = {};
      
      // Copy all headers except host and connection
      Object.keys(req.headers).forEach((key) => {
        if (key !== 'host' && key !== 'connection') {
          const value = req.headers[key];
          if (typeof value === 'string') {
            headers[key] = value;
          } else if (Array.isArray(value)) {
            headers[key] = value.join(', ');
          }
        }
      });

      // Ensure Content-Type is set for JSON requests
      if (["POST", "PUT", "PATCH"].includes(req.method) && !headers['content-type']) {
        headers['content-type'] = 'application/json';
      }

      // Forward cookies for session management
      if (req.headers.cookie) {
        headers.cookie = req.headers.cookie;
      }

      // Forward authentication headers (Authorization, XSRF tokens, etc.)
      if (req.headers.authorization) {
        headers.authorization = req.headers.authorization as string;
      }

      // Forward CSRF/XSRF tokens if present
      if (req.headers['x-xsrf-token']) {
        headers['x-xsrf-token'] = req.headers['x-xsrf-token'] as string;
      }
      if (req.headers['x-csrf-token']) {
        headers['x-csrf-token'] = req.headers['x-csrf-token'] as string;
      }

      const options: RequestInit = {
        method: req.method,
        headers,
        credentials: 'include', // Important for cookie handling
      };

      // Add body for POST, PUT, PATCH requests
      if (["POST", "PUT", "PATCH"].includes(req.method) && req.body) {
        options.body = JSON.stringify(req.body);
      }

      const response = await fetch(url, options);
      
      // Forward ALL Set-Cookie headers from Spring Boot to client
      // Spring Boot typically sends multiple cookies (JSESSIONID, XSRF-TOKEN, etc.)
      // We need to use raw() to get all Set-Cookie headers, not just the first one
      const rawHeaders = (response.headers as any).raw ? (response.headers as any).raw() : {};
      const setCookieHeaders = rawHeaders['set-cookie'];
      if (setCookieHeaders && Array.isArray(setCookieHeaders)) {
        res.setHeader('Set-Cookie', setCookieHeaders);
      } else if (response.headers.get('set-cookie')) {
        // Fallback for single Set-Cookie header
        res.setHeader('Set-Cookie', response.headers.get('set-cookie')!);
      }

      // Forward other important headers
      const headersToForward = ['content-type', 'x-xsrf-token', 'x-csrf-token', 'authorization'];
      headersToForward.forEach((headerName) => {
        const headerValue = response.headers.get(headerName);
        if (headerValue) {
          res.setHeader(headerName, headerValue);
        }
      });

      // Handle empty responses (like DELETE operations)
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
      
      // Check if Spring Boot backend is unreachable
      if (error instanceof Error && error.message.includes("fetch failed")) {
        return res.status(503).json({
          error: "Backend service unavailable",
          message: "Unable to connect to Spring Boot backend. Please ensure it's running on port 8080 (or set SPRING_BOOT_URL environment variable).",
          details: error.message,
        });
      }

      return res.status(500).json({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  });

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.json({ 
      status: "ok", 
      frontend: "running",
      backend: SPRING_BOOT_URL,
      timestamp: new Date().toISOString(),
      note: "Frontend is ready. Connect your Spring Boot backend to " + SPRING_BOOT_URL,
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
