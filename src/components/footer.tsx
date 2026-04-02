import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground font-mono">
        <p>made with coffee & curiosity</p>
        <div className="flex gap-4">
          <Link href="https://github.com/gnaponie" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            GitHub
          </Link>
          <Link href="https://gitlab.com/gnaponie" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            GitLab
          </Link>
          <Link href="https://linkedin.com/in/giulia-naponiello-7909b881/en/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            LinkedIn
          </Link>
        </div>
      </div>
    </footer>
  );
}
