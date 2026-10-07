import Head from "next/head";
import { useMemo } from "react";
import { useForm, usePlugin } from "tinacms";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getPageContent } from "../lib/content";

export default function AboutPage({ initialData }) {
  const formConfig = useMemo(
    () => ({
      id: "aboutus",
      label: "About Page",
      initialValues: {
        title: initialData.frontmatter.title || "",
        subtitle: initialData.frontmatter.subtitle || "",
        hero: initialData.frontmatter.hero || { title: "", image: "" },
        compassionateCare: initialData.frontmatter.compassionateCare || {
          title: "",
          image: "",
          text: "",
        },
        dualSection: initialData.frontmatter.dualSection || { text: "", image: "" },
        awards: initialData.frontmatter.awards || { heading: "", icon: "", items: [] },
        teamPhoto: initialData.frontmatter.teamPhoto || "",
        body: initialData.markdown || "",
      },
      fields: [
        { name: "title", label: "Page Title", component: "text" },
        { name: "subtitle", label: "Subtitle", component: "text" },
        {
          name: "hero",
          label: "Hero",
          component: "group",
          fields: [
            { name: "title", label: "Hero Title", component: "text" },
            { name: "image", label: "Hero Image", component: "text" },
          ],
        },
        {
          name: "compassionateCare",
          label: "Compassionate Care",
          component: "group",
          fields: [
            { name: "title", label: "Section Title", component: "text" },
            { name: "image", label: "Image Path", component: "text" },
            { name: "text", label: "Description", component: "textarea" },
          ],
        },
        {
          name: "dualSection",
          label: "Additional Section",
          component: "group",
          fields: [
            { name: "text", label: "Text", component: "textarea" },
            { name: "image", label: "Image Path", component: "text" },
          ],
        },
        {
          name: "awards",
          label: "Awards",
          component: "group",
          fields: [
            { name: "heading", label: "Heading", component: "text" },
            { name: "icon", label: "Font Awesome Icon Class", component: "text" },
            {
              name: "items",
              label: "Award Items",
              component: "group-list",
              itemProps: (item, index) => ({ key: `${item?.ctaHref}-${index}`, label: item?.ctaLabel || "Award" }),
              defaultItem: { image: "", description: "", ctaLabel: "", ctaHref: "" },
              fields: [
                { name: "image", label: "Image", component: "text" },
                { name: "description", label: "Description", component: "textarea" },
                { name: "ctaLabel", label: "Button Label", component: "text" },
                { name: "ctaHref", label: "Button Link", component: "text" },
              ],
            },
          ],
        },
        { name: "teamPhoto", label: "Team Photo", component: "text" },
        { name: "body", label: "Additional Body Markdown", component: "textarea" },
      ],
      onSubmit: async (values) => {
        const { body, ...frontmatter } = values;
        await fetch("/api/save-content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug: "aboutus", frontmatter, body }),
        });
      },
    }),
    [initialData]
  );

  const [data, form] = useForm(formConfig);
  usePlugin(form);

  return (
    <>
      <Head>
        <title>{data.title || "About Us"}</title>
      </Head>
      <Navbar />
      <main className="about-page">
        <section className="hero-section">
          {data.hero?.image && <img src={data.hero.image} alt={data.hero?.title} />}
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1 className="hero-title">{data.hero?.title}</h1>
          </div>
        </section>

        <section className="compassionate-care">
          <div className="care-image">
            {data.compassionateCare?.image && (
              <img src={data.compassionateCare.image} alt={data.compassionateCare?.title} />
            )}
          </div>
          <div className="care-content">
            <h2 className="care-title">{data.compassionateCare?.title}</h2>
            <div className="care-text">{data.compassionateCare?.text}</div>
          </div>
        </section>

        <section className="dual-container">
          <div className="info-box">{data.dualSection?.text}</div>
          <div className="image-container">
            {data.dualSection?.image && (
              <img src={data.dualSection.image} alt="Palliative care team providing support" />
            )}
          </div>
        </section>

        <section className="awards-section">
          <div className="Awards-header">
            {data.awards?.icon && <i className={data.awards.icon}></i>}
            <h1>{data.awards?.heading}</h1>
          </div>
          {(data.awards?.items || []).map((item) => (
            <div className="award-container" key={item.ctaHref}>
              <div className="award-image">
                {item.image && <img src={item.image} alt={item.description?.slice(0, 40)} />}
              </div>
              <div className="award-content">
                <div className="award-text">{item.description}</div>
                {item.ctaHref && (
                  <a
                    href={item.ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="award-button"
                  >
                    {item.ctaLabel || "Read More"}
                  </a>
                )}
              </div>
            </div>
          ))}
        </section>

        {data.teamPhoto && (
          <section className="group-photo-container">
            <img src={data.teamPhoto} alt="Palliative Care Team" className="group-photo" />
          </section>
        )}
      </main>
      <Footer />
      <style jsx global>{`
        .about-page {
          font-family: 'Montserrat', sans-serif;
          color: #0b3c72;
        }

        .hero-section {
          position: relative;
          width: 100%;
          height: 507px;
          overflow: hidden;
        }

        .hero-section img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(26, 49, 75, 0.3);
        }

        .hero-content {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          width: 100%;
        }

        .hero-title {
          font-family: 'Domine', serif;
          font-size: 72px;
          color: white;
          margin: 0;
          padding: 0 20px;
        }

        .compassionate-care {
          max-width: 1352px;
          margin: 80px auto;
          padding: 0 80px;
          display: flex;
          gap: 40px;
          align-items: center;
        }

        .care-image {
          flex: 1;
          max-height: 614px;
          border-radius: 16px;
          max-width: 685px;
          overflow: hidden;
        }

        .care-image img {
          width: 100%;
          height: auto;
          display: block;
          border-radius: 16px;
        }

        .care-content {
          flex: 1;
          max-width: 630px;
        }

        .care-title {
          font-family: 'Domine', serif;
          font-size: 60px;
          margin: 0 0 40px 0;
          line-height: 120%;
        }

        .care-text {
          font-size: 20px;
          line-height: 135%;
          background-color: #0b3c72;
          color: white;
          padding: 24px;
          border-radius: 8px;
          text-align: justify;
        }

        .dual-container {
          max-width: 1352px;
          margin: 80px auto;
          padding: 0 80px;
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }

        .info-box {
          flex: 1;
          border-radius: 16px;
          background-color: #0b3c72;
          color: white;
          padding: 24px;
          font-size: 20px;
          line-height: 135%;
          text-align: justify;
        }

        .image-container {
          flex: 1;
          border-radius: 16px;
          overflow: hidden;
          height: 398px;
        }

        .image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .Awards-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin: 80px 0 40px;
          color: #0b3c72;
        }

        .Awards-header h1 {
          font-family: 'Domine', serif;
          font-size: 60px;
          margin: 0;
        }

        .Awards-header i {
          font-size: 64px;
        }

        .award-container {
          max-width: 1352px;
          margin: 0 auto 48px;
          padding: 0 48px;
          display: flex;
          gap: 24px;
          align-items: flex-start;
        }

        .award-image {
          flex: 0 0 437px;
          height: 312px;
          border-radius: 16px;
          overflow: hidden;
        }

        .award-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .award-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .award-text {
          font-size: 34px;
          line-height: 135%;
        }

        .award-button {
          width: 390px;
          height: 56px;
          border: 4px solid #0b3c72;
          border-radius: 4px;
          color: #0b3c72;
          font-weight: 600;
          font-size: 20px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .award-button:hover {
          background-color: #0b3c72;
          color: white;
        }

        .group-photo-container {
          max-width: 1352px;
          margin: 80px auto;
          padding: 0 48px;
        }

        .group-photo {
          width: 100%;
          border-radius: 16px;
          display: block;
        }

        @media (max-width: 1200px) {
          .compassionate-care,
          .dual-container,
          .award-container,
          .group-photo-container {
            padding: 0 40px;
          }
        }

        @media (max-width: 992px) {
          .hero-title {
            font-size: 64px;
          }

          .compassionate-care,
          .dual-container {
            flex-direction: column;
            padding: 0 32px;
          }

          .care-title {
            font-size: 36px;
            margin-top: 16px;
          }

          .image-container {
            width: 100%;
            height: auto;
          }

          .award-container {
            flex-direction: column;
            padding: 0 32px;
            text-align: center;
          }

          .award-button {
            margin: 0 auto;
          }
        }

        @media (max-width: 480px) {
          .hero-section {
            height: 400px;
          }

          .hero-title {
            font-size: 48px;
          }

          .compassionate-care,
          .dual-container,
          .group-photo-container {
            padding: 0 20px;
            margin: 40px auto;
          }

          .care-title {
            font-size: 32px;
          }

          .care-text,
          .info-box {
            font-size: 16px;
            padding: 24px;
          }

          .award-text {
            font-size: 20px;
          }
        }

        @media (max-width: 360px) {
          .hero-title {
            font-size: 40px;
          }

          .Awards-header h1 {
            font-size: 32px;
          }

          .award-text,
          .info-box {
            font-size: 14px;
          }
        }
      `}</style>
    </>
  );
}

export async function getStaticProps() {
  const initialData = await getPageContent("aboutus");
  return {
    props: {
      initialData,
    },
  };
}
