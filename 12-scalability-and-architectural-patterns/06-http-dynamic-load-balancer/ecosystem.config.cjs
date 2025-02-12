// ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: "api-service-1",
      script: "./app.js",
      args: "api-service",
      env: {
        NODE_ENV: "production",
      }
    },
    {
      name: "api-service-2",
      script: "./app.js",
      args: "api-service",
      env: {
        NODE_ENV: "production",
      }
    },
    {
      name: "webapp-service",
      script: "./app.js",
      args: "webapp-service",
      env: {
        NODE_ENV: "production",
      }
    },
    {
      name: "loadBalancer",
      script: "./loadBalancer.js",
      env: {
        NODE_ENV: "production",
      }
    }
  ]
}