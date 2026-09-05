module.exports = {
  apps: [
    {
      name: 'shoppilot-ml',
      script: './venv/bin/uvicorn',
      args: 'main:app --host 0.0.0.0 --port 8000',
      cwd: './ml-service',
      interpreter: 'none'
    },
    {
      name: 'shoppilot-backend',
      script: 'server.js',
      cwd: './backend',
      env: {
        PORT: 5001
      }
    },
    {
      name: 'shoppilot-frontend',
      script: 'npm',
      args: 'run dev',
      cwd: './frontend'
    }
  ]
};
