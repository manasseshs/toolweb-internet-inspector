
import { toolSEOConfig } from '@/utils/seoConfig';
import { getToolInfo } from '@/utils/toolsConfig';

interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  toolName: string;
}

export const getSEOConfig = (selectedTool: string, toolToUrlMap: Record<string, string>): SEOConfig => {
  if (selectedTool && toolSEOConfig[selectedTool]) {
    const config = toolSEOConfig[selectedTool];
    return {
      title: config.title,
      description: config.description,
      keywords: config.keywords,
      canonicalUrl: toolToUrlMap[selectedTool],
      toolName: getToolInfo(selectedTool).name
    };
  }
  
  // Default homepage SEO
  return {
    title: 'Professional Network & Email Diagnostic Tools',
    description: 'Professional network analysis and email testing suite. IP blacklist checks, DNS lookups, email deliverability tests, and more. Free online tools for IT professionals.',
    keywords: 'network tools, DNS lookup, IP blacklist, email testing, SMTP test, network diagnostic, email verification, domain analysis',
    canonicalUrl: '/',
    toolName: 'ToolWeb.io'
  };
};
