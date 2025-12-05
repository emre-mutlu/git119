import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Define the base directory for your Markdown content relative to the project root
// This path is from the root of the entire git119 repository.
const CONTENT_BASE_DIR = path.join(process.cwd(), '../Ders_Icerigi');

// URL to file path mapping for case-insensitive matching
const PATH_MAPPINGS: { [key: string]: string } = {
  'mufredat': 'Mufredat',
  'syllabus': 'Syllabus',
  'kaynaklar': 'Kaynaklar',
  'kaynakca': 'Kaynakca',
  'kisayollar': 'Kisayollar',
  'haftalar': 'Haftalar',
  'sablonlar': 'Sablonlar',
  'odev-brief': 'Odev_Brief_Sablonu',
  'degerlendirme-rubrigi': 'Degerlendirme_Rubrigi_Sablonu',
  'raporlar-ve-analizler': 'Raporlar_ve_Analizler',
  'ders-icerigi-gozden-gecirme-raporu': 'Ders_Icerigi_Gozden_Gecirme_Raporu',
};

function mapUrlToPath(urlSegment: string): string {
  return PATH_MAPPINGS[urlSegment.toLowerCase()] || urlSegment;
}

export interface MarkdownMeta {
  title?: string;
  description?: string;
  week?: number;
  order?: number;
  category?: string;
  duration?: string;
  [key: string]: any;
}

export interface MarkdownContent {
  data: MarkdownMeta;
  content: string;
  slug: string;
}

export interface WeekMeta {
  weekNum: string; // '01', '02', etc.
  title: string;
  description: string;
  slug: string;
}

/**
 * Reads a markdown file and parses its frontmatter and content.
 * @param relativePath The path to the markdown file relative to CONTENT_BASE_DIR.
 * @returns {MarkdownContent} An object containing the frontmatter data and markdown content.
 */
export function getMarkdownContent(relativePath: string): MarkdownContent | null {
  // Map URL segments to actual file paths
  const mappedPath = relativePath.split('/').map(mapUrlToPath).join('/');
  const fullPath = path.join(CONTENT_BASE_DIR, mappedPath);

  if (!fs.existsSync(fullPath)) {
    // Try the original path as fallback
    const originalFullPath = path.join(CONTENT_BASE_DIR, relativePath);
    if (!fs.existsSync(originalFullPath)) {
      console.warn(`Markdown file not found: ${fullPath} or ${originalFullPath}`);
      return null;
    }
    const fileContents = fs.readFileSync(originalFullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const slug = relativePath.replace(/\.md$/, '');
    return { data, content, slug };
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
    const slugs = getAllMarkdownSlugs(categoryPath);
    
    return slugs.map(slug => {
        // Reconstruct the full relative path for getMarkdownContent
        const fullRelativePath = path.join(categoryPath, path.basename(slug) + '.md');
        return getMarkdownContent(fullRelativePath);
    }).filter((content): content is MarkdownContent => content !== null);
}

/**
 * Retrieves metadata for all weeks by scanning the 'Haftalar' directory.
 * It looks for 'Ders_Plani.md' in each 'Hafta_XX' folder.
 * Returns a sorted array of WeekMeta objects.
 */
export function getAllWeeksMeta(): WeekMeta[] {
  const weeksDir = path.join(CONTENT_BASE_DIR, 'Haftalar');
  
  if (!fs.existsSync(weeksDir)) {
    return [];
  }

  const weekFolders = fs.readdirSync(weeksDir).filter(file => 
    fs.statSync(path.join(weeksDir, file)).isDirectory() && file.startsWith('Hafta_')
  );

  const weeksData = weekFolders.map(folder => {
    const weekNum = folder.replace('Hafta_', '');
    const dersPlaniPath = path.join(weeksDir, folder, 'Ders_Plani.md');
    
    let title = 'Ders Planı';
    let description = '';

    if (fs.existsSync(dersPlaniPath)) {
      const fileContents = fs.readFileSync(dersPlaniPath, 'utf8');
      const { data } = matter(fileContents);
      
      if (data.title) title = data.title;
      if (data.description) description = data.description;
    }

    return {
      weekNum,
      title,
      description,
      slug: `/Haftalar/${folder}/Ders_Plani`
    };
  });

  // Sort by week number
  return weeksData.sort((a, b) => parseInt(a.weekNum) - parseInt(b.weekNum));
}