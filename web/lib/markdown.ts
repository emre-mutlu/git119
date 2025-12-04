import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Define the base directory for your Markdown content relative to the project root
// This path is from the root of the entire git119 repository.
const CONTENT_BASE_DIR = path.join(process.cwd(), '../Ders_Icerigi');

export interface MarkdownContent {
  data: { [key: string]: any };
  content: string;
  slug: string;
}

/**
 * Reads a markdown file and parses its frontmatter and content.
 * @param relativePath The path to the markdown file relative to CONTENT_BASE_DIR.
 * @returns {MarkdownContent} An object containing the frontmatter data and markdown content.
 */
export function getMarkdownContent(relativePath: string): MarkdownContent | null {
  const fullPath = path.join(CONTENT_BASE_DIR, relativePath);

  if (!fs.existsSync(fullPath)) {
    console.warn(`Markdown file not found: ${fullPath}`);
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const slug = relativePath.replace(/\.md$/, '');

  return { data, content, slug };
}

/**
 * Recursively gets all markdown files and their slugs from a given directory.
 * @param dirPath The path to the directory relative to CONTENT_BASE_DIR.
 * @param allSlugs An array to accumulate slugs.
 * @param currentPath The current path segment being processed recursively.
 * @returns An array of slugs (e.g., ['mufredat/syllabus', 'haftalar/hafta_01/ders_plani']).
 */
export function getAllMarkdownSlugs(dirPath: string = '', allSlugs: string[] = [], currentPath: string = ''): string[] {
  const fullDirPath = path.join(CONTENT_BASE_DIR, dirPath);

  if (!fs.existsSync(fullDirPath)) {
    return allSlugs;
  }

  const files = fs.readdirSync(fullDirPath);

  files.forEach(file => {
    const filePath = path.join(fullDirPath, file);
    const relativeFilePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllMarkdownSlugs(relativeFilePath, allSlugs, path.join(currentPath, file));
    } else if (file.endsWith('.md')) {
      const slug = path.join(currentPath, file.replace(/\.md$/, ''));
      allSlugs.push(slug);
    }
  });

  return allSlugs;
}

/**
 * Get all markdown content for a given category (e.g., 'Mufredat', 'Haftalar/Hafta_01').
 * @param categoryPath The path to the category directory relative to CONTENT_BASE_DIR.
 * @returns An array of MarkdownContent objects.
 */
export function getCategoryMarkdownContent(categoryPath: string): MarkdownContent[] {
    const fullCategoryPath = path.join(CONTENT_BASE_DIR, categoryPath);
    const slugs = getAllMarkdownSlugs(categoryPath);
    
    return slugs.map(slug => {
        // Reconstruct the full relative path for getMarkdownContent
        const fullRelativePath = path.join(categoryPath, path.basename(slug) + '.md');
        return getMarkdownContent(fullRelativePath);
    }).filter((content): content is MarkdownContent => content !== null);
}
