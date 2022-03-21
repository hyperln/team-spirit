import globby from 'globby';

export async function readFilesInDir(dir: string): Promise<string[]> {
  return globby(`${dir}/**/*.tsx`);
}
