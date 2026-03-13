/**
 * Optimized icon loader for Skills component
 * This helps with tree-shaking by importing icons only when needed
 */
import { type IconType } from 'react-icons'
import { FaQuestionCircle } from 'react-icons/fa'
import {
  SiAnsible,
  SiApachekafka,
  SiDocker,
  SiElasticsearch,
  SiFastapi,
  SiFastify,
  SiGithubactions,
  SiGitlab,
  SiGo,
  SiGrafana,
  SiJenkins,
  SiKubernetes,
  SiLaravel,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiOpentelemetry,
  SiPhp,
  SiPostgresql,
  SiPrometheus,
  SiPython,
  SiReact,
  SiRedis,
  SiSonarqube,
  SiSqlite,
  SiStorybook,
  SiSymfony,
  SiTailwindcss,
  SiTerraform,
  SiTypescript,
} from 'react-icons/si'
import { TbLetterC } from 'react-icons/tb'
import {
  Cloud,
  Component,
} from 'lucide-react'

// Icon mapping - using direct imports for better tree-shaking
export const iconMap: { [key: string]: IconType } = {
  // Backend & APIs
  'simple-icons:c': TbLetterC,
  'simple-icons:python': SiPython,
  'simple-icons:php': SiPhp,
  'simple-icons:go': SiGo,
  'simple-icons:nodedotjs': SiNodedotjs,
  'simple-icons:fastapi': SiFastapi,
  'simple-icons:fastify': SiFastify,
  'simple-icons:laravel': SiLaravel,
  'simple-icons:symfony': SiSymfony,
  // Frontend & UI
  'simple-icons:typescript': SiTypescript,
  'simple-icons:react': SiReact,
  'simple-icons:nextdotjs': SiNextdotjs,
  'simple-icons:tailwindcss': SiTailwindcss,
  'lucide:component': Component,
  'simple-icons:storybook': SiStorybook,
  // DevOps & Infrastructure
  'simple-icons:docker': SiDocker,
  'lucide:cloud': Cloud,
  'simple-icons:terraform': SiTerraform,
  'simple-icons:ansible': SiAnsible,
  'simple-icons:kubernetes': SiKubernetes,
  // CI/CD & Quality
  'simple-icons:githubactions': SiGithubactions,
  'simple-icons:gitlab': SiGitlab,
  'simple-icons:jenkins': SiJenkins,
  'simple-icons:sonarqube': SiSonarqube,
  // Observability & Monitoring
  'simple-icons:opentelemetry': SiOpentelemetry,
  'simple-icons:grafana': SiGrafana,
  'simple-icons:prometheus': SiPrometheus,
  // Databases & Messaging
  'simple-icons:postgresql': SiPostgresql,
  'simple-icons:mysql': SiMysql,
  'simple-icons:sqlite': SiSqlite,
  'simple-icons:redis': SiRedis,
  'simple-icons:mongodb': SiMongodb,
  'simple-icons:elasticsearch': SiElasticsearch,
  'simple-icons:apachekafka': SiApachekafka,
}

export function getIcon(logo: string): IconType {
  return iconMap[logo] || FaQuestionCircle
}
