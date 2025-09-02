"use client";

import { useTranslations, useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import StructuredData from "@/components/StructuredData";
import PageLayout from "@/components/PageLayout";
import { track, pageview } from "@/lib/track";
import { useEffect } from "react";

// Project data - this could later be moved to a separate data file or CMS
const PROJECTS = {
  "nft-luxury-wine": {
    id: "nft-luxury-wine",
    name: "NFT Luxury Wine Marketplace",
    description: "A blockchain-powered marketplace for trading physically-redeemable luxury wine NFTs, bridging digital ownership with real-world assets.",
    longDescription: "This innovative marketplace combines the exclusivity of luxury wines with blockchain technology, creating a unique digital ecosystem where wine enthusiasts can own, trade, and eventually redeem physical bottles through NFTs. Built on Ethereum with robust smart contracts, it represents the future of collectible asset trading.",
    demoUrl: "https://nft-luxury-wine.netlify.app/",
    sourceUrl: "https://github.com/WINTERANDREA/blockchain-developer-bootcamp-final-project",
    image: "/project/nft-luxury-wine.png",
    techStack: ["Ethereum", "Solidity", "OpenZeppelin", "Truffle", "Ganache", "IPFS", "JavaScript"],
    category: "Blockchain & DeFi",
    status: "Live Demo",
    year: "2021",
    highlights: [
      "Ethereum-based smart contracts with OpenZeppelin ERC721",
      "Physical wine bottle redemption system", 
      "Winery-controlled NFT minting process",
      "IPFS integration for decentralized storage"
    ],
    challenges: [
      "Bridging digital ownership with physical asset redemption",
      "Implementing secure smart contract architecture",
      "Creating intuitive UX for blockchain interactions",
      "Ensuring scalability and gas optimization"
    ],
    results: [
      "Deployed on Ethereum testnet with full functionality",
      "Integrated IPFS for decentralized metadata storage",
      "Implemented secure redemption mechanism",
      "Built responsive React frontend"
    ]
  }
};

export default function ProjectPage() {
  const params = useParams();
  const locale = useLocale();
  const t = useTranslations("projectPage");
  const tProjects = useTranslations("projects");
  
  const slug = params?.slug as string;
  const project = PROJECTS[slug as keyof typeof PROJECTS];

  const site = process.env.NEXT_PUBLIC_SITE_URL!;
  const pageUrl = `${site}/${locale}/project/${slug}`;

  // Track page view
  useEffect(() => {
    if (project) {
      pageview();
      track("project_page_view", {
        project_slug: slug,
        project_name: project.name,
        locale
      });
    }
  }, [project, slug, locale]);

  const breadcrumbs = useMemo(() => [
    { name: "Home", item: `${site}/${locale}` },
    { name: "Projects", item: `${site}/${locale}#projects` },
    { name: tProjects(`${slug}.name`) || project?.name || slug, item: pageUrl }
  ], [site, locale, project, slug, pageUrl, tProjects]);

  if (!project) {
    return (
      <PageLayout locale={locale} showHomeLink={true} homeLinkText={t("backToHome")}>
        <div className="error-page">
          <h1>{t("projectNotFound")}</h1>
          <p>{t("projectNotFoundMessage", { slug })}</p>
          <a href={`/${locale}`} className="btn">{t("backToHomeButton")}</a>
        </div>
      </PageLayout>
    );
  }

  const handleActionClick = (type: "demo" | "source" | "home") => {
    track("project_action_click", {
      project_slug: slug,
      project_name: project.name,
      action_type: type,
      url: type === "demo" ? project.demoUrl : type === "source" ? project.sourceUrl : `/${locale}`
    });

    if (type === "home") {
      window.location.href = `/${locale}`;
    } else {
      window.open(type === "demo" ? project.demoUrl : project.sourceUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <PageLayout locale={locale} showHomeLink={true} homeLinkText={t("backToHome")}>

      {/* Project Header */}
      <header className="project-header">
        <div className="project-meta">
          <span className="chip tag">{tProjects(`${slug}.status`) || project.status}</span>
          <span className="chip">{tProjects(`${slug}.category`) || project.category}</span>
          <span className="chip">{project.year}</span>
        </div>
        <h1 className="project-title">{tProjects(`${slug}.name`) || project.name}</h1>
        <p className="project-description">{tProjects(`${slug}.description`) || project.description}</p>
      </header>

      {/* Project Image */}
      <section className="card" style={{ marginTop: 24 }}>
        <div className="project-image-large">
          <img
            src={project.image}
            alt={`Screenshot of ${project.name}`}
            loading="eager"
          />
        </div>
      </section>

      {/* Project Details */}
      <section className="card" style={{ marginTop: 18 }}>
        <div className="project-content">
          <div className="content-section">
            <h2>{t("aboutProject")}</h2>
            <p>{tProjects(`${slug}.longDescription`) || project.longDescription}</p>
          </div>

          <div className="content-section">
            <h3>{t("keyFeatures")}</h3>
            <ul className="feature-list">
              {project.highlights.map((highlight, index) => {
                const translatedHighlight = tProjects(`${slug}.highlights.${index}`);
                return (
                  <li key={index}>{translatedHighlight || highlight}</li>
                );
              })}
            </ul>
          </div>

          <div className="content-section">
            <h3>{t("challengesSolutions")}</h3>
            <div className="challenge-grid">
              <div>
                <h4>{t("challenges")}</h4>
                <ul>
                  {project.challenges.map((challenge, index) => {
                    const translatedChallenge = tProjects(`${slug}.challenges.${index}`);
                    return (
                      <li key={index}>{translatedChallenge || challenge}</li>
                    );
                  })}
                </ul>
              </div>
              <div>
                <h4>{t("results")}</h4>
                <ul>
                  {project.results.map((result, index) => {
                    const translatedResult = tProjects(`${slug}.results.${index}`);
                    return (
                      <li key={index}>{translatedResult || result}</li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>

          <div className="content-section">
            <h3>{t("technologyStack")}</h3>
            <div className="chipset">
              {project.techStack.map((tech) => (
                <span key={tech} className="chip tag">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Project Actions */}
      <section className="card" style={{ marginTop: 18 }}>
        <div className="project-actions-large">
          <div className="action-group">
            <button
              className="btn btn-primary"
              onClick={() => handleActionClick("demo")}
              aria-label={`View live demo of ${project.name}`}
            >
              {t("viewLiveDemo")}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => handleActionClick("source")}
              aria-label={`View source code for ${project.name}`}
            >
              {t("viewSourceCode")}
            </button>
          </div>
          <p className="help">
            {t("exploreHelp")}
          </p>
        </div>
      </section>

      {/* Structured Data */}
      <StructuredData
        pageUrl={pageUrl}
        pageTitle={`${tProjects(`${slug}.name`) || project.name} — Andrea Casero`}
        pageDescription={tProjects(`${slug}.description`) || project.description}
        locale={locale}
        breadcrumbs={breadcrumbs}
        project={project}
      />

      <style jsx>{`
        .project-header {
          margin-bottom: 24px;
        }

        .project-meta {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .project-title {
          font-size: 2.5em;
          font-weight: 800;
          margin: 0 0 16px 0;
          line-height: 1.2;
          color: var(--text);
        }

        .project-description {
          font-size: 1.2em;
          line-height: 1.6;
          color: var(--muted);
          margin: 0;
          max-width: 800px;
        }

        .project-image-large {
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid var(--border);
          background: var(--bg-subtle);
        }

        .project-image-large img {
          width: 100%;
          height: auto;
          display: block;
        }

        .project-content {
          max-width: 800px;
        }

        .content-section {
          margin-bottom: 32px;
        }

        .content-section:last-child {
          margin-bottom: 0;
        }

        .content-section h2 {
          font-size: 1.8em;
          font-weight: 700;
          margin: 0 0 16px 0;
          color: var(--text);
        }

        .content-section h3 {
          font-size: 1.4em;
          font-weight: 600;
          margin: 0 0 16px 0;
          color: var(--text);
        }

        .content-section h4 {
          font-size: 1.1em;
          font-weight: 600;
          margin: 0 0 12px 0;
          color: var(--accent);
        }

        .content-section p {
          font-size: 1.05em;
          line-height: 1.7;
          color: var(--text);
          margin: 0 0 16px 0;
        }

        .feature-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .feature-list li {
          position: relative;
          padding-left: 24px;
          margin-bottom: 12px;
          line-height: 1.6;
        }

        .feature-list li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: var(--accent);
          font-weight: bold;
          font-size: 1.1em;
        }

        .challenge-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          margin-top: 16px;
        }

        .challenge-grid ul {
          list-style: none;
          padding: 0;
          margin: 8px 0 0 0;
        }

        .challenge-grid li {
          position: relative;
          padding-left: 16px;
          margin-bottom: 8px;
          line-height: 1.5;
          font-size: 0.95em;
        }

        .challenge-grid li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: var(--muted);
        }

        .project-actions-large {
          text-align: center;
        }

        .action-group {
          display: flex;
          gap: 16px;
          justify-content: center;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .btn {
          padding: 14px 24px;
          border-radius: 8px;
          border: none;
          font-weight: 600;
          font-size: 1em;
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

        .error-page {
          text-align: center;
          padding: 60px 20px;
        }

        .error-page h1 {
          font-size: 2em;
          margin-bottom: 16px;
          color: var(--text);
        }

        .error-page p {
          font-size: 1.1em;
          color: var(--muted);
          margin-bottom: 24px;
        }

        @media (max-width: 768px) {
          .project-title {
            font-size: 2em;
          }

          .project-description {
            font-size: 1.1em;
          }

          .challenge-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .action-group {
            flex-direction: column;
            align-items: center;
          }

          .btn {
            width: 100%;
            max-width: 280px;
            justify-content: center;
          }
        }
      `}</style>
    </PageLayout>
  );
}