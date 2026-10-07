import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="quick-links">
          <h3>Quick Links</h3>
          <Link href="/faculty">Faculty</Link>
          <Link href="/services">Services</Link>
          <Link href="/educational-videos">Educational Resources</Link>
          <Link href="/donate">Donate</Link>
          <div className="social-icons">
            <a href="#" aria-label="LinkedIn">
              <i className="fab fa-linkedin fa-2x"></i>
            </a>
            <a
              href="https://youtube.com/@departmentofpalliativemedi3282?si=RH1ywubZyEn3dFq6"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <i className="fab fa-youtube fa-2x"></i>
            </a>
          </div>
        </div>

        <div className="contact-us">
          <h3>Contact Us</h3>
          <div className="contact-item">
            <i className="fa-solid fa-envelope"></i>
            <a href="mailto:palcare@cmcvellore.ac.in">palcare@cmcvellore.ac.in</a>
          </div>
          <div className="contact-item">
            <i className="fa-solid fa-phone"></i>
            <span className="contact-phone">+91 0416-228-3159</span>
          </div>
          <div className="contact-item">
            <i className="fa-solid fa-location-dot"></i>
            <div>
              <h5>Outpatient Clinic Locations</h5>
              <div className="clinic-locations">
                <p>CMC Vellore, Main Campus OPD Block 1st floor, Near PCF</p>
                <p>CMC Vellore, Ranipet Campus A Block, Basement A0002</p>
                <p>CMC Vellore, Chittoor Campus Room No:15, North OPD Palliative Medicine.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="line" aria-hidden="true"></div>

        <div className="department-logo">
          <img src="/Images/we in the spot.png" alt="Department of Palliative Medicine" />
          <div className="footer-bottom">
            <h2>&copy; 2024 Department of Palliative Medicine - Christian Medical College, Vellore. All Rights Reserved.</h2>
            <p className="money">
              <a href="https://cleof.us" target="_blank" rel="noopener noreferrer">
                built by cleo
              </a>
            </p>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .site-footer {
          background-color: #002855;
          color: #ffffff;
          font-family: 'Montserrat', sans-serif;
        }

        .footer-container {
          max-width: 1352px;
          margin: 0 auto;
          padding: 0 45px;
          display: grid;
          grid-template-columns: 1fr 1fr 40px 2fr;
          gap: 80px;
        }

        .quick-links h3,
        .contact-us h3 {
          font-size: 24px;
          margin-bottom: 20px;
          font-weight: 600;
        }

        .quick-links a {
          display: block;
          color: #ffffff;
          text-decoration: none;
          font-size: 16px;
          margin-bottom: 12px;
          font-weight: 600;
        }

        .quick-links a:hover {
          text-decoration: underline;
        }

        .social-icons {
          margin-top: 20px;
          margin-bottom: 16px;
        }

        .social-icons a {
          display: inline-block;
          margin-right: 16px;
          font-size: 24px;
          transition: color 0.3s ease;
          color: inherit;
        }

        .social-icons a:hover {
          color: #6089b7;
        }

        .contact-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 16px;
          gap: 12px;
        }

        .contact-item i {
          font-size: 20px;
          margin-top: 4px;
        }

        .contact-item a,
        .contact-item span,
        .contact-item h5 {
          color: #ffffff;
          font-size: 16px;
          font-weight: 600;
          text-decoration: none;
          margin: 0;
        }

        .contact-item h5 {
          text-decoration: underline;
        }

        .clinic-locations {
          margin-top: 8px;
          font-size: 14px;
          font-weight: 400;
          line-height: 1.4;
        }

        .line {
          border-left: 0.5px solid rgb(255, 255, 255);
          height: 250px;
          margin-top: 30px;
          justify-self: center;
        }

        .department-logo {
          text-align: right;
        }

        .department-logo img {
          max-width: 559px;
          width: 100%;
          height: auto;
          margin-top: 30px;
          margin-bottom: 40px;
          transition: transform 0.3s ease;
        }

        .department-logo img:hover {
          transform: scale(1.02);
        }

        .footer-bottom {
          margin-top: 40px;
          text-align: left;
          grid-column: 1 / -1;
          font-size: 14px;
          font-weight: 600;
        }

        .footer-bottom h2 {
          margin: 4px 0;
          font-size: 14px;
          font-weight: 600;
        }

        .footer-bottom p {
          margin-top: 10.85px;
          font-size: 10px;
          font-weight: 600;
        }

        .footer-bottom a {
          color: #ffffff;
          text-decoration: none;
        }

        .footer-bottom a:hover {
          text-decoration: underline;
        }

        .money a {
          font-family: 'Courier New', monospace;
          font-size: 16px;
          font-weight: 700;
          background: linear-gradient(120deg, #6089b7 0%, #ffffff 40%, #6089b7 50%, #ffffff 60%, #6089b7 100%);
          background-size: 200% auto;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          transition: background-position 0.5s ease;
        }

        .money a:hover {
          animation: shine 1.5s linear infinite;
        }

        @keyframes shine {
          0% {
            background-position: -100% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        @media (max-width: 1024px) {
          .footer-container {
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }

          .line {
            display: none;
          }

          .department-logo {
            grid-column: 1 / -1;
            text-align: center;
          }
        }

        @media (max-width: 768px) {
          .footer-container {
            grid-template-columns: 1fr;
            gap: 32px;
          }

          .quick-links,
          .contact-us,
          .department-logo {
            text-align: left;
          }

          .department-logo img {
            max-width: 100%;
          }
        }
      `}</style>
    </footer>
  );
}
