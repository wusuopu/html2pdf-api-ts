import app from "./app";
import config from "@/config";

const { PORT = 80 } = process.env;

const main = async () => {
  let listener = app.listen(PORT, () => {
    let address = listener.address()
    console.log(`server started in ${process.env.NODE_ENV} at ` + JSON.stringify(address), `with ${config.CONVERTOR}`);
  });
}
if (require.main === module) {
  main()
}
