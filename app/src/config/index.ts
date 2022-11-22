import { config } from 'dotenv';
import path from "path";
import _ from "lodash";

if (process.env.NODE_ENV === 'test') {
  config({ path: path.resolve(process.cwd(), '.env.test'), override: true });
} else {
  config({ path: path.resolve(process.cwd(), '.env'), override: true });
}

export const ROOT_PATH = path.resolve(process.cwd());

const Config: any = _.pick(process.env, [
  'NODE_ENV', 'CONVERTOR', 'GOOGLE_CHROME_BIN_PATH', 'WKHTMLTOPDF_BIN_PATH',
]);

export default Config;
