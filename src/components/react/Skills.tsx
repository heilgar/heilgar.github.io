import { useEffect } from 'react'
import { InfiniteScroll } from './InfiniteScroll'
import { getIcon } from './SkillsIconLoader'

// Types for technologies
type Category = {
  text: string
  logo: string
}

type Technologies = {
  'Backend & APIs': Category[]
  'Frontend & UI': Category[]
  'DevOps & Infrastructure': Category[]
  'CI/CD & Quality': Category[]
  'Observability & Monitoring': Category[]
  'Databases & Messaging': Category[]
}

const technologies: Technologies = {
  'Backend & APIs': [
    { text: 'C', logo: 'simple-icons:c' },
    { text: 'Python', logo: 'simple-icons:python' },
    { text: 'PHP', logo: 'simple-icons:php' },
    { text: 'Go', logo: 'simple-icons:go' },
    { text: 'Node.js', logo: 'simple-icons:nodedotjs' },
    { text: 'FastAPI', logo: 'simple-icons:fastapi' },
    { text: 'Fastify', logo: 'simple-icons:fastify' },
    { text: 'Laravel', logo: 'simple-icons:laravel' },
    { text: 'Symfony', logo: 'simple-icons:symfony' },
  ],
  'Frontend & UI': [
    { text: 'TypeScript', logo: 'simple-icons:typescript' },
    { text: 'React', logo: 'simple-icons:react' },
    { text: 'Next.js', logo: 'simple-icons:nextdotjs' },
    { text: 'Tailwind CSS', logo: 'simple-icons:tailwindcss' },
    { text: 'shadcn/ui', logo: 'lucide:component' },
    { text: 'Storybook', logo: 'simple-icons:storybook' },
  ],
  'DevOps & Infrastructure': [
    { text: 'Docker', logo: 'simple-icons:docker' },
    { text: 'AWS', logo: 'lucide:cloud' },
    { text: 'Terraform', logo: 'simple-icons:terraform' },
    { text: 'Ansible', logo: 'simple-icons:ansible' },
    { text: 'Kubernetes', logo: 'simple-icons:kubernetes' },
  ],
  'CI/CD & Quality': [
    { text: 'GitHub Actions', logo: 'simple-icons:githubactions' },
    { text: 'GitLab CI', logo: 'simple-icons:gitlab' },
    { text: 'Jenkins', logo: 'simple-icons:jenkins' },
    { text: 'SonarQube', logo: 'simple-icons:sonarqube' },
  ],
  'Observability & Monitoring': [
    { text: 'OpenTelemetry', logo: 'simple-icons:opentelemetry' },
    { text: 'Grafana', logo: 'simple-icons:grafana' },
    { text: 'Prometheus', logo: 'simple-icons:prometheus' },
  ],
  'Databases & Messaging': [
    { text: 'PostgreSQL', logo: 'simple-icons:postgresql' },
    { text: 'MySQL', logo: 'simple-icons:mysql' },
    { text: 'SQLite', logo: 'simple-icons:sqlite' },
    { text: 'Redis', logo: 'simple-icons:redis' },
    { text: 'MongoDB', logo: 'simple-icons:mongodb' },
    { text: 'Elasticsearch', logo: 'simple-icons:elasticsearch' },
    { text: 'Apache Kafka', logo: 'simple-icons:apachekafka' },
  ],
}

const categories = Object.keys(technologies)
const groupSize = Math.ceil(categories.length / 3)
const categoryGroups = [
  categories.slice(0, groupSize),
  categories.slice(groupSize, groupSize * 2),
  categories.slice(groupSize * 2),
]

const Skills: React.FC = () => {
  useEffect(() => {
    document.querySelectorAll('.tech-badge').forEach((badge) => {
      badge.classList.add('tech-badge-visible')
    })
  }, [])

  return (
    <div className="z-30 mt-12 flex w-full flex-col max-w-[calc(100vw-5rem)] mx-auto lg:max-w-full">
      <div className="space-y-2">
        {categoryGroups.map((group, groupIndex) => (
          <InfiniteScroll
            key={groupIndex}
            duration={50000}
            direction={groupIndex % 2 === 0 ? 'normal' : 'reverse'}
            showFade={true}
            className="flex flex-row justify-center"
          >
            {group.flatMap((category) =>
              technologies[category as keyof Technologies].map(
                (tech: Category, techIndex: number) => {
                  const IconComponent = getIcon(tech.logo)
                  return (
                    <div
                      key={`${category}-${techIndex}`}
                      className="tech-badge repo-card border-border bg-card text-muted-foreground mr-5 flex items-center gap-3 rounded-full border p-3 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md"
                      data-tech-name={`${category}-${techIndex}`}
                    >
                      <span className="bg-muted flex h-10 w-10 items-center justify-center rounded-full p-2 text-lg shadow-inner">
                        <IconComponent className="tech-icon text-primary" />
                      </span>
                      <span className="text-foreground font-medium">
                        {tech.text}
                      </span>
                    </div>
                  )
                },
              ),
            )}
          </InfiniteScroll>
        ))}
      </div>
    </div>
  )
}

export default Skills
