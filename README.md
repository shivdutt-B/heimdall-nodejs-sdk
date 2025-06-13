# 🛡️ heimdall-nodejs-sdk

[![npm version](https://img.shields.io/npm/v/heimdall-nodejs-sdk.svg)](https://www.npmjs.com/package/heimdall-nodejs-sdk)
[![license](https://img.shields.io/npm/l/heimdall-nodejs-sdk)](./LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/yourusername/heimdall-nodejs-sdk)](https://github.com/shivdutt-B/heimdall-nodejs-sdk/issues)
[![GitHub stars](https://img.shields.io/github/stars/yourusername/heimdall-nodejs-sdk)](https://github.com/shivdutt-B/heimdall-nodejs-sdk)

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


## 🔒 Security

Heimdall is designed with security in mind:

- **Read-only**: The endpoint only exposes system metadata, no sensitive data
- **No tampering**: Users cannot modify the response or inject custom data (unless explicitly configured)
- **Rate limiting**: Built-in protection against abuse
- **CORS control**: Fine-grained control over cross-origin requests
- **Authentication**: Optional custom authentication middleware

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

## 🙏 Acknowledgments

- Inspired by the need to keep free-tier servers warm
- Named after Heimdall, the Norse god who guards the Bifrost bridge
- Built with ❤️ for the Node.js community

---

**Keep your servers vigilant with Heimdall! 🛡️**