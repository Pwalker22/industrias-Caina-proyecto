const app = require("./Src/App/app");

const os = require("os");

const port = process.env.PORT || 3001;

app.listen(port, () => {
  const interfaces = os.networkInterfaces();
  let ipAddress = "";

  for (const iface of Object.values(interfaces)) {
    for (const alias of iface) {
      if (alias.family === "IPv4" && !alias.internal) {
        ipAddress = alias.address;
        break;
      }
    }
    if (ipAddress) break;
  }
  console.log(
    `--------------servidor corriendo en http://localhost:${port}--------`
  );
  console.log(
    `--------------server running on http://${ipAddress}:${port}--------`
  );
});
