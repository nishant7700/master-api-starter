module.exports = {
  apps: [
    {
      name: "ats-api",
      cwd: "/var/www/ats-api",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
