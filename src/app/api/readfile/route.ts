import fs from "fs";

export async function POST(request: Request) {
  const { path } = await request.json();
  console.log('ddd', path)
  const stat = fs.statSync(path);
  return Response.json({ mtimeMS: stat.mtimeMs, mtime:stat.mtime});
}
