import app from "./app";
import config from "./config/config";
import "./cron/expireBundles"; 

const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`🎉 Server running on port ${PORT}`);
});
