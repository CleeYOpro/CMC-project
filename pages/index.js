import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useForm, usePlugin } from "tinacms";
import ReactMarkdown from "react-markdown";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getPageContent } from "../lib/content";

const renderCell = (value) => {
  if (!value) {
    return null;
  }

  return value.split(/\r?\n/).map((line, index, array) => (
    <span key={`${line}-${index}`}>
      {line}
      {index < array.length - 1 && <br />}
    </span>
  ));
};

export default function Home({ initialData }) {
  const formConfig = useMemo(
    () => ({
      id: "index",
      label: "Home Page",
      initialValues: {
        ...initialData.frontmatter,
        body: initialData.markdown,
      },
      fields: [
        { name: "title", label: "Page Title", component: "text" },
        {
          name: "heroSlides",
          label: "Hero Slides",
          component: "group-list",
          itemProps: (item) => ({
            key: item?.image || item?.text,
            label: item?.text ? item.text.substring(0, 40) : "Slide",
          }),
          defaultItem: { text: "", image: "" },
          fields: [
            { name: "text", label: "Slide Text", component: "textarea" },
            { name: "image", label: "Image Path", component: "text" },
          ],
        },
        {
          name: "whoWeAre",
          label: "Who We Are",
          component: "group",
          fields: [
            { name: "heading", label: "Heading", component: "text" },
            { name: "text", label: "Description", component: "textarea" },
            { name: "ctaLabel", label: "Button Label", component: "text" },
            { name: "ctaHref", label: "Button Link", component: "text" },
          ],
        },
        { name: "servicesHeading", label: "Services Heading", component: "text" },
        {
          name: "services",
          label: "Services",
          component: "group-list",
          itemProps: (item) => ({
            key: item?.title,
            label: item?.title || "Service",
          }),
          defaultItem: { title: "", description: "", image: "" },
          fields: [
            { name: "title", label: "Title", component: "text" },
            { name: "description", label: "Description", component: "textarea" },
            { name: "image", label: "Image Path", component: "text" },
          ],
        },
        { name: "servicesCtaLabel", label: "Services Button Label", component: "text" },
        { name: "servicesCtaHref", label: "Services Button Link", component: "text" },
        { name: "scheduleHeading", label: "Schedule Heading", component: "text" },
        {
          name: "scheduleColumns",
          label: "Schedule Columns",
          component: "list",
          field: { component: "text" },
        },
        {
          name: "scheduleRows",
          label: "Schedule Rows",
          component: "group-list",
          itemProps: (item) => ({
            key: item?.day,
            label: item?.day || "Schedule Row",
          }),
          defaultItem: { day: "", townCampus: "", ranipetCampus: "", chittoorCampus: "" },
          fields: [
            { name: "day", label: "Day", component: "text" },
            { name: "townCampus", label: "Town Campus", component: "textarea" },
            { name: "ranipetCampus", label: "Ranipet Campus", component: "textarea" },
            { name: "chittoorCampus", label: "Chittoor Campus", component: "textarea" },
          ],
        },
        { name: "testimonialsHeading", label: "Testimonials Heading", component: "text" },
        {
          name: "testimonials",
          label: "Testimonials",
          component: "group-list",
          itemProps: (item, index) => ({ key: `${item?.author}-${index}`, label: item?.author || "Testimonial" }),
          defaultItem: { quote: "", author: "" },
          fields: [
            { name: "quote", label: "Quote", component: "textarea" },
            { name: "author", label: "Author", component: "text" },
          ],
        },
        { name: "body", label: "Additional Body Markdown", component: "textarea" },
      ],
      onSubmit: async (values) => {
        const { body, ...frontmatter } = values;
        await fetch("/api/save-content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug: "index", frontmatter, body }),
        });
      },
    }),
    [initialData]
  );

  const [data, form] = useForm(formConfig);
  usePlugin(form);

  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = data.heroSlides || [];
  const testimonials = data.testimonials || [];
  const testimonialLoop = useMemo(() => [...testimonials, ...testimonials], [testimonials]);

  useEffect(() => {
    if (!slides.length) {
      return undefined;
    }

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const changeSlide = (direction) => {
    if (!slides.length) {
      return;
    }
    setCurrentSlide((prev) => (prev + direction + slides.length) % slides.length);
  };

  return (
    <>
      <Head>
        <title>{data.title || "Department of Palliative Medicine"}</title>
      </Head>
      <Navbar />
      <main>
        <section className="container1">
          <div className="text-container">
            <div className="textbox">
              {slides.map((slide, index) => (
                <div className={`slide${index === currentSlide ? " active" : ""}`} key={slide.text || index}>
                  {slide.text}
                </div>
              ))}
            </div>
            {slides.length > 1 && (
              <div className="controls">
                <div className="arrows">
                  <button type="button" className="icon-button" onClick={() => changeSlide(-1)} aria-label="Previous slide">
                    <i className="fa-solid fa-square-caret-left" style={{ color: "#6089B7" }}></i>
                  </button>
                  <button type="button" className="icon-button" onClick={() => changeSlide(1)} aria-label="Next slide">
                    <i className="fa-solid fa-square-caret-right" style={{ color: "#6089B7" }}></i>
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="image-box">
            {slides.map((slide, index) => (
              <img
                key={slide.image || index}
                src={slide.image}
                alt={slide.text || `Slide ${index + 1}`}
                className={index === currentSlide ? "active" : ""}
              />
            ))}
          </div>
        </section>

        <section className="who-we-are-section">
          <div className="who-we-are-wrapper">
            <div className="who-we-are-content">
              <h2 className="who-we-are-heading">{data.whoWeAre?.heading}</h2>
              <p className="who-we-are-text">{data.whoWeAre?.text}</p>
            </div>
            {data.whoWeAre?.ctaHref && (
              <Link href={data.whoWeAre.ctaHref} className="who-we-are-btn">
                {data.whoWeAre?.ctaLabel || "Read More"}
              </Link>
            )}
          </div>
        </section>

        <section className="what-we-do-section">
          <h2 className="what-we-do-heading">{data.servicesHeading}</h2>
          <div className="service-cards-container">
            {(data.services || []).map((service) => (
              <div className="service-card" key={service.title}>
                {service.image && <img src={service.image} alt={service.title} />}
                <div className="service-card-content">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
              </div>
            ))}
          </div>
          {data.servicesCtaHref && (
            <Link href={data.servicesCtaHref} className="read-more-button">
              {data.servicesCtaLabel || "Read More"}
            </Link>
          )}
        </section>

        <section className="schedule">
          <h2 className="schedule-heading2">{data.scheduleHeading}</h2>
          <div className="schedule-container">
            <table>
              <thead>
                <tr>
                  {(data.scheduleColumns || []).map((column) => (
                    <th key={column}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(data.scheduleRows || []).map((row) => (
                  <tr key={row.day}>
                    <td>{row.day}</td>
                    <td>{renderCell(row.townCampus)}</td>
                    <td>{renderCell(row.ranipetCampus)}</td>
                    <td>{renderCell(row.chittoorCampus)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="testimonials-section">
          <h2 className="testimonials-heading">{data.testimonialsHeading}</h2>
          <div className="testimonials-container">
            <div className="testimonials-track">
              {testimonialLoop.map((testimonial, index) => (
                <div className="testimonial-slide" key={`${testimonial.author}-${index}`}>
                  <div className="testimonial-box">
                    <div className="quote-icon">
                      <i className="fas fa-quote-left"></i>
                    </div>
                    <p className="testimonial-text">{testimonial.quote}</p>
                    <p className="testimonial-author">{testimonial.author}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {data.body && (
          <section className="additional-content">
            <ReactMarkdown>{data.body}</ReactMarkdown>
          </section>
        )}
      </main>
      <Footer />
      <style jsx global>{`
        main {
          width: 100%;
        }

        .icon-button {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
        }

        .container1 {
          display: flex;
          margin: 80px auto;
          width: 100%;
          max-width: 1352px;
          padding: 0 32px;
          box-sizing: border-box;
        }

        .text-container {
          width: 100%;
          max-width: 875px;
          min-height: 404px;
          background-color: #ffffff;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .textbox {
          width: 100%;
          max-width: 677px;
          min-height: 291px;
          background-color: #ffffff;
          font-size: clamp(36px, 5vw, 60px);
          font-family: 'Domine', serif;
          font-weight: bold;
          text-align: left;
          line-height: 135%;
          position: relative;
          overflow: hidden;
          margin-bottom: 20px;
          display: flex;
        }

        .slide {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity 0.5s ease-in-out;
        }

        .slide.active {
          opacity: 1;
        }

        .controls {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .image-box {
          width: 100%;
          max-width: 450px;
          margin-left: 32px;
          position: relative;
          overflow: hidden;
        }

        .image-box img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity 0.5s ease-in-out;
          object-fit: cover;
          border-radius: 15px;
        }

        .image-box img.active {
          opacity: 1;
        }

        .who-we-are-section {
          background-color: #002855;
          margin-top: 60px;
          padding: 40px 0;
          color: #fdfdfd;
        }

        .who-we-are-wrapper {
          max-width: 1352px;
          margin: 0 auto;
          padding: 0 32px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 24px;
        }

        .who-we-are-heading {
          font-family: 'Domine', serif;
          font-size: 60px;
          margin: 0 0 8px 0;
          font-weight: 700;
        }

        .who-we-are-text {
          font-family: 'Montserrat', sans-serif;
          font-size: 16px;
          line-height: 135%;
          margin: 0;
          font-weight: 500;
        }

        .who-we-are-btn {
          font-family: 'Montserrat', sans-serif;
          font-size: 20px;
          font-weight: 600;
          color: white;
          background-color: transparent;
          border: 4px solid white;
          padding: 14px 46px;
          border-radius: 4px;
          text-decoration: none;
          align-self: center;
          transition: all 0.3s ease;
        }

        .who-we-are-btn:hover {
          background-color: white;
          color: #002855;
        }

        .what-we-do-section {
          max-width: 1352px;
          margin: 80px auto;
          padding: 0 32px;
          box-sizing: border-box;
        }

        .what-we-do-heading,
        .schedule-heading2,
        .testimonials-heading {
          font-family: 'Domine', serif;
          font-size: 60px;
          color: #002855;
          text-align: center;
          margin-bottom: 56px;
        }

        .service-cards-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          justify-items: center;
        }

        .service-card {
          width: 100%;
          max-width: 319px;
          border: 4px solid #6089b7;
          border-radius: 16px;
          overflow: hidden;
        }

        .service-card img {
          width: 100%;
          height: auto;
          object-fit: cover;
        }

        .service-card h3 {
          font-family: 'Domine', serif;
          font-size: 19px;
          color: #002855;
          font-weight: bold;
          padding: 16px;
        }

        .service-card p {
          font-family: 'Montserrat', sans-serif;
          font-size: 14px;
          line-height: 1.5;
          color: #333333;
          padding: 0 16px 16px;
        }

        .read-more-button {
          display: block;
          width: 390px;
          height: 64px;
          margin: 56px auto 0;
          background-color: #002855;
          color: white;
          border: none;
          border-radius: 8px;
          font-family: 'Montserrat', sans-serif;
          font-size: 20px;
          font-weight: 600;
          text-align: center;
          text-decoration: none;
          line-height: 64px;
          transition: background-color 0.3s ease;
        }

        .read-more-button:hover {
          background-color: #6089b7;
        }

        .schedule {
          margin: 80px 0;
          padding: 0 32px;
        }

        .schedule-container {
          max-width: 1250px;
          margin: 0 auto;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        table {
          width: 100%;
          min-width: 800px;
          border-collapse: separate;
          border-spacing: 0;
          margin: 20px 0;
          font-size: 18px;
          text-align: left;
          border-radius: 10px;
          overflow: hidden;
        }

        th,
        td {
          padding: 12px;
          border: 2px solid #dddddd69;
        }

        th {
          background-color: #002855;
          color: white;
          text-align: center;
        }

        td {
          background-color: #ffffff;
          text-align: center;
        }

        .testimonials-section {
          max-width: 1352px;
          margin: 60px auto;
          padding: 0 32px 32px;
          position: relative;
        }

        .testimonials-section::before,
        .testimonials-section::after {
          content: '';
          position: absolute;
          top: 0;
          width: 150px;
          height: 100%;
          z-index: 2;
          pointer-events: none;
        }

        .testimonials-section::before {
          left: 0;
          background: linear-gradient(to right, white 0%, rgba(47, 55, 85, 0) 110%);
        }

        .testimonials-section::after {
          right: 0;
          background: linear-gradient(to left, white 0%, rgba(47, 55, 85, 0) 110%);
        }

        .testimonials-container {
          display: flex;
          overflow: hidden;
          gap: 24px;
          position: relative;
        }

        .testimonials-track {
          display: flex;
          gap: 24px;
          animation: scroll 15s linear infinite;
        }

        .testimonial-slide {
          flex: 0 0 auto;
          width: 300px;
          margin: 0 10px;
          display: flex;
        }

        .testimonial-box {
          background-color: #f8f9fa;
          border-radius: 16px;
          padding: 20px;
          width: 100%;
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 250px;
          border: 4px solid #77899d;
        }

        .testimonial-text {
          font-family: 'Domine', serif;
          font-size: 16px;
          line-height: 1.5;
          color: #000f21;
          margin-bottom: 16px;
          flex-grow: 1;
        }

        .testimonial-author {
          font-family: 'Montserrat', sans-serif;
          font-size: 13px;
          color: #77899d;
          font-style: italic;
          margin-top: auto;
        }

        .quote-icon {
          color: #6089b7;
          font-size: 24px;
          margin-bottom: 16px;
        }

        .additional-content {
          max-width: 960px;
          margin: 60px auto;
          padding: 0 32px;
          font-family: 'Montserrat', sans-serif;
          line-height: 1.7;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @media (max-width: 768px) {
          .container1 {
            flex-direction: column;
            align-items: center;
            gap: 16px;
            margin: 0 auto;
            padding: 0 16px;
          }

          .image-box {
            margin-left: 0;
            width: 100%;
            max-width: 100%;
            aspect-ratio: 450/403;
          }

          .text-container {
            order: 2;
            margin: 0;
            width: 100%;
            min-height: unset;
            height: auto;
          }

          .textbox {
            font-size: 22px;
            margin-bottom: 0;
            padding: 0;
            width: 100%;
            min-height: unset;
            height: auto;
          }

          .controls {
            display: none;
          }

          .who-we-are-heading,
          .what-we-do-heading,
          .schedule-heading2,
          .testimonials-heading {
            font-size: 36px;
            margin-bottom: 24px;
          }

          .who-we-are-wrapper {
            flex-direction: column;
            align-items: flex-start;
            gap: 24px;
          }

          .what-we-do-section {
            margin: 56px auto;
          }

          .read-more-button {
            width: 100%;
            max-width: 390px;
          }

          .schedule {
            margin: 40px 0;
          }

          .testimonials-section::before,
          .testimonials-section::after {
            display: none;
          }

          .testimonial-slide {
            width: 250px;
          }
        }

        @media (max-width: 480px) {
          .testimonial-slide {
            width: 200px;
          }
        }
      `}</style>
    </>
  );
}

export async function getStaticProps() {
  const initialData = await getPageContent("index");
  return {
    props: {
      initialData,
    },
  };
}
