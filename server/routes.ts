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
      
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // Forward authentication headers if present
      if (req.headers.authorization) {
        headers.authorization = req.headers.authorization as string;
      }

      const options: RequestInit = {
        method: req.method,
        headers,
      };

      // Add body for POST, PUT, PATCH requests
      if (["POST", "PUT", "PATCH"].includes(req.method) && req.body) {
        options.body = JSON.stringify(req.body);
      }

      const response = await fetch(url, options);
      
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
          message: "Unable to connect to Spring Boot backend. Please ensure it's running.",
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
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
