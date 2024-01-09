module.exports = {
  apps: [
    {
      name: "JCWD-2504-01", // Format JCWD-{batchcode}-{groupnumber}
      script: "./projects/server/src/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 5401,
      },
      time: true,
    },
  ],
};
