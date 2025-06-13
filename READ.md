# 🛡️ heimdall-nodejs-sdk

[![npm version](https://img.shields.io/npm/v/heimdall-nodejs-sdk.svg)](https://www.npmjs.com/package/heimdall-nodejs-sdk)
[![license](https://img.shields.io/npm/l/heimdall-nodejs-sdk)](./LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/yourusername/heimdall-nodejs-sdk)](https://github.com/yourusername/heimdall-nodejs-sdk/issues)
[![GitHub stars](https://img.shields.io/github/stars/yourusername/heimdall-nodejs-sdk)](https://github.com/yourusername/heimdall-nodejs-sdk)

> Keep your backend servers **warm and monitored** with a single line of code.

`heimdall-nodejs-sdk` provides a pre-built `/__ping__` endpoint to expose memory usage and uptime metadata for free-hosted platforms like **Render**, **Railway**, **Fly.io**, and more. Designed to integrate easily and safely without allowing users to modify the response.

---

## 🚀 Features

- 🔁 Keeps servers warm via automated pinging
- 🔒 Prevents endpoint tampering
- 📊 Reports memory usage (heap & RSS)
- 🌐 Built-in CORS support
- ⚙️ Customizable endpoint path
- 🧩 Simple, plug-and-play Express support

---

## 📦 Installation

```bash
npm install heimdall-nodejs-sdk
```

---

## 🛠️ Usage

### Basic Usage

```javascript
const express = require('express');
const cors = require('cors');
const heimdall = require('heimdall-nodejs-sdk');

const app = express();

const allowedOrigins = ['https://user-frontend.com', 'https://heimdall.com'];
app.use(cors({ origin: allowedOrigins }));

// Add Heimdall ping endpoint - no need to pass CORS options again
heimdall.ping(app);

app.listen(3000, () => console.log("Server running on port 3000"));
```

### Advanced Usage

```javascript
const express = require('express');
const heimdall = require('heimdall-nodejs-sdk');

const app = express();

// Custom endpoint path and options
heimdall.ping(app, {
  path: '/health',           // Custom endpoint path (default: '/__ping__')
  cors: {                    // Custom CORS options
    origin: ['https://monitoring.example.com'],
    credentials: true
  },
  includeHeaders: true,      // Include request headers in response
  rateLimit: {              // Rate limiting options
    windowMs: 60000,        // 1 minute
    max: 100               // Max 100 requests per window
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
```

---

## 📋 API Response

When you hit the ping endpoint, you'll receive a JSON response with server metadata:

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:45.123Z",
  "uptime": 3600.45,
  "memory": {
    "rss": 52428800,
    "heapTotal": 29360128,
    "heapUsed": 18874352,
    "external": 1089024,
    "arrayBuffers": 163840
  },
  "version": "1.0.0",
  "node": "v18.17.0",
  "platform": "linux",
  "arch": "x64"
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | Always returns "ok" for successful responses |
| `timestamp` | string | ISO timestamp of the response |
| `uptime` | number | Server uptime in seconds |
| `memory.rss` | number | Resident Set Size in bytes |
| `memory.heapTotal` | number | Total heap size in bytes |
| `memory.heapUsed` | number | Used heap size in bytes |
| `memory.external` | number | External memory usage in bytes |
| `memory.arrayBuffers` | number | ArrayBuffer memory usage in bytes |
| `version` | string | Your application version (from package.json) |
| `node` | string | Node.js version |
| `platform` | string | Operating system platform |
| `arch` | string | CPU architecture |

---

## ⚙️ Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `path` | string | `'/__ping__'` | Custom endpoint path |
| `cors` | object | `undefined` | CORS configuration object |
| `includeHeaders` | boolean | `false` | Include request headers in response |
| `rateLimit` | object | `undefined` | Rate limiting configuration |
| `auth` | function | `undefined` | Custom authentication middleware |
| `customData` | function | `undefined` | Function to add custom data to response |

### Custom Data Example

```javascript
heimdall.ping(app, {
  customData: () => ({
    environment: process.env.NODE_ENV,
    buildNumber: process.env.BUILD_NUMBER,
    region: process.env.AWS_REGION
  })
});
```

---

## 🔧 Integration Examples

### With Different Frameworks

#### Koa.js
```javascript
const Koa = require('koa');
const heimdall = require('heimdall-nodejs-sdk');

const app = new Koa();
heimdall.ping(app, { framework: 'koa' });

app.listen(3000);
```

#### Fastify
```javascript
const fastify = require('fastify')({ logger: true });
const heimdall = require('heimdall-nodejs-sdk');

heimdall.ping(fastify, { framework: 'fastify' });

fastify.listen({ port: 3000 });
```

### With Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

### With PM2

```json
{
  "apps": [{
    "name": "my-app",
    "script": "server.js",
    "instances": "max",
    "exec_mode": "cluster",
    "env": {
      "NODE_ENV": "production"
    }
  }]
}
```

---

## 🌐 Platform-Specific Setup

### Render
```javascript
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
```

### Railway
```javascript
const port = process.env.PORT || 3000;
heimdall.ping(app, {
  customData: () => ({
    railway: {
      deploymentId: process.env.RAILWAY_DEPLOYMENT_ID,
      environment: process.env.RAILWAY_ENVIRONMENT
    }
  })
});
```

### Fly.io
```javascript
heimdall.ping(app, {
  customData: () => ({
    fly: {
      region: process.env.FLY_REGION,
      appName: process.env.FLY_APP_NAME
    }
  })
});
```

---

## 🔒 Security

Heimdall is designed with security in mind:

- **Read-only**: The endpoint only exposes system metadata, no sensitive data
- **No tampering**: Users cannot modify the response or inject custom data (unless explicitly configured)
- **Rate limiting**: Built-in protection against abuse
- **CORS control**: Fine-grained control over cross-origin requests
- **Authentication**: Optional custom authentication middleware

---

## 🧪 Testing

```bash
# Test the endpoint
curl http://localhost:3000/__ping__

# With custom headers
curl -H "Authorization: Bearer token" http://localhost:3000/__ping__

# Check memory usage over time
watch -n 5 'curl -s http://localhost:3000/__ping__ | jq .memory'
```

---

## 📈 Monitoring Integration

### With Uptime Robot
Use the ping endpoint URL in Uptime Robot to monitor your server status and keep it warm.

### With Pingdom
Configure Pingdom to hit your `/__ping__` endpoint for uptime monitoring.

### With Custom Scripts
```bash
#!/bin/bash
# keep-warm.sh
while true; do
  curl -s https://your-app.render.com/__ping__ > /dev/null
  sleep 300  # Ping every 5 minutes
done
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

- 📖 [Documentation](https://github.com/yourusername/heimdall-nodejs-sdk/wiki)
- 🐛 [Report Issues](https://github.com/yourusername/heimdall-nodejs-sdk/issues)
- 💬 [Discussions](https://github.com/yourusername/heimdall-nodejs-sdk/discussions)
- 📧 Email: support@heimdall.dev

---

## 🙏 Acknowledgments

- Inspired by the need to keep free-tier servers warm
- Named after Heimdall, the Norse god who guards the Bifrost bridge
- Built with ❤️ for the Node.js community

---

**Keep your servers vigilant with Heimdall! 🛡️**