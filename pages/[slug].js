import Head from "next/head";
import { useMemo } from "react";
import { useForm, usePlugin } from "tinacms";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getPageContent, getPageSlugs } from "../lib/content";

export default function ContentPage({ slug, initialData }) {
  const formConfig = useMemo(
    () => ({
      id: slug,
      label: `${slug} Page`,
      initialValues: {
        title: initialData.frontmatter.title || "",
        subtitle: initialData.frontmatter.subtitle || "",
        body: initialData.markdown || "",
      },
      fields: [
        { name: "title", label: "Title", component: "text" },
        { name: "subtitle", label: "Subtitle", component: "text" },
        { name: "body", label: "Body", component: "textarea" },
      ],
      onSubmit: async (values) => {
        const { body, ...frontmatter } = values;
        await fetch("/api/save-content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug, frontmatter, body }),
        });
      },
    }),
    [slug, initialData]
  );

  const [data, form] = useForm(formConfig);
  usePlugin(form);

  return (
    <>
      <Head>
        <title>{data.title || "Department of Palliative Medicine"}</title>
      </Head>
      <Navbar />
      <main className="generic-page">
        <header className="generic-page__header">
          <h1>{data.title}</h1>
          {data.subtitle && <p className="generic-page__subtitle">{data.subtitle}</p>}
        </header>
        <article className="generic-page__content">
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>{data.body}</ReactMarkdown>
        </article>
      </main>
      <Footer />
      <style jsx global>{`
        .generic-page {
          max-width: 960px;
          margin: 60px auto;
          padding: 0 32px 80px;
          font-family: 'Montserrat', sans-serif;
          line-height: 1.7;
        }

        .generic-page__header {
          text-align: center;
          margin-bottom: 48px;
        }

        .generic-page__header h1 {
          font-family: 'Domine', serif;
          font-size: clamp(32px, 5vw, 54px);
          color: #002855;
          margin-bottom: 12px;
        }

        .generic-page__subtitle {
          font-size: 18px;
          color: #324a65;
          margin: 0;
        }

        .generic-page__content h2 {
          font-family: 'Domine', serif;
          color: #002855;
          margin-top: 40px;
        }

        .generic-page__content a {
          color: #002855;
          text-decoration: underline;
        }

        .generic-page__content table {
          width: 100%;
          border-collapse: collapse;
          margin: 32px 0;
        }

        .generic-page__content th,
        .generic-page__content td {
          border: 1px solid rgba(0, 40, 85, 0.1);
          padding: 12px;
          text-align: left;
        }

        .generic-page__content img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
        }

        @media (max-width: 768px) {
          .generic-page {
            padding: 0 16px 60px;
          }
        }
      `}</style>
    </>
  );
}

export async function getStaticPaths() {
  const reserved = new Set(["index", "aboutus"]);
  const slugs = getPageSlugs().filter((slug) => !reserved.has(slug));
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const initialData = await getPageContent(params.slug);
  return {
    props: {
      slug: params.slug,
      initialData,
    },
  };
}
