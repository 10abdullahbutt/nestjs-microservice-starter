module.exports = {
  apps: [
    {
      name: 'User Service',
      script: 'dist/main.js', // Update the path based on your Nest.js project structure
      // instances: 1,
      // autorestart: true,
      // watch: false,
      // max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
}
