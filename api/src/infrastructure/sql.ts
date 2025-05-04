import { dirname, join } from "path";
import pgp from 'pg-promise';
const QueryFile = pgp.QueryFile;
import { fileURLToPath } from "url";

export default function sql(modulePath: string, file: string) {
  const __filename = fileURLToPath(modulePath);
  const __dirname = dirname(__filename);
  const fullPath = join(__dirname, file);
  return new QueryFile(fullPath, {minify: true});
}
