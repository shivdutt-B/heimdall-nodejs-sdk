function registerPing(app, route = "/__ping__") {
  if (!app || typeof app.get !== "function") {
    throw new Error("Please provide a valid Express app instance.");
  }

  app.get(route, (req, res) => {
    const memory = process.memoryUsage();

    res.json({
      status: "ok",
      message: "Ping successful",
      timestamp: new Date().toISOString(),
      memory: {
        heapUsed: Math.round((memory.heapUsed / 1024 / 1024) * 100) / 100,
        rss: Math.round((memory.rss / 1024 / 1024) * 100) / 100
      }
    });
  });

  console.log(`[Heimdall] Ping route registered at ${route}`);
}

module.exports = {
  ping: registerPing
};
