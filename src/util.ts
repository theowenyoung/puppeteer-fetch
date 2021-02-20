import { promises } from 'fs';
const { readFile } = promises;
import { resolve } from 'path';
export const getContent = async (path: string): Promise<string> => {
  return readFile(path, 'utf8');
};
export const getFixContent = async (path: string): Promise<string> => {
  const filePath = resolve(__dirname, './fixtures', path);
  return getContent(filePath);
};
