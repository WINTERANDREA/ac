"use client";

import { useTranslations, useLocale } from "next-intl";
import { track } from "@/lib/track";
import { useRouter } from "next/navigation";

export default function HighlightedProjects() {
  const t = useTranslations("highlightedProjects");
  const project = t.raw("project");
  const locale = useLocale();
  const router = useRouter();

  const handleProjectClick = (type: "demo" | "source" | "details") => {
    track("highlighted_project_click", {
      project_title: project.title,
      click_type: type,
      url: type === "demo" ? project.demoUrl : type === "source" ? project.sourceUrl : `/${locale}/project/nft-luxury-wine`,
    });
    
    if (type === "details") {
      router.push(`/${locale}/project/nft-luxury-wine`);
    } else {
      window.open(type === "demo" ? project.demoUrl : project.sourceUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <section className="card" style={{ marginTop: 18 }}>
      <div className="sectionHead">
        <div className="sectionKicker">{t("kicker")}</div>
        <h3 className="sectionTitle">{t("title")}</h3>
        <p className="subtle" style={{ marginTop: 8 }}>
          {t("subtitle")}
        </p>
      </div>

      <article className="highlightedProject">
        <div className="projectHeader">
          <div className="projectMeta">
            <span className="chip tag">{project.status}</span>
            <span className="chip">{project.category}</span>
          </div>
          <h4 className="projectTitle">{project.title}</h4>
          <p className="projectDescription">{project.description}</p>
        </div>

        <div className="projectImage">
          <img
            src="/project/nft-luxury-wine.png"
            alt={`Screenshot of ${project.title}`}
            loading="lazy"
          />
        </div>

        <div className="projectContent">
          <div className="projectHighlights">
            <h5>{t("keyFeatures")}</h5>
            <ul>
              {project.highlights.map((highlight: string, index: number) => (
                <li key={index}>{highlight}</li>
              ))}
            </ul>
          </div>

          <div className="projectTech">
            <h5>{t("technologyStack")}</h5>
            <div className="chipset">
              {project.techStack.map((tech: string) => (
                <span key={tech} className="chip tag">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="projectActions">
          <div className="actionGroup">
            <button
              className="btn btn-primary"
              onClick={() => handleProjectClick("details")}
              aria-label={`View details of ${project.title}`}
            >
              📖 {t("viewDetails")}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => handleProjectClick("demo")}
              aria-label={`View live demo of ${project.title}`}
            >
              🚀 {t("cta")}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => handleProjectClick("source")}
              aria-label={`View source code for ${project.title}`}
            >
              📋 {t("viewCode")}
            </button>
          </div>
          <span className="help">{t("ctaHelp")}</span>
        </div>
      </article>

      <style jsx>{`
        .highlightedProject {
          border: 2px solid var(--accent);
          border-radius: 12px;
          padding: 24px;
          background: linear-gradient(135deg, var(--bg) 0%, var(--accent-2) 1%, var(--bg) 100%);
          position: relative;
          overflow: hidden;
        }

        .highlightedProject::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--accent), var(--accent-2), var(--accent));
          background-size: 200% 100%;
          animation: shimmer 3s ease-in-out infinite;
        }

        @keyframes shimmer {
          0%, 100% { background-position: 200% 0; }
          50% { background-position: -200% 0; }
        }

        .projectHeader {
          margin-bottom: 20px;
        }

        .projectImage {
          margin: 20px 0;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid var(--border);
        }

        .projectImage img {
          width: 100%;
          height: auto;
          display: block;
          transition: transform 0.3s ease;
        }

        .projectImage:hover img {
          transform: scale(1.02);
        }

        .projectMeta {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }

        .projectTitle {
          font-size: 1.5em;
          font-weight: 700;
          margin: 0 0 12px 0;
          color: var(--accent);
        }

        .projectDescription {
          font-size: 1.05em;
          line-height: 1.6;
          margin: 0;
          color: var(--text);
        }

        .projectContent {
          margin: 20px 0;
        }

        .projectHighlights,
        .projectTech {
          margin-bottom: 20px;
        }

        .projectHighlights h5,
        .projectTech h5 {
          font-size: 0.9em;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--muted);
          margin: 0 0 12px 0;
        }

        .projectHighlights ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .projectHighlights li {
          position: relative;
          padding-left: 20px;
          margin-bottom: 8px;
          line-height: 1.5;
        }

        .projectHighlights li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: var(--accent);
          font-weight: bold;
        }

        .projectActions {
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid var(--border);
        }

        .actionGroup {
          display: flex;
          gap: 12px;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }

        .btn {
          padding: 12px 20px;
          border-radius: 8px;
          border: none;
          font-weight: 600;
          font-size: 0.95em;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-primary {
          background: var(--accent);
          color: var(--bg);
        }

        .btn-primary:hover {
          background: var(--accent-2);
          transform: translateY(-1px);
        }

        .btn-secondary {
          background: transparent;
          color: var(--text);
          border: 1px solid var(--border);
        }

        .btn-secondary:hover {
          background: var(--accent-2);
          color: var(--bg);
          border-color: var(--accent-2);
        }

        @media (max-width: 768px) {
          .highlightedProject {
            padding: 18px;
          }
          
          .actionGroup {
            flex-direction: column;
          }
          
          .btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}