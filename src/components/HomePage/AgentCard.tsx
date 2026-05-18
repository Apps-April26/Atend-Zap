import Link from 'next/link'
import styles from './styles.module.css'

interface Agent {
  number: string
  name: string
  route: string
  description: string
  color: string
  gradient: string
  gradientLight: string
  textDark: string
  iconBg: string
  iconPath: string
  widgetUrl: string
}

interface AgentCardProps {
  agent: Agent
}

export default function AgentCard({ agent }: AgentCardProps) {
  return (
    <Link
      href={`/agentes/${agent.route}`}
      className={styles.card}
      style={{
        '--card-gradient': agent.gradient,
        '--card-gradient-light': agent.gradientLight,
        '--card-icon-bg': agent.iconBg,
        '--card-text-dark': agent.textDark,
        '--card-color': agent.color,
      } as React.CSSProperties}
    >
      <div className={styles.cardGlow} />
      <div className={styles.cardContent}>
        <div className={styles.cardTop}>
          <div className={styles.pill}>
            <span className={styles.pillNumber}>{agent.number}</span>
          </div>
          <svg
            className={styles.icon}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d={agent.iconPath} />
          </svg>
        </div>

        <h2 className={styles.cardName}>{agent.name}</h2>
        <p className={styles.cardDescription}>{agent.description}</p>

        <span className={styles.chatButton}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
          </svg>
          Conversar
        </span>
      </div>
    </Link>
  )
}